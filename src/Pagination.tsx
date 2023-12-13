import { useState } from 'react'
import { 
  Grid, 
  Group, 
  Button, 
  Loader, 
  Alert, 
  Table 
} from '@mantine/core'
import { useQuery } from 'react-query'
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

const renderElements = (data: { results: any }) => {
  const { results } = data
  return results.map((element: any) => (
    <tr key={element.name}>
      <td>{element.name}</td>
      <td>{element.gender}</td>
      <td>{element.hair_color}</td>
      <td>{element.eye_color}</td>
    </tr>
  ))
}

const fetchPeople = (page: number) => fetch(URL + `?page=${page}`, { 
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  })
  .then(res => res.json())
//   .then(data => transformResult(data))

function Pagination() {
  const [page, setPage] = useState(1)
  const { isLoading, isError, error, data, isFetching, isPreviousData } =
      useQuery(
        ['people', page],
        () => fetchPeople(page), { keepPreviousData : true }
      );

      console.log(data)
  return (
    <main>
      <Grid>
        <Grid.Col xs={12}><h1>Pagination Fetch</h1></Grid.Col>
        <Grid.Col xs={12} h={'content'}>
          <Group position="center">
            <span>Current Page: {page}</span>
            <Button
                onClick={() => setPage(old => Math.max(old - 1, 0))}
                disabled={page === 1}
            >
                Previous Page
            </Button>{' '}
            <Button
                onClick={() => {
                if (!isPreviousData && data?.next) {
                    setPage(old => old + 1)
                }
                }}
                // Disable the Next Page button until we know a next page is available
                disabled={!data?.next}
            >
                Next Page
            </Button>            
          </Group>
          <Group position='center' style={{ marginTop: '4rem' }}>
            {isError ? (
                <Alert title="ERROR" color="red">{error?.message}</Alert>
            ) : null
            }

            {isFetching || isLoading ? <Loader variant='bars' size='lg' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '4rem' }} />
            :
            <Table verticalSpacing="sm">
              <thead>
                <tr>
                  {headers.map((header: string) => <th key={header} style={{ textAlign: 'center'}}>{header}</th>)}
                </tr>
              </thead>
              <tbody>
                {renderElements(data)}
              </tbody>
            </Table>
            }
              
          </Group>
        </Grid.Col>
      </Grid>
    </main>
  )
}

export default Pagination
