import {fastMap} from 'src/utils/fast'
import {groupByTimeSeriesTransform} from 'src/utils/groupByTimeSeriesTransform'
import {
  TimeSeriesServerResponse,
  TimeSeries,
  TimeSeriesValue,
  InfluxQLQueryType,
  TimeSeriesToTableGraphReturnType,
  Label,
} from 'src/types/series'
import {fetchData} from 'src/worker/utils'
//  转化查询回来的数据
const timeSeriesToTableData = (
  timeSeries: TimeSeries[],
  queryType: InfluxQLQueryType
): TimeSeriesValue[][] => {
  switch (queryType) {
    case InfluxQLQueryType.MetaQuery:
      return fastMap<TimeSeries, TimeSeriesValue[]>(
        timeSeries,
        ({time: firstVal, values}) => {
          if (firstVal) {
            return [firstVal, ...values]
          }
          return values
        }
      )
    case InfluxQLQueryType.DataQuery:
      // console.log('sup1--', timeSeries)
      return fastMap<TimeSeries, TimeSeriesValue[]>(
        timeSeries,
        ({time, values}) => [time, ...values]
      )
    case InfluxQLQueryType.ComboQuery:
      throw new Error('Cannot display meta and data query')
  }
}

export const timeSeriesToTableGraphWork = (
  raw: TimeSeriesServerResponse[]
): TimeSeriesToTableGraphReturnType => {
  const isTable = true
  const {
    sortedLabels,
    sortedTimeSeries,
    queryType,
    metaQuerySeries,
    sortedLabelsCustom,
    sortedTimeSeriesCustom,
  } = groupByTimeSeriesTransform(raw, isTable)
  
  if (queryType === InfluxQLQueryType.MetaQuery) {
    return {
      data: metaQuerySeries,
      sortedLabels,
      influxQLQueryType: queryType,
      dataCustom: null,
      sortedLabelsCustom: null,
    }
  }

  let labels = fastMap<Label, string>(sortedLabels, ({label}) => label)
  // console.log('sup1-1',raw,sortedTimeSeries)
  if (queryType === InfluxQLQueryType.DataQuery) {
    labels = ['time', ...labels]
  }

  const tableData = timeSeriesToTableData(sortedTimeSeries, queryType)
  // console.log('sup111',sortedTimeSeries,tableData)
  const data = tableData.length ? [labels, ...tableData] : [[]]
  if(sortedLabelsCustom!==null && sortedLabelsCustom !== null)
  {
    // sup test  增加查询的第二组数据
  let labelsCustom = fastMap<Label, string>(
    sortedLabelsCustom,
    ({label}) => label
  )
  if (queryType === InfluxQLQueryType.DataQuery) {
    labelsCustom = ['time', ...labelsCustom]
  }
  // console.log('sup',labelsCustom)

  const tableDataCustom = timeSeriesToTableData(
    sortedTimeSeriesCustom,
    queryType
  )
  // console.log('sup1',tableDataCustom)
  const dataCustom = tableDataCustom.length
  ? [labelsCustom, ...tableDataCustom]
  : [[]]
return {
  data,
  sortedLabels,
  influxQLQueryType: queryType,
  dataCustom,
  sortedLabelsCustom,
}
  }
  else{
    return {
      data,
      sortedLabels,
      influxQLQueryType: queryType,
      dataCustom: null,
      sortedLabelsCustom: null;
    }
  }
  
 
}

const timeSeriesToTableGraph = async (
  msg
): Promise<TimeSeriesToTableGraphReturnType> => {
  const {raw} = await fetchData(msg)
  return timeSeriesToTableGraphWork(raw)
}

export default timeSeriesToTableGraph
