import _ from 'lodash'
import {shiftDate} from 'src/shared/query/helpers'
import {
  fastMap,
  fastReduce,
  fastForEach,
  fastConcat,
  fastCloneArray,
} from 'src/utils/fast'

import {
  TimeSeriesServerResponse,
  TimeSeriesResult,
  TimeSeriesSeries,
  TimeSeriesValue,
  TimeSeriesSuccessfulResult,
  TimeSeries,
  InfluxQLQueryType,
} from 'src/types/series'
import {getDeep} from 'src/utils/wrappers'

interface Result {
  series: TimeSeriesSeries[]
  responseIndex: number
  isGroupBy?: boolean
}

interface Series {
  name?: string
  columns: string[]
  values: TimeSeriesValue[][]
  responseIndex: number
  seriesIndex: number
  isGroupBy?: boolean
  tags?: [{[x: string]: string}]
  tagsKeys?: string[]
}

interface Cells {
  isGroupBy: boolean[]
  seriesIndex: number[]
  responseIndex: number[]
  label: string[]
  value: TimeSeriesValue[]
  time: TimeSeriesValue[]
}

interface Label {
  label: string
  seriesIndex: number
  responseIndex: number
}

const flattenGroupBySeries = (
  results: TimeSeriesSuccessfulResult[],
  responseIndex: number,
  tags: {[x: string]: string}
): Result[] => {
  if (_.isEmpty(results)) {
    return []
  }

  const tagsKeys = _.keys(tags)
  // sup test
  let serierString = ''
  let firstColumnsString = ''
  if (responseIndex === 0) {
    serierString = '[0].series'
    firstColumnsString = '[0].series[0]columns'
  } else {
    serierString = '[' + String(responseIndex) + '].series'
    firstColumnsString = '[' + String(responseIndex) + '].series[0]columns'
  }
  // const seriesArray = getDeep<TimeSeriesSeries[]>(results, '[0].series', [])
  const seriesArray = getDeep<TimeSeriesSeries[]>(results, serierString, [])

  const accumulatedValues = fastReduce<TimeSeriesSeries, TimeSeriesValue[][]>(
    seriesArray,
    (acc, s) => {
      const tagsToAdd: string[] = tagsKeys.map(tk => s.tags[tk])
      const values = s.values
      const newValues = values.map(([first, ...rest]) => [
        first,
        ...tagsToAdd,
        ...rest,
      ])
      return [...acc, ...newValues]
    },
    []
  )
  // const firstColumns = getDeep<string[]>(results, '[0].series[0]columns', [])
  const firstColumns = getDeep<string[]>(results, firstColumnsString, [])

  const flattenedSeries: Result[] = [
    {
      series: [
        {
          columns: firstColumns,
          tags: _.get(results, [responseIndex, 'series', 0, 'tags'], {}),
          name: _.get(results, [responseIndex, 'series', 0, 'name'], ''),
          values: [...accumulatedValues],
        },
      ],
      responseIndex,
      isGroupBy: true,
    },
  ]

  return flattenedSeries
}

const constructResults = (
  raw: TimeSeriesServerResponse[],
  isTable: boolean
): Result[][] => {
  const MappedResponse = fastMap<TimeSeriesServerResponse, Result[][]>(
    raw,
    (response, index) => {
      // 获取查询到的具体数据
      const results = getDeep<TimeSeriesResult[]>(
        response,
        'response.results',
        []
      )

      const successfulResults = results.filter(
        r => 'series' in r && !('error' in r)
      ) as TimeSeriesSuccessfulResult[]
      const tagsFromResults: {[x: string]: string} = _.get(
        results,
        ['0', 'series', '0', 'tags'],
        {}
      )
      // sup test 解析查询出来的第二组数据
      const tagsFromResults1: {[x: string]: string} = _.get(
        results,
        ['1', 'series', '0', 'tags'],
        {}
      )

      const hasGroupBy = !_.isEmpty(tagsFromResults)
      // const hasGroupBy1 = !_.isEmpty(tagsFromResults1)
      if (isTable && hasGroupBy) {
        const groupBySeries = flattenGroupBySeries(
          successfulResults,
          index,
          tagsFromResults
        )
        if (successfulResults.length === 1) {
          return [groupBySeries, null]
        }
        const groupBySeriesCustom = flattenGroupBySeries(
          successfulResults,
          index + 1,
          tagsFromResults1
        )
        return [groupBySeries, groupBySeriesCustom]
      }

      const noGroupBySeries = fastMap<TimeSeriesSuccessfulResult, Result>(
        successfulResults,
        r => ({
          ...r,
          responseIndex: index,
        })
      )
      return [noGroupBySeries, null]
    }
  )
  return _.flatten(MappedResponse)
}

