import React, { Component } from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Home from './pages/Home';
import Profile from './pages/Profile';
import SignIn from './pages/SingIn';
import SingUp from './pages/SingUp';
import Projects from './pages/Projects';
import ForgotPassword from './pages/ForgotPassword';
import Header from './components/Header';

class App extends Component {
  render() {
    return (
      <>
      <Router>
        
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />}/>
          <Route path="/sign-in" element={<SignIn />}/>
          <Route path="/sign-up" element={<SingUp />}/>
          <Route path="/projects" element={<Projects />}/>
          <Route path="/forgot-password" element={<ForgotPassword />}/>

        </Routes>
      </Router>
      </>
    );
  }
}

export default App;
