import React, { useEffect } from 'react'
import classNames from 'classnames'
import '../design/style.css'
import './Modal.css'
import Icon from '../Icon'
import { Button, ButtonSet } from '../Button'

export interface ModalProps {
  /**
   * Label for whatever the action the modal is associated with, eg 'save'.
  */
  actionButtonLabel?: string
  /**
   * Required property for accessibility. This will be read by screen readers.
  */
  ariaLabel: string
  /**
   * Children for the modal
  */
  children: React.ReactNode
  /**
   * Pass in a custom CSS class
  */
  classes?: string
  /**
   * Accessibility-minded label for the close button. Default is "close".
  */
  closeButtonLabel?: string
  /**
  * Set the content of the modal's header (title).
  */
  heading?: string
  /**
   * For screen readers, which will read the modal differently if this is an alert.
  */
  isAlert?: boolean
  /**
   * DOM element ID of the top level node
  */
  id: string
  /**
   * Whether the modal is open.
  */ 
  isOpen: boolean
  /**
   * Designate that moving forward will delete data.
  */
  isWarning?: boolean
  /**
   * Handler for keypresses (down)
  */
  onKeyDown?: (...params: any) => any
  /**
   * Handler for closing a modal.  The handler passed in should change the `isOpen` property.
  */
  onClose: (...params: any) => any
  /**
   * Handler for confirming an interactive modal's intended action (such as submitting a form). The handler passed in should change the `isOpen` property.
  */
  onAction?: (...params: any) => any
  /**
  * If true, clicking outside the modal will not close the modal.
  */
  persistent?: boolean
  /**
   * Control width of modal.
  */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Specify if modal has scrolling content.
  * */
  scrolls?: boolean
  /**
   * custom on click event function
  * */
  onClick?: (...params: any) => any
}

const Modal = ({
  actionButtonLabel = '',
  ariaLabel = '',
  children,
  classes = '',
  closeButtonLabel = 'Close',
  heading,
  isAlert,
  id = '',
  isOpen,
  isWarning,
  onAction = () => {},
  onClose = () => {},
  onKeyDown = () => {},
  persistent,
  size,
  scrolls,
}:ModalProps) => {

  const doButtonBay = function () {
    return actionButtonLabel
  }

  const trapFocus = function () {
    if (isOpen) {
      const element = document.querySelector(`#${id}`) as HTMLElement
      if (element) {
        element.focus()
      }
    }
  }

  useEffect(()=> {
    trapFocus()
  },
  [isOpen])

  const checkEscape = function (e: React.KeyboardEvent) {
    if (e.code === 'Escape') {
      if (!persistent) {
        onClose()
      }
    }
  }

  const checkClickOut = function(e: React.MouseEvent) {
    const clickedNode = e.target as HTMLElement
    const classList = clickedNode.classList.value.split(' ')
    if (classList.includes('modal')) { // then we are clicking outside of the content
      if (!persistent) {
        onClose()
      }
    }
  }

  return (
    <>
      <div
        tabIndex={0}
        onFocus={trapFocus}
      >
      </div>
      <dialog
        aria-hidden={!isOpen}
        aria-label={ariaLabel ? ariaLabel : heading || 'Modal'}
        className={`modal ${classes} ${classNames({
          Open: isOpen,
          Closed: !isOpen,
          Alert: isAlert,
          Warning: isWarning,
          Medium: size === 'md' || !!size,
          Large: size === 'lg',
          Small: size === 'sm'
        })}`
          .trim()}
        id={id}
        onClick={(e) => {checkClickOut(e)}}
        onKeyUp={(e) => {checkEscape(e)}}
        onKeyDown={(e) => {onKeyDown(e)}}
        role={isAlert ? 'alertdialog' : 'dialog' }
        tabIndex={-1}
        open={isOpen}
      >
        <div className={`modal_content ${classNames({
          Scrolling: scrolls,
          Small: size === 'sm',
          Medium: size === 'md',
          Large: size === 'lg',
        })}`.trim()}>
          <div className="modal_header">
            <span className="modal_title">{heading}</span>
            <button
              type="button"
              className="modal_close"
              onClick={() => {onClose()}}
              aria-label={closeButtonLabel}
            >
              <Icon id={`${id}-close-icon`} width={24} height={24} viewbox={'0 0 16 16'} name="close" />
            </button>
          </div>
          <div className="modal_body">
            {children}
          </div>
          {
            doButtonBay() ?
              (
                <div className="modal_footer">
                  <ButtonSet>
                    <Button
                      id={`${id}-close`}
                      type="button"
                      onClick={() => {onClose()}}
                      look="muted"
                    >
                      {closeButtonLabel}
                    </Button>
                    <Button
                      id={`${id}-action`}
                      type="button"
                      onClick={() => {onAction()}}
                      look="primary"
                    >
                      {actionButtonLabel}
                    </Button>
                  </ButtonSet>
                </div>
              )
              :
              null
          }
        </div>
      </dialog>
      <div
        tabIndex={0}
        onFocus={trapFocus}
      >
      </div>
    </>
  )
}

export default Modal