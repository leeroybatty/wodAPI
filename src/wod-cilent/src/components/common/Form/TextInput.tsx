import React from 'react';
import WriteInField from './atoms/WriteInField';
import type {WriteInFieldProps} from './atoms/WriteInField';
const TextInput: React.FC<WriteInFieldProps> = (props) => {
  const {type} = props
;

  return(
    <WriteInField {...props} type={type} />
  )
}

export default TextInput;