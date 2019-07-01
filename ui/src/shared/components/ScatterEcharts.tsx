// import * as React from 'react'
import ReactEcharts from 'echarts-for-react'
// Types
import {TimeSeriesValue} from 'src/types/series'
// Libraries
import React, {PureComponent, CSSProperties} from 'react'
import {withRouter, RouteComponentProps} from 'react-router'
import {array} from 'prop-types'
// 加入自定义legend小数点精度
import {DecimalPlaces, FieldOption} from 'src/types/dashboards'
import {toFixed} from 'src/shared/utils/decimalPlaces'

import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/scatter'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import {ColorString} from 'src/types/colors'
import { TableOptions } from 'src/dashboards/components/TableOptions';

interface Props {
  transformedData: TimeSeriesValue[][]
  decimalPlaces: DecimalPlaces
  dataCustom: TimeSeriesValue[][]
  // 标记background：strikePrice/Price-1  text:StrikePrice
  // onSort: (fieldName: string) => void
  // sort: Sort
  // dataType: DataType
  // tableOptions: TableOptions
  // timeFormat: string
  // fieldOptions: FieldOption[]
  // hoverTime: string
  // handleSetHoverTime?: (hovertime: string) => void
  colors: ColorString[]
  // editorLocation?: QueryUpdateState
  // onUpdateFieldOptions?: (fieldOptions: FieldOption[]) => void
}

type ScatterEchartsProps = Props & RouteComponentProps<any, any>

export class ScatterEcharts extends React.Component<Props> {
  constructor(props: ScatterEchartsProps) {
    super(props)
    this.state = {}
  }
  // public myChart: any
  public getOption() {
    const {transformedData, decimalPlaces, dataCustom, colors} = this.props
    // sup test
    let temp: any[] = []
    const data: any[][] = []
    let title = transformedData[0]
    // 标的价格
    const customPrice = dataCustom !== null ? dataCustom[1][1] : null
    // console.log('sup3',colors)
    // 是否需要以StrikePrice/Price-1百分比形式给出数据
    const percentageLabel: boolean =
      typeof colors[0] !== 'undefined' &&
      customPrice !== null &&
      colors[0].type === 'background'
        ? true
        : false
    // console.log('sup',customPrice,percentageLabel,colors[0])
    // column number
    const decimalPlacesTemp = {
      isEnforced: decimalPlaces.isEnforced,
      digits: decimalPlaces.digits - 2,
    }
    for (let i: number = 1; i < transformedData[0].length; i++) {
      temp = []
      // row number
      for (let j: number = 1; j < transformedData.length; j++) {
        if (transformedData[j][i] != null) {
          if (i === 1) {
            if (percentageLabel) {
              temp.push(
                Number(
                  toFixed(
                    (Number(transformedData[j][i]) / Number(customPrice) - 1) *
                      100,
                    decimalPlacesTemp
                  )
                )
              )
            } else {
              temp.push(
                Number(toFixed(Number(transformedData[j][i]), decimalPlaces))
              )
            }
            continue
          }
          temp.push(
            Number(
              toFixed(Number(transformedData[j][i]) * 100, decimalPlacesTemp)
            )
          )
        } else {
          temp.push(null)
        }
      }
      data.push(temp)
    }
    const itemStyle = {
      normal: {
        opacity: 0.8,
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
      },
    }
    // console.log(transformedData,data)
    const series: any[] = []
    for (let i = 1; i < data.length; i++) {
      const temp: any[] = []
      for (let j = 0; j < data[0].length; j++) {
        temp.push([data[0][j], data[i][j]])
      }
      // console.log(data,title)
      series.push({
        name: String(title[i + 1]),
        type: 'scatter',
        itemStyle,
        data: temp,
      })
    }
    // 删除x轴值
    // x轴name
    const axisName = title[1]
    title = title.slice(2, title.length + 1)

    // console.log('sup', data, data[0].length,series)
    const option = {
      // backgroundColor: '#404a59',
      color: ['#dd4444', '#fec42c', '#80F1BE'],
      textStyle: {
        color: '#fff',
      },
      grid: {
        left: '3%',
        right: '7%',
        bottom: '3%',
        containLabel: true,
      },
      tooltip: {
        showDelay: 0,
        trigger: 'axis',
        // padding: 10,
        // backgroundColor: '#222',
        // borderColor: '#777',
        confine: true,
        formatter(params) {
          let lengendText: any = ''
          if (params[0].value[1] != null) {
            if (params[0].value.length > 1) {
              lengendText =
                lengendText +
                axisName +
                ' : ' +
                params[0].value[0] +
                (percentageLabel ? '%<br/>' : '<br/>') +
                params[0].seriesName +
                ' : ' +
                params[0].value[1] +
                '%<br/>'
            } else {
              lengendText =
                lengendText +
                axisName +
                ' : ' +
                params[0].name +
                '<br/>' +
                params[0].seriesName +
                ' : ' +
                params[0].value +
                '%<br/> '
            }
          } else {
            lengendText =
              lengendText + axisName + ' : ' + params[0].value[0] + '<br/>'
          }

          for (let i = 1; i < params.length; i++) {
            if (params[i].value.length > 1) {
              if (params[i].value[1] == null) {
                continue
              }
              lengendText =
                lengendText +
                params[i].seriesName +
                ' : ' +
                params[i].value[1] +
                '%<br/>'
            } else {
              lengendText =
                lengendText +
                params[i].seriesName +
                ' : ' +
                params[i].value +
                '%<br/> '
            }
          }
          return lengendText
        },
        axisPointer: {
          show: true,
          type: 'cross',
          lineStyle: {
            type: 'dashed',
            width: 1,
          },
          label: {
            backgroundColor: '#222',
            borderColor: '#777',
            fontSize: 14,
          },
        },
      },
      toolbox: {
        feature: {
          dataZoom: {},
          brush: {
            type: ['rect', 'polygon', 'clear'],
          },
        },
      },
      brush: {},
      legend: {
        data: title,
        left: 'center',
        textStyle: {
          color: '#fff',
        },
      },
      xAxis: [
        {
          type: 'category',
          scale: true,
          axisLabel: {
            formatter(value) {
              if (percentageLabel) {
                return value + '%'
              } else {
                return value
              }
            }, // formatter: //'{value}%',
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#fff',
            },
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          scale: true,
          axisLabel: {
            formatter: '{value}',
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#fff',
            },
          },
        },
      ],
      series: series,
    }
    return option
  }

  public componentWillReceiveProps(nextProps: ScatterEchartsProps) {
    // 绘制图表
    // this.myChart.setOption(this.getOption())
  }
  public componentWillMount() {}
  public componentDidMount() {
    // // 基于准备好的dom，初始化echarts实例
    // this.myChart = echarts.init(document.getElementById('table-graph-container'))
    // // this.props.id))
    // // 绘制图表
    // this.myChart.setOption(this.getOption())
    // window.addEventListener('resize', this.resize)
  }
  public render() {
    return (
      <ReactEcharts
        option={this.getOption()}
        notMerge={true}
        lazyUpdate={true}
        style={{height: '95%', width: '100%'}}
        className="react_for_echarts" // "table-graph-container" // "react_for_echarts"
      />
    )
  }
}
export default ScatterEcharts
