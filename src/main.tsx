import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/global.scss'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/home'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
)
