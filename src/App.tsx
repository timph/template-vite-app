import { useState, useEffect } from 'react'
import { 
  MantineProvider, 
  Container, 
  Grid, 
  Group, 
  Button, 
  Loader, 
  Input, 
  Alert, 
  Text, 
  Header, 
  Footer, 
  Table 
} from '@mantine/core'
import { IconFriends } from '@tabler/icons-react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import mantineLogo from './assets/mantine.svg'
import './App.css'

const URL = 'https://swapi.dev/api/people'

const headers = [
  'Name',
  'Gender',
  'Hair Color',
  'Eye Color',
]

const transformResult = (jsonResult: { results: any }) => {
  return jsonResult.results;
}

const renderElements = (elements: any[]) => {
  return elements.map((element: any) => (
    <tr key={element.name}>
      <td>{element.name}</td>
      <td>{element.gender}</td>
      <td>{element.hair_color}</td>
      <td>{element.eye_color}</td>
    </tr>
  ))
}

function App() {
  const [submitting, setSubmitting] = useState(false)
  const [elements, setElements] = useState<any[]|null>()
  const [errorMsg, setErrorMsg] = useState<string|null>()
  const [searchTerm, setSearchTerm] = useState<string|null>()

  const abortController = new AbortController();
  abortController.signal.addEventListener('abort', () => {
    // any cleanup things
    setSubmitting(false);
    setErrorMsg(null)
  })

  useEffect(() => {
    return () => {
      // Cleanup the abort controller on component unmount
      if (abortController) {
        abortController.abort();
      }
    };
  }, []);

  const updateInput = (e: any) => {
    setErrorMsg(null)
    setSearchTerm(e.target.value)
  }

  const handleKeyPress = (e: any) => {
      // Check if the Enter key was pressed.
    if (e.keyCode === 13) {
      abortableFetch()
    }
  }

  const abortableFetch = async () => {
    setSubmitting(true)
    setErrorMsg(null)

    try {
      const res = await fetch(URL + `?search=${searchTerm}`, { signal: abortController.signal })
      if (!res.ok) {
        setSubmitting(false)
        return setErrorMsg('Fail to load API data')
      }
      const data = await res.json()
      const elements = transformResult(data)
      setSubmitting(false)
      if (!Array.isArray(elements))  {
        return setErrorMsg('API data is not array')
      }
      setElements(elements)

    } catch(err) {
      setSubmitting(false)
      setErrorMsg('Network call error!')
    }
  }

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Container size='lg' fluid={true} bottom={40}>
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
        <Grid>
          <Grid.Col xs={12}><h1>Fetcher</h1></Grid.Col>
          <Grid.Col xs={12} h={500}>
            <Group position="center">

              <Input name='searchName' 
                icon={<IconFriends />} 
                placeholder="search name" 
                onChange={updateInput}
                onKeyDown={handleKeyPress}
                />

              <Button onClick={abortableFetch} disabled={submitting}>
                Fetch API call
              </Button>
              
              <Button disabled={!elements} onClick={() => setElements(null)}>
                Clear
              </Button>

            </Group>
            <Group position='center' style={{ marginTop: '4rem' }}>
              
              {errorMsg && <Alert title="ERROR" color="red" withCloseButton closeButtonLabel='X' onClose={() => setErrorMsg(null) }>{errorMsg}</Alert>}
              
              <Table verticalSpacing="sm">
                <thead>
                  <tr>
                    {elements && headers.map((header: string) => <th key={header} style={{ textAlign: 'center'}}>{header}</th>)}
                  </tr>
                </thead>
                <tbody>
                {elements && renderElements(elements)}
                {!elements && submitting && <Loader variant='bars' size='lg' style={{ marginTop: '4rem' }} />}
                </tbody>
              </Table>
            </Group>
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col xs={12}>
            <Text>
              <a href="https://react.dev/">React</a> is library and framework for Web and Mobile
            </Text>
            <Text>
                <a href="https://vitejs.dev/">Vite</a> is Next Generation FrontEnd tooling
            </Text>
            <Text>
              <a href="https://mantine.dev/">Mantine</a> is React component library
            </Text>
          </Grid.Col>
        </Grid>

        <Footer height={100} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          <p className="subtext">Name: Tim Pham</p>
          <p className="subtext">Contact: timtpham@gmail.com</p>
        </Footer>
      </Container>
    </MantineProvider>
  )
}

export default App
