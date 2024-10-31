import "./App.css";
import { useState, useEffect } from "react";
import { UserProvider } from "./context/UserContext";
import { Container } from "react-bootstrap";
import AppNavBar from "./components/AppNavBar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Error from "./pages/Error";
import Workout from "./pages/Workout";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";


function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  });

  function unsetUser() {
    localStorage.clear();
  }

  useEffect(() => {
    console.log(user);
    console.log(localStorage);
  }, [user]);

  useEffect(() => {
    // Set user state based on token presence
    if (localStorage.getItem("token")) {
      setUser({ id: "authenticated" });
    } else {
      setUser({ id: null });
    }
  }, []);

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavBar />
        <Container>
          <Routes>
            <Route path="/" element={<Workout />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;
