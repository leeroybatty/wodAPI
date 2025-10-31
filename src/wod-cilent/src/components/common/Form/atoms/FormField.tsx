import React from 'react'
import classNames from 'classnames'
import '../../design/style.css'
import '../Form.css'

export interface FormFieldProps {
  id?: string
  children: React.ReactNode
  classes?: string
  disabled?: boolean
  hasError?: boolean
}

const FormField = ({
  children,
  classes = '',
  disabled,
  hasError,
}: FormFieldProps) => {
  return(
    <div
      className={`form-field ${classes} ${classNames({
        'Disabled': disabled,
        'Error': hasError
      })}`.trim()}
    >
      {children}
    </div>
  )
}

export default FormField