import { useState, useEffect, useCallback, memo } from 'react'
import { 
  Grid, 
  Group, 
  Button, 
  Loader, 
  Input, 
  Alert, 
  Text, 
  Table 
} from '@mantine/core'
import { IconFriends } from '@tabler/icons-react'
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
const compareElement = (prev: any, next:any ) => prev.element.name === next.element.name;

const Element = memo(({ element }: any) => {
  return (
    <tr key={element.name}>
      <td>{element.name}</td>
      <td>{element.gender}</td>
      <td>{element.hair_color}</td>
      <td>{element.eye_color}</td>
    </tr>
  )
}, compareElement)

const RenderElements = memo(({ elements = []}: { elements: any[]} ) => {
  console.log('RenderElements')
  return (elements.map((element: any) => (
    <Element key={element.name} element={element} />
  )))
})


function App() {
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string|null>()
  const [searchTerm, setSearchTerm] = useState<string|null>()
  const [elements, setElements] = useState<any[]|null>()

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

  const abortableFetch = useCallback(async () => {
    setSubmitting(true)
    setErrorMsg(null)

    try {
      const res = await fetch(URL + `?search=${searchTerm}`, { 
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
        signal: abortController.signal 
      })
      if (!res.ok) {
        setSubmitting(false)
        return setErrorMsg('Fail to load API data')
      }
      const data = await res.json()
      const elements = transformResult(data)
      console.log({ elements })
      setSubmitting(false)
      if (!Array.isArray(elements))  {
        return setErrorMsg('API data is not array')
      }
      setElements(elements)

    } catch(err) {
      setSubmitting(false)
      setErrorMsg('Network call error!')
    }
  }, [searchTerm])

  return (
    <main>
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
              {elements && <RenderElements elements={elements} />}
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
    </main>
  )
}

export default App
