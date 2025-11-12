import React from 'react';
import classNames from 'classnames';
import '../../design/style.css';
import FormField from '../atoms/FormField';
import './Checkbox.css';

export interface CheckboxProps {
  /**
   * Specify the unique ID of the input
  */
  id?: string
  labelText: string
  /** 
   * Optional additional styling
  */
  classes?: string
  /**
   * If something should be rendered checked by default, indicate so here.
   */
  checked?: boolean
  /** 
   * A disabled checkbox renders, but is not interactable.
  */
  disabled?: boolean
  /**
   * Give a specific error message for form validation.
   */
  errorText?: string
  /**
   * Give the user additional instructions for assistance
  */
  helperText?: string
  /**
   * HTML name attribute to pass down
   */
  name?: string
  /**
   * Provide an onChange handler
  */
  onChange: (...params: any) => any
  /**
   * Determine which status to render the checkbox in.
  */
  status?: 'default' | 'valid' | 'error'
  /**
   * Provide a tab index
  */
  tabIndex?: number
  /*
  * HTML value attribute to pass down
  */
  value?: string | number | readonly string[] | undefined
}

const Checkbox = ({
  id,
  classes = '',
  checked = false,
  disabled = false,
  errorText = 'Please review your input.',
  helperText,
  labelText = 'Label',
  name = '',
  onChange = () => {},
  tabIndex = 0,
  value = '',
  status
}: CheckboxProps) => {
  
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
        className={`checkbox_control ${classes} ${classNames({
          'Valid' : status === 'valid',
          'Error' : status === 'error'
        })}`.trim()}
        disabled={disabled}
        id={id}
        name={name}
        onChange={onChange}
        tabIndex={tabIndex}
        type='checkbox'
        value={value}
      />
      <label
        className="checkbox_label"
        htmlFor={id}
      >
        {labelText}
      </label>
      { helperText || status === 'error' ?
        <p className="checkbox_helpertext">
          {status === 'error' ? errorText : helperText }
        </p>
        :
        ''
      }
    </FormField>
  )
}

export default Checkbox