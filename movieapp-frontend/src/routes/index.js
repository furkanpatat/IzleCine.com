import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import ExplorePage from "../pages/ExplorePage";
import DetailsPage from "../pages/DetailsPage";
import SearchPage from "../pages/SearchPage";
import PasswordReset from "../pages/PasswordReset";
import ForgotPassword from "../pages/ForgotPassword";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";
import CompleteProfile from "../pages/CompleteProfile";
import AdminLayout from '../components/admin/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import EditMovies from '../pages/admin/EditMovies';
import UserStats from '../pages/admin/UserStats';
import EditMovieDetails from '../pages/admin/EditMovieDetails';
import AddMovie from "../pages/admin/AddMovie";
import DeleteMovie from '../pages/admin/DeleteMovie';
import ManageUsers from '../pages/admin/ManageUsers';
import StatisticsPage from '../pages/StatisticsPage';
import SystemLogsPage from '../pages/SystemLogsPage';
import PlatformSettings from '../pages/admin/PlatformSettings';
import ReportedComments from '../pages/admin/ReportedComments';
import FeedbackManagement from '../pages/admin/FeedbackManagement';
import MovieDetails from '../components/MovieDetails';
import Watchlist from '../pages/Watchlist';
import UserProfile from '../pages/UserProfile';
import CategoryPage from "../pages/CategoryPage";
import SettingsPage from "../pages/SettingsPage";
import Privacy from "../pages/Privacy";
import Terms from "../pages/Terms";
import Contact from "../pages/Contact";
import AdminManagement from '../pages/admin/AdminManagement';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />
            },
            {
                path: "movie/:id",
                element: <MovieDetails />
            },
            {
                path: "password-reset",
                element: <PasswordReset />
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />
            },
            {
                path: "login",
                element: <LoginPage />
            },
            {
                path: "signup",
                element: <SignUpPage />
            },
            {
                path: "complete-profile",
                element: <CompleteProfile />
            },
            {
                path: "user-profile",
                element: <UserProfile />
            },
            {
                path: "watchlist",
                element: <Watchlist />
            },
            {
                path: "category/:key",
                element: <CategoryPage />
            },
            {
                path: "settings",
                element: <SettingsPage />
            },
            {
                path: "privacy",
                element: <Privacy />
            },
            {
                path: "terms",
                element: <Terms />
            },
            {
                path: "contact",
                element: <Contact />
            },
            {
                path: ":explore",
                element: <ExplorePage />
            },
            {
                path: ":explore/:id",
                element: <DetailsPage />
            },
            {
                path: "search",
                element: <SearchPage />
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
                        path: 'add-movie',
                        element: <AddMovie />,
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
                    {
                        path: 'statistics',
                        element: <StatisticsPage />,
                    },
                    {
                        path: 'system-logs',
                        element: <SystemLogsPage />,
                    },
                    {
                        path: 'platform-settings',
                        element: <PlatformSettings />,
                    },
                    {
                        path: 'reported-comments',
                        element: <ReportedComments />,
                    },
                    {
                        path: 'feedback',
                        element: <FeedbackManagement />,
                    },
                    {
                        path: 'admin-management',
                        element: <AdminManagement />,
                    },
                ],
            }
        ]
    }
])

export default router