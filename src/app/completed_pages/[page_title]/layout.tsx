
import { Viewport } from 'next'
// import NavBar from '../components/NavBar'

import NavBar from '@/app/components/(navbar)/NavBar'
import FooterContainer from '@/app/components/(footer)/FooterContainer'



export const viewport: Viewport = {
  maximumScale: 1,
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
        <NavBar />
        {children}
        <FooterContainer />
    </div>
  )
}