import React from 'react'
import ButtonAtom from './ButtonAtom';

interface ButtonProps {
  id?: string;
  /**
   * Button content.
   */
  children: React.ReactNode;
  /**
   * "primary": highlights the next logical step forward.
   * "warning": denotes the button destroys data, e.g. 'delete'.
   * "muted": For coupling with primary buttons as the 'backward' step.
   */
  look?: 'primary' | 'default' | 'muted' | 'warning' | undefined;
  /**
   * A disabled button renders but can no longer be clicked.
   */
  disabled?: boolean;
  /**
   * A function to be called when the button is clicked
   */
  onClick?: (...params: any) => any;
  /**
   * Specify the role of the button for accessibility
   */
  role?: string;
  tabIndex?: number;
  type?: 'button' | 'reset' | 'submit';
  loading?: boolean;
  inline?: boolean;
  inverse?: boolean;
}

const Button: React.FC<ButtonProps> = (props) => {
  return <ButtonAtom {...props} />
}

export default Button