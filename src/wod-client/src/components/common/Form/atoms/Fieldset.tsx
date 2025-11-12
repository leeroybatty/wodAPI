import React from 'react'
import classNames from 'classnames'
import '../../design/style.css'
import '../Form.css'

export interface FieldSetProps {
  legend: string
}

const FieldSet = ({
  children,
  legend = ''
}: FieldGroupProps) => {
  return(
    <fieldset className="fieldset">
      <legend>{legend}</legend>
      {children}
    </fieldset>
  )
}

export default FieldSet