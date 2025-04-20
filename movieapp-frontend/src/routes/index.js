import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import ExplorePage from "../pages/ExplorePage";
import DetailsPage from "../pages/DetailsPage";
import SearchPage from "../pages/SearchPage";
import PasswordReset from "../pages/PasswordReset";  
import LoginPage from "../pages/LoginPage";
import AdminLayout from '../components/admin/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import EditMovies from '../pages/admin/EditMovies';
import UserStats from '../pages/admin/UserStats';
import EditMovieDetails from '../pages/admin/EditMovieDetails';
import DeleteMovie from '../pages/admin/DeleteMovie';
import ManageUsers from '../pages/admin/ManageUsers';

const router = createBrowserRouter([
    {
        path :"/",
        element : <App/>,
        children : [
            {
                path : "",
                element : <Home/>
            },
            {
                path:":explore",
                element:<ExplorePage/>

            },
            {
                path:":explore/:id",
                element:<DetailsPage/>
                
            },
            {
                path:":search",
                element:<SearchPage/>
                
            },
            {
                path: "password-reset",  // Yeni route burada
                element: <PasswordReset />  // Şifre sıfırlama bileşeni
            },
            {
                path: "login",
                element: <LoginPage />
            },
            {
                path: 'admin',
                element: <AdminLayout />,
                children: [
                    {
                        index: true,
                        element: <Dashboard />,
                    },
                    {
                        path: 'edit-movies',
                        element: <EditMovies />,
                    },
                    {
                        path: 'delete-movies',
                        element: <DeleteMovie />,
                    },
                    {
                        path: 'user-stats',
                        element: <UserStats />,
                    },
                    {
                        path: 'edit-movie/:id',
                        element: <EditMovieDetails />,
                    },
                    {
                        path: 'manage-users',
                        element: <ManageUsers />,
                    },
                ],
            }
        ]
    }
])

export default router