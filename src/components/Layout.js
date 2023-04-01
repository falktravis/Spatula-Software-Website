import React from 'react'
import NavBar from './NavBar'
import Footer from './Footer'

export default function Layout({ children }) {
  return (
    <div className='Layout'>
        <NavBar />
          <main className="Content">
              { children }
          </main>
        <Footer />
    </div>
  )
}