const constructSerieses = (results: Result[]): Series[] => {
  return _.flatten(
    fastMap<Result, Series[]>(results, ({series, responseIndex, isGroupBy}) =>
      fastMap<TimeSeriesSeries, Series>(series, (s, index) => ({
        ...s,
        responseIndex,
        isGroupBy,
        seriesIndex: index,
      }))
    )
  )
}

const constructCells = (
  serieses: Series[]
): {
  cells: Cells
  sortedLabels: Label[]
  seriesLabels: Label[][]
  queryType: InfluxQLQueryType
  metaQuerySeries?: TimeSeriesValue[][]
} => {
  let cellIndex = 0
  let labels: Label[] = []
  let isMetaQuery = false
  let isDataQuery = false
  const seriesLabels: Label[][] = []
  const cells: Cells = {
    label: [],
    value: [],
    time: [],
    isGroupBy: [],
    seriesIndex: [],
    responseIndex: [],
  }
  let metaQuerySeries: TimeSeriesValue[][] = []

  fastForEach<Series>(
    serieses,
    (
      {
        name: measurement,
        columns,
        values = [],
        seriesIndex,
        responseIndex,
        isGroupBy,
        tags = {},
      },
      ind
    ) => {
      if (columns.find(c => c === 'time')) {
        let unsortedLabels: Label[]

        if (isGroupBy) {
          const labelsFromTags = fastMap<string, Label>(
            _.keys(tags),
            field => ({
              label: `${field}`,
              responseIndex,
              seriesIndex,
            })
          )
          const labelsFromColumns = fastMap<string, Label>(
            columns.slice(1),
            field => ({
              label: `${measurement}.${field}`,
              responseIndex,
              seriesIndex,
            })
          )

          unsortedLabels = fastConcat<Label>(labelsFromTags, labelsFromColumns)
          seriesLabels[ind] = unsortedLabels
          labels = _.concat(labels, unsortedLabels)
        } else {
          const tagSet = fastMap<string, string>(
            _.keys(tags),
            tag => `[${tag}=${tags[tag]}]`
          )
            .sort()
            .join('')

          unsortedLabels = fastMap<string, Label>(columns.slice(1), field => ({
            label: `${measurement}.${field}${tagSet}`,
            responseIndex,
            seriesIndex,
          }))
          seriesLabels[ind] = unsortedLabels
          labels = _.concat(labels, unsortedLabels)
          fastForEach(values, vals => {
            const [time, ...rowValues] = vals
            fastForEach(rowValues, (value, i) => {
              cells.label[cellIndex] = unsortedLabels[i].label
              cells.value[cellIndex] = value
              cells.time[cellIndex] = time
              isDataQuery = true
              cells.seriesIndex[cellIndex] = seriesIndex
              cells.responseIndex[cellIndex] = responseIndex
              cellIndex++ // eslint-disable-line no-plusplus
            })
          })
        }
      } else {
        isMetaQuery = true

        if (serieses.length === 1) {
          labels = columns.map(c => ({
            label: c,
            responseIndex,
            seriesIndex,
          }))

          metaQuerySeries = [columns, ...values]
        } else {
          labels = columns.map(c => ({
            label: c,
            responseIndex,
            seriesIndex,
          }))
          labels.unshift({
            label: 'measurement',
            responseIndex,
            seriesIndex,
          })

          const [, ...vals] = metaQuerySeries

          const allValuesForMeasurement = values.map(val => {
            return [measurement, ...val]
          })

          metaQuerySeries = [
            ['measurement', ...columns],
            ...vals,
            ...allValuesForMeasurement,
          ]
        }
      }
    }
  )

  let queryType: InfluxQLQueryType

  if (isMetaQuery && isDataQuery) {
    queryType = InfluxQLQueryType.ComboQuery
  } else if (isMetaQuery) {
    queryType = InfluxQLQueryType.MetaQuery
  } else {
    queryType = InfluxQLQueryType.DataQuery
  }

  const sortedLabels =
    queryType === InfluxQLQueryType.MetaQuery
      ? labels
      : _.sortBy(labels, 'label')

  return {cells, sortedLabels, seriesLabels, queryType, metaQuerySeries}
}

const insertGroupByValues = (
  serieses: Series[],
  seriesLabels: Label[][],
  labelsToValueIndex: {[x: string]: number},
  sortedLabels: Label[]
): TimeSeries[] => {
  const dashArray: TimeSeriesValue[] = Array(sortedLabels.length).fill('-')
  const timeSeries: TimeSeries[] = []

  for (let x = 0; x < serieses.length; x++) {
    const s = serieses[x]
    if (!s.isGroupBy) {
      continue
    }

    for (let i = 0; i < s.values.length; i++) {
      const [time, ...vss] = s.values[i]
      const tsRow: TimeSeries = {
        time,
        values: fastCloneArray(dashArray),
      }

      for (let j = 0; j < vss.length; j++) {
        const v = vss[j]
        const label = seriesLabels[x][j].label

        tsRow.values[
          labelsToValueIndex[label + s.responseIndex + s.seriesIndex]
        ] = v
      }

      timeSeries.push(tsRow)
    }
  }
  return timeSeries
}

