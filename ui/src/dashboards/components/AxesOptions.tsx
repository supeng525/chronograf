// Libraries
import React, {PureComponent, ChangeEvent} from 'react'
import {getDeep} from 'src/utils/wrappers'

// Components
import OptIn from 'src/shared/components/OptIn'
import Input from 'src/dashboards/components/DisplayOptionsInput'
import {Radio, ButtonShape} from 'src/reusable_ui'
import FancyScrollbar from 'src/shared/components/FancyScrollbar'
import LineGraphColorSelector from 'src/shared/components/LineGraphColorSelector'
import GraphOptionsDecimalPlaces from 'src/dashboards/components/GraphOptionsDecimalPlaces'

// Constants
import {AXES_SCALE_OPTIONS} from 'src/dashboards/constants/cellEditor'
import {GRAPH_TYPES} from 'src/dashboards/graphics/graph'

// Decorators
import {ErrorHandling} from 'src/shared/decorators/errors'

// Types
import {Axes} from 'src/types'
import {DecimalPlaces} from 'src/types/dashboards'
import {ColorString} from 'src/types/colors'

const {LINEAR, LOG, BASE_2, BASE_10, BASE_RAW} = AXES_SCALE_OPTIONS
const getInputMin = scale => (scale === LOG ? '0' : null)

interface Props {
  type: string
  axes: Axes
  staticLegend: boolean
  defaultYLabel: string
  lineColors: ColorString[]
  decimalPlaces: DecimalPlaces
  onUpdateAxes: (axes: Axes) => void
  onToggleStaticLegend: (isStaticLegend: boolean) => void
  onUpdateLineColors: (colors: ColorString[]) => void
  onUpdateDecimalPlaces: (decimalPlaces: DecimalPlaces) => void
}

interface State {
  prefix: string
  suffix: string
}

@ErrorHandling
class AxesOptions extends PureComponent<Props, State> {
  public static defaultProps: Partial<Props> = {
    axes: {
      y: {
        bounds: ['', ''],
        // sup test
        tradingHours1: ['', ''],
        tradingHours2: ['', ''],
        prefix: '',
        suffix: '',
        base: BASE_10,
        scale: LINEAR,
        label: '',
      },
      x: {
        bounds: ['', ''],
        // sup test
        tradingHours1: ['', ''],
        tradingHours2: ['', ''],
        prefix: '',
        suffix: '',
        base: BASE_10,
        scale: LINEAR,
        label: '',
      },
    },
  }
  constructor(props) {
    super(props)
    this.state = {
      prefix: getDeep<string>(props, 'axes.y.prefix', ''),
      suffix: getDeep<string>(props, 'axes.y.suffix', ''),
    }
  }

  public render() {
    const {
      axes: {
        x: {tradingHours1,tradingHours2},
        y: {bounds, label, scale},
      },
      type,
      lineColors,
      defaultYLabel,
      onUpdateLineColors,
    } = this.props
    const {prefix, suffix} = this.state

    const [min, max] = bounds
    // sup test
    // console.log('s2', tradingHours1, this.props.axes)
    // let temp
    // if (typeof tradingHours1 === 'undefined'){
    //   temp = ['','']
    // }else
    // {
    //   temp = tradingHours1
    // } 
    // sup test
    const [tradingHoursStart1, tradingHoursEnd1] = tradingHours1
    const [tradingHoursStart2, tradingHoursEnd2] = tradingHours2

    const {menuOption} = GRAPH_TYPES.find(graph => graph.type === type)

    return (
      <FancyScrollbar className="display-options" autoHide={false}>
        <div className="display-options--wrapper">
          <h5 className="display-options--header">{menuOption} Controls</h5>
          <form autoComplete="off" className="form-group-wrapper">
            <div className="form-group col-sm-12">
              <label htmlFor="prefix">Title</label>
              <OptIn
                type="text"
                customValue={label}
                onSetValue={this.handleSetLabel}
                customPlaceholder={defaultYLabel || 'y-axis title'}
              />
            </div>
            <LineGraphColorSelector
              onUpdateLineColors={onUpdateLineColors}
              lineColors={lineColors}
            />
            <div className="form-group col-sm-6">
              <label htmlFor="min">Min</label>
              <OptIn
                customPlaceholder={'min'}
                customValue={min}
                onSetValue={this.handleSetYAxisBoundMin}
                type="number"
                min={getInputMin(scale)}
              />
            </div>
            <div className="form-group col-sm-6">
              <label htmlFor="max">Max</label>
              <OptIn
                customPlaceholder="max"
                customValue={max}
                onSetValue={this.handleSetYAxisBoundMax}
                type="number"
                min={getInputMin(scale)}
              />
            </div>
            <Input
              name="prefix"
              id="prefix"
              value={prefix}
              labelText="Y-Value's Prefix"
              onChange={this.handleSetPrefix}
            />
            <Input
              name="suffix"
              id="suffix"
              value={suffix}
              labelText="Y-Value's Suffix"
              onChange={this.handleSetSuffix}
            />
            {this.yValuesFormatTabs}
            {this.scaleTabs}
            {this.decimalPlaces}
            {this.staticLegendTabs}
            <div className="form-group col-sm-6">
              <label htmlFor="TradingHoursStart1">TradingHours AM/PM Start</label>
              <OptIn
                customPlaceholder={'tradingHoursStart1'}
                customValue={tradingHoursStart1}
                onSetValue={this.handleSetXAxisTradingHoursStart1}
                type="time"
              />
            </div>
            <div className="form-group col-sm-6">
              <label htmlFor="TradingHoursEnd1">TradingHours AM End</label>
              <OptIn
                customPlaceholder={'tradingHoursEnd1'}
              customValue={tradingHoursEnd1}
              onSetValue={this.handleSetXAxisTradingHoursEnd1}
              type="time"
              />
            </div>
            <div className="form-group col-sm-6">
              <label htmlFor="TradingHoursStart2">TradingHours PM Start</label>
              <OptIn
                customPlaceholder={'tradingHoursStart2'}
                customValue={tradingHoursStart2}
                onSetValue={this.handleSetXAxisTradingHoursStart2}
                type="time"
              />
            </div>
            <div className="form-group col-sm-6">
              <label htmlFor="TradingHoursEnd2">TradingHours PM End</label>
              <OptIn
                customPlaceholder={'tradingHoursEnd2'}
              customValue={tradingHoursEnd2}
              onSetValue={this.handleSetXAxisTradingHoursEnd2}
              type="time"
              />
            </div>
          </form>
        </div>
      </FancyScrollbar>
    )
  }

