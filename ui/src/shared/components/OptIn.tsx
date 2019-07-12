import React, {Component, ChangeEvent, KeyboardEvent, MouseEvent} from 'react'
import classnames from 'classnames'

import uuid from 'uuid'

import ClickOutsideInput from 'src/shared/components/ClickOutsideInput'
import {ErrorHandling} from 'src/shared/decorators/errors'

import {toValueInRange} from 'src/shared/utils/decimalPlaces'

interface Props {
  min?: string
  max?: string
  fixedPlaceholder?: string
  fixedValue?: string
  customPlaceholder?: string
  customValue?: string
  onSetValue: (value: string) => void
  type: string | number
}

interface State {
  fixedValue: string
  customValue: string
  useCustomValue: boolean
}

@ErrorHandling
export default class OptIn extends Component<Props, State> {
  public static defaultProps: Partial<Props> = {
    min: '',
    fixedValue: '',
    customValue: '',
    fixedPlaceholder: 'auto',
    customPlaceholder: 'Custom Value',
  }

  private id: string
  private isCustomValueInputFocused: boolean
  private grooveKnobContainer: HTMLElement
  private grooveKnob: HTMLElement
  private customValueInput: HTMLInputElement

  constructor(props) {
    super(props)

    const {customValue, fixedValue, type} = props

    this.state = {
      useCustomValue: customValue !== '',
      fixedValue,
      customValue,
    }

    this.id = uuid.v4()
    this.isCustomValueInputFocused = false
  }

  public render() {
    const {fixedPlaceholder, customPlaceholder, type, min, max} = this.props
    const {useCustomValue, customValue} = this.state
    // if(type === 'time' && customValue === '')
    // {
    //   this.useFixedValue()
    // }
    return (
      <div
        className={classnames('opt-in', {
          'right-toggled': useCustomValue,
        })}
      >
        <ClickOutsideInput
          id={this.id}
          min={min}
          type={type}
          max={max}
          customValue={customValue}
          onGetRef={this.handleInputRef}
          customPlaceholder={customPlaceholder}
          onChange={this.handleChangeCustomValue}
          onFocus={this.handleFocusCustomValueInput}
          onKeyDown={this.handleKeyDownCustomValueInput}
          handleClickOutsideInput={this.handleClickOutsideInput}
        />
        <div
          className="opt-in--container"
          id={this.id}
          ref={el => (this.grooveKnobContainer = el)}
        >
          <div
            className="opt-in--groove-knob"
            id={this.id}
            ref={el => (this.grooveKnob = el)}
            onClick={this.handleClickToggle}
          >
            <div className="opt-in--gradient" />
          </div>
          <div className="opt-in--label" onClick={this.useFixedValue}>
            {fixedPlaceholder}
          </div>
        </div>
      </div>
    )
  }

  private useFixedValue = (): void => {
    // sup test
    const timeData = {
      tradingHoursStart1: '09:30',
      tradingHoursEnd1: '11:30',
      tradingHoursStart2: '13:00',
      tradingHoursEnd2: '15:00',
      tradingHoursStart3: '21:00',
      tradingHoursEnd3: '23:00',
    }
    const {customPlaceholder, type} = this.props
    const {useCustomValue} = this.state
    if (type === 'time') {
      if (!useCustomValue) {
        // sup test
        const customValueTemp = timeData[customPlaceholder]
        this.setState(
          {useCustomValue: true, customValue: customValueTemp},
          () => this.setValue()
        )
      } else {
        this.setState({useCustomValue: false, customValue: '0'}, () =>
          this.setValue()
        )
      }
    } else {
      this.setState({useCustomValue: false, customValue: ''}, () =>
        this.setValue()
      )
    }
  }

  private useCustomValue = (): void => {
    this.setState({useCustomValue: true}, () => this.setValue())
  }

  private handleClickToggle = (): void => {
    const useCustomValueNext = !this.state.useCustomValue
    // console.log('sup1',useCustomValueNext)
    if (useCustomValueNext) {
      this.useCustomValue()
      this.customValueInput.focus()
    } else {
      this.useFixedValue()
    }
  }

  private handleFocusCustomValueInput = (): void => {
    this.isCustomValueInputFocused = true
    this.useCustomValue()
  }

  // Typing into number inputs does not enforce min/max
  private handleChangeCustomValue = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    const {min, max, type} = this.props
    const {value} = e.target
    if (value === '') {
      this.setCustomValue('')
    } else if (type === 'text') {
      this.setCustomValue(value)
    } else if (type === 'number') {
      this.setCustomValue(toValueInRange(value, min, max))
    }
    // sup test
    else if (type === 'time') {
      this.setCustomValue(value)
    }
  }

  private handleKeyDownCustomValueInput = (
    e: KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      if (e.key === 'Enter') {
        this.customValueInput.blur()
      }
      this.considerResetCustomValue()
    }
  }

  private handleClickOutsideInput = (e: MouseEvent<HTMLElement>): void => {
    if (
      e.currentTarget.id !== this.grooveKnob.id &&
      e.currentTarget.id !== this.grooveKnobContainer.id &&
      this.isCustomValueInputFocused
    ) {
      this.considerResetCustomValue()
    }
  }

  private considerResetCustomValue = (): void => {
    const customValue = this.customValueInput.value.trim()

    this.setState({customValue})

    if (customValue === '') {
      this.useFixedValue()
    }

    this.isCustomValueInputFocused = false
  }

  private setCustomValue = (value): void => {
    this.setState({customValue: value}, this.setValue)
  }

  private setValue = (): void => {
    const {onSetValue, type, customPlaceholder} = this.props
    const {useCustomValue, fixedValue, customValue} = this.state
    const timeData = {
      tradingHoursStart1: '09:30',
      tradingHoursEnd1: '11:30',
      tradingHoursStart2: '13:00',
      tradingHoursEnd2: '15:00',
      tradingHoursStart3: '21:00',
      tradingHoursEnd3: '23:00',
    }
    // sup test
    // console.log('sup1',type,useCustomValue,customValue)
    if (type === 'time') {
      if (useCustomValue) {
        var customValueTemp = customValue
        if (customValue === '0') {
          customValueTemp = timeData[customPlaceholder]
        }
        // console.log('sup',useCustomValue,customPlaceholder,customValue)
        switch (customPlaceholder) {
          case 'tradingHoursStart1':
          case 'tradingHoursEnd1':
            if (customValue >= '12:00') {
              customValueTemp = timeData[customPlaceholder]
            }
            break
          case 'tradingHoursStart2':
          case 'tradingHoursEnd2':
          case 'tradingHoursStart3':
            if (customValue < '12:00') {
              customValueTemp = timeData[customPlaceholder]
            }
            break
        }
        this.setState({useCustomValue: true, customValue: customValueTemp})
        onSetValue(customValueTemp)
      } else {
        onSetValue(customValue)
      }
    } else {
      if (useCustomValue) {
        onSetValue(customValue)
      } else {
        onSetValue(fixedValue)
      }
    }
  }

  private handleInputRef = (el: HTMLInputElement) =>
    (this.customValueInput = el)
}
