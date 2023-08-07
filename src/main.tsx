import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'

import Layout from './components/Layout'
import App from './App'
// import Pagination from './Pagination'
import ErrorPage from './Error'
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      // {
      //   path: "/query",
      //   element: <Query />,
      // },
      // {
      //   path: "/pagination",
      //   element: <Pagination />,
      // },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)