  private get staticLegendTabs(): JSX.Element {
    const {staticLegend, onToggleStaticLegend} = this.props

    return (
      <div className="form-group col-sm-6">
        <label>Static Legend</label>
        <Radio shape={ButtonShape.StretchToFit}>
          <Radio.Button
            id="static-legend-tab--show"
            value={true}
            active={staticLegend === true}
            titleText="Show static legend below graph"
            onClick={onToggleStaticLegend}
          >
            Show
          </Radio.Button>
          <Radio.Button
            id="static-legend-tab--hide"
            value={false}
            active={staticLegend === false}
            titleText="Hide static legend"
            onClick={onToggleStaticLegend}
          >
            Hide
          </Radio.Button>
        </Radio>
      </div>
    )
  }

  private get scaleTabs(): JSX.Element {
    const {
      axes: {
        y: {scale},
      },
    } = this.props

    return (
      <div className="form-group col-sm-6">
        <label>Scale</label>
        <Radio shape={ButtonShape.StretchToFit}>
          <Radio.Button
            id="y-scale-tab--linear"
            value={LINEAR}
            active={scale === LINEAR || scale === ''}
            titleText="Set Y-Axis to Linear Scale"
            onClick={this.handleSetScale}
          >
            Linear
          </Radio.Button>
          <Radio.Button
            id="y-scale-tab--logarithmic"
            value={LOG}
            active={scale === LOG}
            titleText="Set Y-Axis to Logarithmic Scale"
            onClick={this.handleSetScale}
          >
            Logarithmic
          </Radio.Button>
        </Radio>
      </div>
    )
  }

  private get yValuesFormatTabs(): JSX.Element {
    const {
      axes: {
        y: {base},
      },
    } = this.props

    return (
      <div className="form-group col-sm-6">
        <label>Y-Value's Format</label>
        <Radio shape={ButtonShape.StretchToFit}>
          <Radio.Button
            id="y-values-format-tab--raw"
            value={BASE_RAW}
            active={base === '' || base === BASE_RAW}
            titleText="Don't format values"
            onClick={this.handleSetBase}
          >
            Raw
          </Radio.Button>
          <Radio.Button
            id="y-values-format-tab--kmb"
            value={BASE_10}
            active={base === BASE_10}
            titleText="Thousand / Million / Billion"
            onClick={this.handleSetBase}
          >
            K/M/B
          </Radio.Button>
          <Radio.Button
            id="y-values-format-tab--kmg"
            value={BASE_2}
            active={base === BASE_2}
            titleText="Kilo / Mega / Giga"
            onClick={this.handleSetBase}
          >
            K/M/G
          </Radio.Button>
        </Radio>
      </div>
    )
  }

  private get decimalPlaces(): JSX.Element {
    const {onUpdateDecimalPlaces, decimalPlaces} = this.props

    // if (type !== CellType.LinePlusSingleStat) {
    //   return null
    // }

    return (
      <GraphOptionsDecimalPlaces
        digits={decimalPlaces.digits}
        isEnforced={decimalPlaces.isEnforced}
        onDecimalPlacesChange={onUpdateDecimalPlaces}
      />
    )
  }

