import React, { useRef } from 'react'
import { InputProps, InputDefaults } from '../../types/input'
import classNames from 'classnames'
import '../../design/style.css'
import { default as Label } from './Label';
import { default as FormField } from './FormField';
import { useValidation } from '../hooks/useValidation'; 

export interface WriteInFieldProps extends InputProps {  
  /**
   * Add placeholder text to provide an example input value.
  */
  placeholderText?: string
  /**
   * Specify the input type.
  */ 
  type?: 'text' | 'number' | 'email' | 'password' | 'search' | 'tel' | 'datetime-local' | 'date' | 'time' | 'url' | 'week' | 'textarea'
  /**
   * A maximum value when entering dates or numbers
  */
  max?: number;
  /**
   * A minimum value when entering dates or numbers
  */
  min?: number;
  /*
  * A maximum character length
  */
  maxLength?: number;
  /*
  * A minimum character length
  */
  minLength?: number;
  /*
  * Restrict valid input
  */
  pattern?: string;
  /**
   * Give the user information to understand the field
   */
  helperText?: string;
  /**
   * Give the user feedback on why their input is wrong
   */ 
  errorText?: string;
}

const WriteInField: React.FC<WriteInFieldProps> = (props) => {
  const {
    id = "",
    type = "text",
    disabled = false,
    max,
    min,
    maxLength,
    minLength,
    name = "",
    onBlur = () => {},
    onChange = () => {},
    onClick = () => {},
    pattern,
    labelText = "",
    placeholderText = "",
    helperText = "",
    errorText = "",
    classes,
    required,
    value
  } = props

  const { valid, error, validate } = useValidation({
    value,
    required,
    pattern,
    maxLength,
    minLength,
    min,
    max
  });

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const renderHelperOrErrorText = () => {
    if (!helperText && !errorText && !error) return null;
    return (
      <p id={`helpertext_${id || labelText}`} className={classNames({ "form-field_helpertext": true, "Error": !!errorText })}>
        { errorText || error || helperText }
      </p>
    );
  }

  const textAreaChangeHandler = function (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset the height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set the new height
    }
    onChange(e);
  }

  const inputChangeHandler = function (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    onChange(e);
  }

  const handleChange = type === 'textarea' ? textAreaChangeHandler : inputChangeHandler;

  const inputProps = {
    className: `form-field_control ${classes}`.trim(),
    value,
    disabled,
    id,
    max,
    maxLength,
    name,
    min, 
    onBlur: (e: React.FocusEvent) => {
      validate();
      onBlur && onBlur(e);
    },
    onChange: handleChange,
    onClick,
    pattern,
    placeholder: placeholderText,
    required,
    type
  };

  const renderInputField = () => {
    if (type === 'textarea') {
      return <textarea ref={textareaRef} {...inputProps} />;
    } else {
      return <input {...inputProps} aria-describedby={`helpertext_${id || labelText}`} />
    }
  }

  return(
    <FormField
      classes={classNames({
        'Disabled': disabled,
        'Error': error || errorText,
        'Valid': !errorText && valid
      })}
    >
      <Label
        htmlFor={id || `label-${labelText}`}
        labelText={labelText || "MISSING LABEL"}
        required={required}
      />
      {renderInputField()}
      {renderHelperOrErrorText()}
    </FormField>
  )
}

export default WriteInField