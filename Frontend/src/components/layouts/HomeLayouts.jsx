import React from 'react'
import { HeaderHome } from './HeaderHome'
import { Outlet } from 'react-router-dom'
import { FooterHome } from './FooterHome'

export const HomeLayouts = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderHome />
      <main className="flex-grow">
        <Outlet />
      </main>
      <FooterHome />
    </div>
  )
}