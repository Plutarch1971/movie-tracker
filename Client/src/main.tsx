import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HomePage from "./pages/HomePage";
import SearchResultsPage from "./pages/SearchResultsPage";
import ProfilePage from "./pages/ProfilePage";
import MovieInfoPage from "./pages/MovieInfoPage";

const router = createBrowserRouter([
    {
        path:'/',
        element: <App />,
        children: [
            {
                path: "/",
                element: <HomePage />
            },
            {
                path: "/search",
                element: <SearchResultsPage />
            },
            {
                path: "/profile",
                element: <ProfilePage />
            },
            {
                path: "/movieinfo",
                element: <MovieInfoPage />
            },
        ]
    }
])


createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router}></RouterProvider>
)
