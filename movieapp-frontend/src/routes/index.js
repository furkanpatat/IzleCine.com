import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import ExplorePage from "../pages/ExplorePage";
import DetailsPage from "../pages/DetailsPage";
import SearchPage from "../pages/SearchPage";
import PasswordReset from "../pages/PasswordReset";  
import LoginPage from "../pages/LoginPage";
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
            }
        ]
    }
])

export default router