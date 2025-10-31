import React from 'react'
import { Button, ButtonSet, Link } from '@components'
import './Navigation.css'

type SiteHeaderProps = {
  onLogIn?: (...params: any) => any;
  onLogout?:  (...params: any) => any;
  onSignup?:  (...params: any) => any;
  loggedIn?: boolean;
}

const SiteHeader = ({
  onLogIn,
  onLogout,
  onSignup,
  loggedIn,
  }: SiteHeaderProps) => {

  return (
    <div className="horizontal-nav">
      <div className="horizontal-nav_inner">
        <a href="/" className="horizontal-nav_brand">
          <img alt="Big Damn MUSH" src='/img/brand/headerlogo.png' width='200' />
        </a>
        { loggedIn === true ? 
          <>
            <Link type="navigation" inverse id="horizontal-nav_profile" href="/profile">My Account</Link>
            <Link type="navigation" inverse id="horizontal-nav_manage-characters" href="/characters/mine">Characters</Link>
            <Link type="navigation" inverse id="horizontal-nav_games" href="/read">Games</Link>
          </>
          : ""
        }
        <div className="horizontal-nav_authentication">
          {loggedIn === true 
              ? (
                <Button look="muted" inverse id="header-logout" onClick={onLogout}>Log out</Button>
              )
              :
              (
                <ButtonSet>
                  <Button id="header-signup" onClick={onSignup}>Sign up</Button>
                  <Button id="header-login" onClick={onLogIn} look="primary">Log in</Button>
                </ButtonSet>
              )
          }
        </div>
      </div>
    </div>
  )
}

export default SiteHeader
