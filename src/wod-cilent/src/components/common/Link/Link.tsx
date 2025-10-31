import React from 'react';
import classNames from 'classnames';
import '../design/style.css';
import './Link.css';
import '../Button/Button.css';
import { InteractiveProps } from '../types/interactive';

export interface LinkProps extends InteractiveProps {
  /**
   * Children for the link
  */
  children: React.ReactNode
  /**
   * Pass the `href` attribute for the <a> element
   */
  href: string
  /**
   * Pass the <a> element target attribute
  * */
  target?: '_blank' | '_self' | '_parent' | '_top' | 'framename'
  /**
   * Toggle appearance and behavior when disabled
  * */
  disabled?: boolean
  /**
   * custom on click event function
  * */
  onClick?: (...params: any) => any
  /**
   * Shift the appearance of the link for semantic vs visual presentation needs
  * */
  type?: 'default' | 'button' | 'navigation'
  /**
   * Select the visual presentation of the link when it has a Button appearance
   * */
  look?: 'primary' | 'default' | 'muted' | 'warning' | undefined;
  /**
   * Select for inverse color combos
   * */
  inverse?: boolean
}

const Link = ({
  id = '',
  children = 'Link',
  href = '#',
  target = '_self',
  disabled,
  type,
  onClick,
  look = 'default',
  inverse = false
}:LinkProps) => {

  return(
    <a
      id={id}
      href={href}
      target={target}
      className={classNames({
        'Inverse': !!inverse,
        'Navigation': type === 'navigation',
        'Disabled': !!disabled,
        'button': type === 'button',
        'Muted': type === 'button' && look === 'muted',
        'Primary': type === 'button' && look ==='primary',
        'Warning': type === 'button' && look === 'warning',
        'link': type !== 'button',
        'Inline': type === 'button'
      })}
      onClick={onClick}
    >
      {children}
    </a>
  )
}

export default Link