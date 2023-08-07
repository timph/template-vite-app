import { useRouteError } from "react-router-dom";
import {
  Box,
  Text,
} from '@mantine/core'

export default function ErrorPage({ errMsg = null } = {}) {
  const error = useRouteError();
  console.error(error);

  return (
    <main>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#f44336',
        }}
      >
      <Text variant="h1" style={{ color: 'white' }}>
        {!error ? null :
          <div>{error.status} {error.statusText || error.message}</div>
        }
        { errMsg }
      </Text>
    </Box>
    </main>
  );
}