  private handleSetPrefix = (e: ChangeEvent<HTMLInputElement>): void => {
    const {onUpdateAxes, axes} = this.props
    const prefix = e.target.value

    const newAxes = {
      ...axes,
      y: {
        ...axes.y,
        prefix,
      },
    }

    this.setState({prefix}, () => onUpdateAxes(newAxes))
  }

  private handleSetSuffix = (e: ChangeEvent<HTMLInputElement>): void => {
    const {onUpdateAxes, axes} = this.props
    const suffix = e.target.value

    const newAxes = {
      ...axes,
      y: {
        ...axes.y,
        suffix,
      },
    }
    this.setState({suffix}, () => onUpdateAxes(newAxes))
  }

  private handleSetYAxisBoundMin = (min: string): void => {
    const {onUpdateAxes, axes} = this.props
    const {
      y: {
        bounds: [, max],
      },
    } = this.props.axes

    const bounds: [string, string] = [min, max]
    const newAxes = {...axes, y: {...axes.y, bounds}}

    onUpdateAxes(newAxes)
  }

  private handleSetYAxisBoundMax = (max: string): void => {
    const {onUpdateAxes, axes} = this.props
    const {
      y: {
        bounds: [min],
      },
    } = axes

    const bounds: [string, string] = [min, max]
    const newAxes = {...axes, y: {...axes.y, bounds}}

    onUpdateAxes(newAxes)
  }
  // sup test
  private handleSetXAxisTradingHoursStart1 = (
    tradingHoursStart1: string
  ): void => {
    const {onUpdateAxes, axes} = this.props
    const {
      x: {
        tradingHours1: [, tradingHoursEnd1],
      },
    } = this.props.axes
    const tradingHours1: [string, string] = [
      tradingHoursStart1,
      tradingHoursEnd1,
    ]
    // const newAxes = {x: {...axes.x, tradingHours1}, ...axes}
    const newAxes = {...axes, x: {...axes.x, tradingHours1}}
    onUpdateAxes(newAxes)
    // sup test
    // let temp = parseInt(tradingHoursEnd1.split(":")[0]) - parseInt(tradingHoursStart1.split(":")[0])
    // let temp1 = parseInt(tradingHoursEnd1.split(":")[1]) - parseInt(tradingHoursStart1.split(":")[1])
    // console.log('s2',tradingHours1,temp,temp1)
  }
  private handleSetXAxisTradingHoursEnd1 = (tradingHoursEnd1: string): void => {
    const {onUpdateAxes, axes} = this.props
    const {
      x: {
        tradingHours1: [tradingHoursStart1],
      },
    } = this.props.axes
    const tradingHours1: [string, string] = [
      tradingHoursStart1,
      tradingHoursEnd1,
    ]
    // const newAxes = {x: {...axes.x, tradingHours1}, ...axes}
    const newAxes = {...axes, x: {...axes.x, tradingHours1}}
    onUpdateAxes(newAxes)
  }
  // sup test
  private handleSetXAxisTradingHoursStart2 = (
    tradingHoursStart2: string
  ): void => {
    const {onUpdateAxes, axes} = this.props
    const {
      x: {
        tradingHours2: [, tradingHoursEnd2],
      },
    } = this.props.axes
    const tradingHours2: [string, string] = [
      tradingHoursStart2,
      tradingHoursEnd2,
    ]
    // const newAxes = {x: {...axes.x, tradingHours1}, ...axes}
    const newAxes = {...axes, x: {...axes.x, tradingHours2}}
    onUpdateAxes(newAxes)
  }
  private handleSetXAxisTradingHoursEnd2 = (tradingHoursEnd2: string): void => {
    const {onUpdateAxes, axes} = this.props
    const {
      x: {
        tradingHours2: [tradingHoursStart2],
      },
    } = this.props.axes
    const tradingHours2: [string, string] = [
      tradingHoursStart2,
      tradingHoursEnd2,
    ]
    // const newAxes = {x: {...axes.x, tradingHours1}, ...axes}
    const newAxes = {...axes, x: {...axes.x, tradingHours2}}
    onUpdateAxes(newAxes)
  }

  private handleSetLabel = (label: string): void => {
    const {onUpdateAxes, axes} = this.props
    const newAxes = {...axes, y: {...axes.y, label}}

    onUpdateAxes(newAxes)
  }

  private handleSetScale = (scale: string): void => {
    const {onUpdateAxes, axes} = this.props
    const newAxes = {...axes, y: {...axes.y, scale}}

    onUpdateAxes(newAxes)
  }

  private handleSetBase = (base: string): void => {
    const {onUpdateAxes, axes} = this.props
    const newAxes = {...axes, y: {...axes.y, base}}

    onUpdateAxes(newAxes)
  }
}

export default AxesOptions
