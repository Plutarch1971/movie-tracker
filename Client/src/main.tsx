import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HomePage from "./pages/HomePage";
import SearchResultsPage from "./pages/SearchResultsPage";
import ProfilePage from "./pages/ProfilePage";
import MovieInfoPage from "./pages/MovieInfoPage";
import SignUp from "./pages/Auth/SignUpForm.tsx";
import Login from "./pages/Auth/LoginForm.tsx";


const router = createBrowserRouter([
    {
        path:'/',
        element: <App />,
        children: [
            {
                path: "/",
                element: <Login />
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
                path: "/movie/:id",
                element: <MovieInfoPage />
            },
            {
                path: "/signup",
                element: <SignUp />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/home",
                element: <HomePage />
            }

        ]
    }
])


createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router}></RouterProvider>
)
