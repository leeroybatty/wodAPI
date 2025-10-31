import React from 'react'
import './Button.css'

export interface ButtonSetProps {
  id?: string
  children: React.ReactNode
}

const Button = ({
  id = "",
  children
}: ButtonSetProps) => {
  return (
    <div id={id} className='buttonset'>
      {children}
    </div>
  )
}

export default Button