import Navbar from "./components/Navbar";
import { ThemeProvider } from "./context/ThemeContext";
import Hero from "./components/Hero"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DoctorList from "./pages/DoctorList";
import UserLogin from "./pages/UserLogin";
import DoctorLogin from "./pages/DoctorLogin";
import UserRegister from "./pages/UserRegister";
import DoctorRegister from "./pages/DoctorRegister";
import DoctorDashboard from "./pages/DoctorDashboard";
import UserDashboard from "./pages/UserDashboard";

const App = () => {
  return (
   <ThemeProvider>
      <Router>
        <div className="bg-gray-50 dark:bg-gray-950 min-h-screen text-gray-900 dark:text-white">
          <Navbar />
        
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/doctors" element={<DoctorList />} />
             <Route path="/login/user" element={<UserLogin />} />
            <Route path="/login/doctor" element={<DoctorLogin />} />
            <Route path="/register/user" element={<UserRegister />} /> {/* <-- Add this line */}
            <Route path="/register/doctor" element={<DoctorRegister />} /> {/* <-- Add this line */}
            <Route path="/doctor/dashboard" element={<DoctorDashboard/>} />
            <Route path="/user/dashboard" element={<UserDashboard/>} />

          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App