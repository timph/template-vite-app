import { Outlet } from 'react-router-dom'
import { 
  MantineProvider, 
  Container,
} from '@mantine/core'
import GlobalMenu from './GlobalMenu'
import Footer from './Footer'

export default function Layout() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Container size='lg' fluid={true} bottom={40}>
        <GlobalMenu />        
        <Outlet />
        <Footer />
      </Container>
    </MantineProvider>
);
}
