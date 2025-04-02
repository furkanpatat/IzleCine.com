import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../views/Login"; // ✅ Doğru import yolu
import SignUpPage from "../views/Signup"; // Doğru import yolu

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
