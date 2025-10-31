import React from 'react'
import classNames from 'classnames'
import '../../design/style.css'
import FormField from '../atoms/FormField'
import './Radio.css'

export interface RadioProps {
  /**
   * Specify the unique ID of the input
  */
  id?: string
  labelText: string
  /**
   * If something should be rendered checked by default, indicate so here.
   */
  checked?: boolean
  /** 
   * A disabled checkbox renders, but is not interactable.
  */
  disabled?: boolean
  /**
   * Set a radio button as valid, error, or none (default)
  */
  status?: 'valid' | 'error' | ''
  /**
   * Give the radio a name for a radio group
   */
  name: string
  /**
   * Give the radio input a value
  */
  value: string | number
  /**
   * Provide an onChange handler
  */
  onChange: (...params: any) => any
  /**
   * Give a specific error message for form validation.
   */
  tabIndex?: number
}

const Radio = ({
  id,
  labelText = 'Label',
  checked = false,
  disabled = false,
  status = '',
  name = '',
  value = '',
  tabIndex = 0,
  onChange,
}: RadioProps) => {
  
  return(
    <FormField
      classes={classNames({
        'Compact': true,
        'Disabled': disabled,
        'Error': status === 'error'
      })}
    >
      <input
        checked={checked}
        className={`radio_control ${classNames({
          'Valid' : status === 'valid',
          'Error' : status === 'error'
        })}`.trim()}
        disabled={disabled}
        id={id}
        name={name}
        onChange={onChange}
        type='radio'
        tabIndex={tabIndex}
        value={value}
      />
      <label
        className="radio_label"
        htmlFor={id}
      >
        {labelText}
      </label>
    </FormField>
  )
}

export default Radio