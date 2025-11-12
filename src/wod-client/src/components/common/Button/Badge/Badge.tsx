import React from 'react'
import ButtonAtom from '../ButtonAtom'
import classNames from 'classnames'
import Icon from '../../Icon'
import '../../design/style.css'
import './Badge.css'

export interface BadgeProps {
  id?: string
  /**
   * "primary": highlights the next logical step forward.
   * "warning": denotes the button destroys data, e.g. 'delete'.
   * "muted": For coupling with primary buttons as the 'backward' step.
   */
  look?: 'primary' | 'default' | 'muted' | 'warning' | undefined
  /**
   * A disabled button renders but can no longer be clicked.
   */
  disabled?: boolean
  /**
   * All buttons must have labels for accessibility purposes
  */
  label?: string
  /**
   * Set 'showLabel' to true to show a text label next to the icon.
  */
  showLabel?: boolean
  /**
   * A function to be called when the button is clicked
   */
  onClick?: (...params: any) => any
  tabIndex?: number
  /**
   * A name for an icon to place in the badge
  */
  icon: string
  /** 
  * Control the width of an icon SVG
  */
  width?: number
  /**
   * Control the height of an icon SVG
   */
  height?: number
   /**
    * Specify the viewbox of an icon SVG
    */
  viewbox?: string
  size?: 'md' | 'sm' | 'lg';
}

const Badge = ({
  id = '',
  viewbox = "0 0 16 16",
  look = "default",
  disabled,
  onClick = () => {},
  tabIndex,
  icon = 'close',
  label,
  size = 'md',
  width = undefined,
  height = undefined,
  showLabel = false
}: BadgeProps) => {

  let iconWidth, iconHeight = 24;

  if (size === 'lg') {
    iconWidth = 32;
    iconHeight = 32;
  }
  if (size === 'sm') {
    iconWidth = 16;
    iconHeight = 16;
  }
  if (height) {
    iconHeight = height;
  }
  if (width) {
    iconWidth = width;
  }
  
  return(
    <ButtonAtom
      id={id}
      disabled={disabled}
      onClick={(e) => {onClick(e)}}
      classes={classNames({
        'Badge': true,
        'Labeled': showLabel === true
      })}
      look={look}
      role='button'
      tabIndex={tabIndex}
      type='button'
    >
      <Icon name={icon} title={label} width={iconWidth} height={iconHeight} viewbox={viewbox}/>
      <span className={showLabel ? '' : 'Invisible'}>{label}</span>
    </ButtonAtom>
  )
}

export default Badge