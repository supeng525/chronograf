// Libraries
import React, {PureComponent} from 'react'
import _ from 'lodash'
import uuid from 'uuid'
import memoizeOne from 'memoize-one'

// Components
import InvalidData from 'src/shared/components/InvalidData'

// Utils
import {timeSeriesToTableGraph} from 'src/utils/timeSeriesTransformers'
import {
  ErrorTypes,
  getInvalidDataMessage,
} from 'src/dashboards/utils/tableGraph'
import {isInluxQLDataEqual} from 'src/shared/graphs/helpers'

// Types
import {
  Label,
  TimeSeriesValue,
  TimeSeriesServerResponse,
  TimeSeriesToTableGraphReturnType,
} from 'src/types/series'
import {FluxTable} from 'src/types'
import {DataType} from 'src/shared/constants'

interface Props {
  data: TimeSeriesServerResponse[] | FluxTable
  uuid: string
  dataType: DataType
  children: (
    data: TimeSeriesToTableGraphReturnType,
    uuid: string,
    // customPrice: TimeSeriesToTableGraphReturnType
  ) => JSX.Element
}

interface State {
  transformedData: TimeSeriesToTableGraphReturnType
  invalidDataError: ErrorTypes
  // sup test  设置标的价格
  // customPrice: TimeSeriesToTableGraphReturnType
}

class TableGraphTransform extends PureComponent<Props, State> {
  private isComponentMounted: boolean
  private memoizedTimeSeriesToTableGraph = memoizeOne(
    timeSeriesToTableGraph,
    isInluxQLDataEqual
  )

  constructor(props: Props) {
    super(props)

    this.state = {
      transformedData: null,
      invalidDataError: null,
      // sup test
      // customPrice: null,
    }
  }

  public render() {
    // console.log('sup2',this.state)
    if (this.state.invalidDataError) {
      return (
        <InvalidData
          message={getInvalidDataMessage(this.state.invalidDataError)}
        />
      )
    }
    // console.log('sup3',this.state)

    if (!this.state.transformedData) {
      return null
    }
    // sup test
    return this.props.children(
      this.state.transformedData,
      uuid.v4(),
      // this.state.customPrice
    )
  }

  public componentDidMount() {
    this.isComponentMounted = true
    this.transformData()
  }

  public componentWillUnmount() {
    this.isComponentMounted = false
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.uuid !== this.props.uuid) {
      this.transformData()
    }
  }

  private async transformData() {
    const {dataType, data} = this.props  
    if (dataType === DataType.influxQL) {
      // console.log('sup1',data,dataType) 
      try {
        const influxQLData = await this.memoizedTimeSeriesToTableGraph(
          data as TimeSeriesServerResponse[]
        ) 
        // console.log('sup2',data,dataType)    
        if (!this.isComponentMounted) {
          return
        }
        // const data1 = data as TimeSeriesServerResponse[]
        this.setState({
          transformedData: influxQLData,
          invalidDataError: null,
          // customPrice: customPriceData,
        })
      } catch (err) {
        let invalidDataError: ErrorTypes
        switch (err.toString()) {
          case 'Error: Cannot display meta and data query':
            invalidDataError = ErrorTypes.MetaQueryCombo
            break
          default:
            invalidDataError = ErrorTypes.GeneralError
            break
        }

        if (!this.isComponentMounted) {
          return
        }
        this.setState({invalidDataError})
      }

      return
    }

    const resultData = (data as FluxTable).data
    const sortedLabels = _.get(resultData, '0', []).map(label => ({
      label,
      seriesIndex: 0,
      responseIndex: 0,
    }))

    const fluxData = {data: resultData, sortedLabels} as {
      data: TimeSeriesValue[][]
      sortedLabels: Label[]
      influxQLQueryType: null
      // sup
      dataCustom:TimeSeriesValue[][]
      sortedLabelsCustom: Label[]
    }

    if (!this.isComponentMounted) {
      return
    }

    this.setState({transformedData: fluxData})
  }
}

export default TableGraphTransform
