import React from 'react'
import classNames from 'classnames'
import Icon from '../../Icon'
import {InteractiveProps, InteractiveDefaults} from '../../types/interactive'

export interface LabelProps extends InteractiveProps {
  htmlFor: string;
  labelText: string;
  hasError?: boolean;
  required?: boolean;
}

const Label: React.FC<LabelProps> = ({
  labelText = "",
  htmlFor = "",
  disabled,
  required,
  hasError
}) => {

  return ( 
    <label
      htmlFor={htmlFor}
      className={classNames({
        'form-field_label': true,
        'Disabled': disabled,
        'Error': hasError,
      })}
    >
      <span>{labelText}</span>
      {required ? <Icon classes="form-field_requirement-icon" width={8} height={8} viewbox="0 0 16 14" name="asterisk" /> : ""}
    </label>
  )
}

export default Label