import React from 'react'
import WriteInField, {WriteInFieldProps, writeInDefaults} from './atoms/WriteInField'

const TextArea: React.FC<WriteInFieldProps> = (props) => {
  return(
    <WriteInField {...props} type="textarea" />
  )
}

TextArea.defaultProps = writeInDefaults;

export default TextArea;