const constructTimeSeries = (
  serieses: Series[],
  cells: Cells,
  sortedLabels: Label[],
  seriesLabels: Label[][]
): TimeSeries[] => {
  const nullArray: TimeSeriesValue[] = Array(sortedLabels.length).fill(null)

  const labelsToValueIndex = fastReduce<Label, {[x: string]: number}>(
    sortedLabels,
    (acc, {label, responseIndex, seriesIndex}, i) => {
      // adding series index prevents overwriting of two distinct labels that have the same field and measurements
      acc[label + responseIndex + seriesIndex] = i
      return acc
    },
    {}
  )

  const tsMemo = {}

  const timeSeries = insertGroupByValues(
    serieses,
    seriesLabels,
    labelsToValueIndex,
    sortedLabels
  )

  let existingRowIndex

  for (let i = 0; i < _.get(cells, ['value', 'length'], 0); i++) {
    let time
    time = cells.time[i]
    const value = cells.value[i]
    const label = cells.label[i]
    const seriesIndex = cells.seriesIndex[i]
    const responseIndex = cells.responseIndex[i]

    if (label.includes('_shifted__')) {
      const [, quantity, duration] = label.split('__')
      time = +shiftDate(time, quantity, duration).format('x')
    }

    existingRowIndex = tsMemo[time]

    // avoid memoizing null time columns for meta queries
    if (existingRowIndex === undefined || time === null) {
      timeSeries.push({
        time,
        values: fastCloneArray(nullArray),
      })

      existingRowIndex = timeSeries.length - 1
      tsMemo[time] = existingRowIndex
    }

    timeSeries[existingRowIndex].values[
      labelsToValueIndex[label + responseIndex + seriesIndex]
    ] = value
  }

  return _.sortBy(timeSeries, 'time')
}

export const groupByTimeSeriesTransform = (
  raw: TimeSeriesServerResponse[],
  isTable: boolean
): {
  sortedLabels: Label[]
  sortedTimeSeries: TimeSeries[]
  queryType: InfluxQLQueryType
  metaQuerySeries?: TimeSeriesValue[][]
  // sup test
  sortedLabelsCustom: Label[]
  sortedTimeSeriesCustom: TimeSeries[]
} => {
  const results = constructResults(raw, isTable)[0]
  const serieses = constructSerieses(results)
  // tslint:disable-next-line: prefer-const
  let sortedLabelsReturn: Label[][] = []
  let sortedLabelsCustom = null
  let sortedTimeSeriesCustom = null
  // console.log('sup1-3', results,raw)
  var {
    cells,
    sortedLabels,
    seriesLabels,
    queryType,
    metaQuerySeries,
  } = constructCells(serieses)
  // console.log('sup1-4', seriesLabels,sortedLabels,cells,queryType)
  sortedLabelsReturn.push(sortedLabels)
  // console.log('sup1-6', sortedLabelsReturn)
  if (queryType === InfluxQLQueryType.MetaQuery) {
    return {
      sortedLabels,
      sortedTimeSeries: null,
      queryType,
      metaQuerySeries,
      sortedLabelsCustom,
      sortedTimeSeriesCustom,
    }
  }
  const sortedTimeSeries = constructTimeSeries(
    serieses,
    cells,
    sortedLabels,
    seriesLabels
  )
  // console.log('sup1-5', sortedTimeSeries)
  // sup test
  const resultsCustom = constructResults(raw, isTable)[1]
  // console.log('sup1-2', sortedTimeSeries,sortedTimeSeriesCustom)
  if (resultsCustom == null) {
    return {
      sortedLabels,
      sortedTimeSeries,
      queryType,
      sortedLabelsCustom,
      sortedTimeSeriesCustom,
    }
  }
  const seriesesCustom = constructSerieses(resultsCustom)
  var {
    cells,
    sortedLabels,
    seriesLabels,
    queryType,
    metaQuerySeries,
  } = constructCells(seriesesCustom)
  sortedLabelsReturn.push(sortedLabels)
  sortedTimeSeriesCustom = constructTimeSeries(
    seriesesCustom,
    cells,
    sortedLabels,
    seriesLabels
  )
  sortedLabels = sortedLabelsReturn[0]
  sortedLabelsCustom = sortedLabelsReturn[1]
  // console.log('sup1-2', sortedLabelsReturn,sortedTimeSeries,sortedLabels,sortedLabelsCustom,sortedTimeSeriesCustom)
  return {
    sortedLabels,
    sortedTimeSeries,
    queryType,
    sortedLabelsCustom,
    sortedTimeSeriesCustom,
  }
}
