import React from 'react';
import classNames from 'classnames';
import '../design/style.css';
import './Tag.css';
import { Badge } from '../Button';
import type { InteractiveProps } from '../types/interactive'


export interface TagProps extends InteractiveProps {
  /**
   * The name for the tag
  */
  label: string;
  /**
   * Specify the size of the tag
  */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Click handler for when you click the close button
  */
  onClose?: (...params: any) => any;
  /**
   * If removable, then a close-button is displayed.
   */
  removable?: boolean;
  /**
   * The name of an icon to render inline with the tag. See Icon choices.
   */
  icon?: string;
  /**
   * Determine the appearnce of the tag. Neutral takes on secondary theme, outline takes on text color.
   */
  look?: 'red'
    | 'orange'
    | 'yellow'
    | 'green'
    | 'blue'
    | 'indigo'
    | 'violet'
    | 'grey'
    | 'black'
    | 'white'
    | 'neutral'
    | 'match text';
};


const Tag:React.FC<TagProps> = (props) => {
  const {
    id,
    removable,
    label,
    classes
  } = props;

    return (
      <div
        id={id}
        className={`tag ${classNames({
          Removable: !!removable
        })}`}
      >
        <span>{label}</span>
        {removable
          ? (<Badge label="remove" look="muted" icon="close" width={10} height={10}/>
            )
          : null
        }
      </div>
    )
}

export default Tag;