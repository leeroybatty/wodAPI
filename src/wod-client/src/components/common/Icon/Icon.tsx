import React from 'react'
import '../design/style.css'
import './Icon.css'
import navigation from './paths/navigation' 
import operation from './paths/operation'
import information from './paths/information'

export interface IconProps {
  id?: string
  /** Optional additional styling
  */
  classes?: string
  /** String to decide what to display
  */
  name: string
  /** Height of icon to control visual size
  */
  height?: number
  /** Title of icon for accessibility, descriptions
  */
  title?: string
  /** Width of icon to control visual size
  */
  width?: number
  /** Manually enter a viewbox to override the default 0 0 12 12 
  */
  viewbox?: string
  /** A disabled icon will render in a new color and be noninteractive
  */
  disabled?: boolean
}

const Icon = ({
  id ='',
  classes = '',
  name = '',
  viewbox = '0 0 16 16',
  title,
  width = 16,
  height = 16,
  disabled,
  }: IconProps) => {

  const paths = {...operation, ...navigation, ...information}

  let opts = {} as { [key:string]: string }
  const svg = paths[name]
  if (svg.fillRule) {
    opts['fillRule'] = svg.fillRule
  }
  if (svg.clipRule) {
    opts['clipRule'] = svg.clipRule
  }
  if (svg.d) {
    opts['d'] = svg.d
  }

  return (
    <>
      <svg
        id={id}
        className={`icon ${classes} ${disabled ? 'Disabled' : ''}`.trim()}
        version="1.1"
        height={`${height}px`}
        width={`${width}px`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewbox}
      >
        <title>{title || `${name} icon`}</title>
        <path {...opts}></path>
      </svg>
    </>
  )
}

export default Icon