import React, { Component } from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Home from './pages/Home';
import Profile from './pages/Profile';
import SignIn from './pages/SingIn';
import SingUp from './pages/SingUp';
import Projects from './pages/Projects';
import PrivateRoute from './components/PrivateRoute';
import ForgotPassword from './pages/ForgotPassword';
import Header from './components/Header';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

class App extends Component {
  render() {
    return (
      <>
      <Router>
        
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/profile' element={<PrivateRoute />}>
             <Route path="/profile" element={<Profile />}/>
          </Route>
          <Route path='/projects' element={<PrivateRoute />}>
             <Route path="/projects" element={<Projects />}/>
          </Route>
          <Route path="/sign-in" element={<SignIn />}/>
          <Route path="/sign-up" element={<SingUp />}/>
          <Route path="/projects" element={<Projects />}/>
          <Route path="/forgot-password" element={<ForgotPassword />}/>

        </Routes>
      </Router>
      <ToastContainer
            position='bottom-center'
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
    />
      </>
    );
  }
}

export default App;
