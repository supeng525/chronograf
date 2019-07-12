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
import moment from 'moment'
import { TableOptions } from 'src/dashboards/components/TableOptions';

interface Props {
  transformedData: TimeSeriesValue[][]
  decimalPlaces: DecimalPlaces
  dataCustom: TimeSeriesValue[][]
  timeFormat: string
  // 标记background：strikePrice/Price-1  text:StrikePrice
  // onSort: (fieldName: string) => void
  // sort: Sort
  // dataType: DataType
  // tableOptions: TableOptions
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
    const {
      transformedData,
      decimalPlaces,
      dataCustom,
      colors,
      timeFormat,
    } = this.props
    // 标的价格
    const customPrice = dataCustom !== null ? dataCustom[1][1] : null
    // 是否需要以StrikePrice/Price-1百分比形式给出数据
    const percentageLabel: boolean =
      typeof colors[0] !== 'undefined' &&
      customPrice !== null &&
      colors[0].type === 'background'
        ? true
        : false
    // 百分比时的显示精度
    const decimalPlacesTemp = {
      isEnforced: decimalPlaces.isEnforced,
      digits: decimalPlaces.digits - 2,
    }
    const series: any[] = []
    // top上的分类数据
    const title = transformedData[0]
    // 图表右侧的分类数据
    const titleClassfy: any[] = []
    // x轴name  第一个合约代码  第二个行权价
    const axisName: any[] = [title[0], title.length > 1 ? title[1] : title[0]]
    // 散点格式
    const itemStyle = {
      normal: {
        opacity: 0.8,
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
      },
    }
    var schema :any[] = []
    for(let j: number = 2; j < transformedData[0].length; j++) {
      schema.push({
        name: transformedData[0][j],
        index: j-2,
        text: transformedData[0][j],
      })
    }
    // console.log('sup1', schema) 
    // row index  data
    for (let i: number = 1; i < transformedData.length; i++) {
      // x轴分类数据
      let dataX = null
      let dataSeries: any[][] = []
      // index == 0  第一列数据  合约代码等分类数据，保存到titleClassfy
      let index = 0
      titleClassfy.push(transformedData[i][index])
      // index = 1 第二个分类数据，行权价
      index = 1
      if (percentageLabel && title[index] !== 'time') {
        dataX = Number(
          toFixed(
            (Number(transformedData[i][index]) / Number(customPrice) - 1) * 100,
            decimalPlacesTemp
          )
        )
      } else if (title[index] === 'time') {
        dataX = moment(transformedData[i][index]).format(timeFormat)
      } else {
        dataX = Number(
          toFixed(Number(transformedData[i][index]), decimalPlaces)
        )
      }
      // column index 分类数据后的指标
      for(let j = 2; j < transformedData[0].length; j++) {
        let temp: any[] = [dataX]
        if (title[j] === 'time') {
          temp.push(moment(transformedData[i][j]).format(timeFormat))
        } else {
          temp.push(
            Number(
              toFixed(Number(transformedData[i][j]) * 100, decimalPlacesTemp)
            )
          )
        }
        // 增加指标name  [StrikePrice,index,indexName]
        temp.push(transformedData[0][j])
        dataSeries.push(temp)
      }
      series.push({
        name: transformedData[i][0],
        type: 'scatter',
        symbolSize: 5,
        itemStyle: itemStyle,
        data: dataSeries,
      })
    }
    // console.log('sup1', series)
    const option = {
      // backgroundColor: '#404a59',
      color: ['#dd4444', '#fec42c', '#80F1BE','#c23531', '#d48265',  '#ca8622', '#bda29a', '#c4ccd3','#00FF7F','#00FF00'],
      // 00ff00
      textStyle: {
        color: '#fff',
      },
      grid: {
        left: '5%',
        right: '10%',
        bottom: '5%',
        containLabel: true,
      },
      tooltip: {
        showDelay: 100,
        trigger: 'axis',
        // padding: 10,
        // backgroundColor: '#222',
        // borderColor: '#777',
        confine: true,
        triggerOn:'mousemove',
        enterable:true,
        formatter(params) {
          // console.log('sup',params[10].dataIndex,schema,params[10])
          let lengendText =
          // <div style="color: $g15-platinum;font-weight: 600;line-height: 13px;max-height: 123px;margin-top: 16px;overflow-y: auto;@include custom-scrollbar-round($g0-obsidian, $g3-castle);">
            '<div style="line-height: 15px;max-height: 200px;margin-top: 15px;overflow-y: auto;">' + 
            '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 16px;padding-bottom: 7px;margin-bottom: 7px">' +
            axisName[1] + // 显示x轴行权价
            ' : ' +
            params[0].value[0] +
            (percentageLabel ? '%</div>' : '</div>')
          // 一直合约有多少个指标点
          let indexCount = schema.length
          for(let i = 0;i < params.length; i++){
            if( i % indexCount === 0)
            {
              // console.log(params[i])
              lengendText = 
                lengendText +
                (i !== 0 ? '</div>':'') +
                '</br>' +
                '<div style="color:' +
                params[i].color +
                ';border-bottom: 1px solid rgba(255,255,255,.3); font-size: 14px;padding-bottom: 7px;margin-bottom: 7px">' + 
                axisName[0] +
                ' : ' +
                params[i].seriesName +
                '</div>' +
                '<div style="color:' +
                params[i].color +
                '">'
            }
            let dataIndex = params[i].dataIndex
            lengendText = 
                lengendText +
                schema[dataIndex].text +
                ' : ' +
                params[i].value[1] +
                '%<br/>'
          }
          lengendText = 
            lengendText +
            '</div></div>'
          // console.log('sup',lengendText)
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
        data: titleClassfy,
        // left: 'center',
        type: 'scroll',
        orient: 'vertical',
        right: 20,
        top: 40,
        bottom: 30,
        textStyle: {
          color: '#fff',
        },
      },
      xAxis: [
        {
          type: 'category',
          scale: true,
          name: axisName[1],
          nameLocation: 'middle',
          nameGap: 30,
          nameTextStyle: {
              fontSize: 16
          },
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
          name: 'Index'
          nameTextStyle: {
            fontSize: 16
        },
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
