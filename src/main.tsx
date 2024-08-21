import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom";

const router = createBrowserRouter([

])

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
		<RouterProvider router={router} />
    </React.StrictMode>,
)
