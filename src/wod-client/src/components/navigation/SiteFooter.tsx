import React from 'react'
import { Link } from '@components'
import './Navigation.css'

const SiteFooter = () => {
  
  return (
    <footer className="footer">
      <div className="footer-nav">
        <Link type="inline" href="/tos">Terms of Service</Link>
        <Link type="inline" href="/privacy">Privacy Policy</Link>
        <Link type="inline" href="/content">Content Policy</Link>
      </div>
      <small>
        &copy; {new Date().getFullYear()} Big Damn Mush. Individual games hosted on this website are property and responsibility of their creators.
      </small>
    </footer>
  )
}

export default SiteFooter
