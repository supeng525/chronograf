// Libraries
import React, {Component} from 'react'

// Components
import {Radio, ButtonShape} from 'src/reusable_ui'

// Constants
import {
  THRESHOLD_TYPE_TEXT,
  THRESHOLD_TYPE_BG,
} from 'src/shared/constants/thresholds'

// Decorators
import {ErrorHandling} from 'src/shared/decorators/errors'

// Types
import {ThresholdType, CellType} from 'src/types/dashboards'

interface Props {
  // sup test
  type: string
  containerClass: string
  thresholdsListType: ThresholdType
  onUpdateThresholdsListType: (newType: ThresholdType) => void
}

@ErrorHandling
class ThresholdsListTypeToggle extends Component<Props> {
  public render() {
    const {
      type,
      containerClass,
      thresholdsListType,
      onUpdateThresholdsListType,
    } = this.props
    // console.log('sup4_1',thresholdsListType,type)
    switch (type) {
      case CellType.Custom:
        return (
          <div className={containerClass}>
            <label>X-Axis Label</label>
            <Radio shape={ButtonShape.StretchToFit}>
              <Radio.Button
                id="threshold-list-type--background"
                value={THRESHOLD_TYPE_BG}
                active={thresholdsListType === THRESHOLD_TYPE_BG}
                onClick={onUpdateThresholdsListType}
                titleText="Apply coloration to cell background"
              >
                StrikePrice/Price-1
              </Radio.Button>
              <Radio.Button
                id="threshold-list-type--text"
                value={THRESHOLD_TYPE_TEXT}
                active={thresholdsListType === THRESHOLD_TYPE_TEXT}
                onClick={onUpdateThresholdsListType}
                titleText="Apply coloration to cell text"
              >
                StrikePrice
              </Radio.Button>
            </Radio>
          </div>
        )
      default:
        return (
          <div className={containerClass}>
            <label>Threshold Coloring</label>
            <Radio shape={ButtonShape.StretchToFit}>
              <Radio.Button
                id="threshold-list-type--background"
                value={THRESHOLD_TYPE_BG}
                active={thresholdsListType === THRESHOLD_TYPE_BG}
                onClick={onUpdateThresholdsListType}
                titleText="Apply coloration to cell background"
              >
                Background
              </Radio.Button>
              <Radio.Button
                id="threshold-list-type--text"
                value={THRESHOLD_TYPE_TEXT}
                active={thresholdsListType === THRESHOLD_TYPE_TEXT}
                onClick={onUpdateThresholdsListType}
                titleText="Apply coloration to cell text"
              >
                Text
              </Radio.Button>
            </Radio>
          </div>
        )
    }
  }
}

export default ThresholdsListTypeToggle
