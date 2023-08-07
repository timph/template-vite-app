import { 
    Header, 
} from '@mantine/core'
import reactLogo from '../assets/react.svg'
import viteLogo from '../assets/vite.svg'
import mantineLogo from '../assets/mantine.svg'

export default function GlobalMenu() {
  return (
    <Header height={100} style={{ display: 'flex', maxWidth: '100%', justifyContent: 'space-around' }}>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" >
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://mantine.dev" target="_blank" >
          <img src={mantineLogo} className="logo react" alt="Mantine logo" />
        </a>
    </Header>
  )
}