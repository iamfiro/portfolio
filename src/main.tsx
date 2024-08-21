import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom";

import "./styles/global.scss";

// Pages
import PageHome from "./pages/home.tsx";
import ReactLenis from "@studio-freight/react-lenis";

const router = createBrowserRouter([
	{
		path: '/',
		element: <PageHome />
	}
])

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
		<ReactLenis root>
			<RouterProvider router={router} />
		</ReactLenis>
    </React.StrictMode>,
)
