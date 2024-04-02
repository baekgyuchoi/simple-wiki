
import { Viewport } from 'next'
import NavBar from '../components/(navbar)/NavBar'
import FooterContainer from '../components/(footer)/FooterContainer'



export const viewport: Viewport = {
  maximumScale: 1,
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='min-h-screen flex flex-col justify-between '>
        <NavBar />
        {children}
        <FooterContainer />
    </div>
  )
}