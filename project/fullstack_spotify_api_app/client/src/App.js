import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Signup from './pages/Signup';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css"
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase_config';
import AlbumEdit from './pages/AlbumEdit';

function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));
  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      window.location.pathname = "/login/page";
    })
  }
  return (
    <>
      <Router>
        <Navbar collapseOnSelect bg="dark" data-bs-theme="dark" expand="lg">
          <Container>
            <Navbar.Brand href="#">Spotify API App</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
                {!isAuth ? (
                  <>
                    <Nav.Link href="/signup/page">Sign Up</Nav.Link>
                    <Nav.Link href="/login/page">Login</Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link href="/favorites/page">Favorites</Nav.Link>
                    <Button variant='dark' onClick={signUserOut}>Logout</Button>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login/page' element={<Login setIsAuth={setIsAuth} />} />
          <Route path='/favorites/page' element={<Favorites isAuth={isAuth} />} />
          <Route path="/signup/page" element={<Signup setIsAuth={setIsAuth} />} />
          <Route path="/edit/album/:id" element={<AlbumEdit  />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;