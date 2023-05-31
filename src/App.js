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
import CreateProject from './pages/CreateProject';
import EditProject from './pages/EditProject';
import Project from './pages/Project';
import CreateTask from './pages/CreateTask';
import EditTask from './pages/EditTask';
import SecondPrivateRoute from './components/SecondPrivateRoute';
import Task from './pages/Task';

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

          <Route path='/create-project' element={<PrivateRoute />}>
                <Route path="/create-project" element={<CreateProject />}/>
          </Route>

          <Route path='/create-task' element={<PrivateRoute />}>
                <Route path="/create-task" element={<CreateTask />}/>
          </Route>

          <Route path='/edit-project' element={<PrivateRoute />}>
                <Route path="/edit-project/:projectID" element={<EditProject />}/>
          </Route>

          <Route path='/edit-task' element={<PrivateRoute />}>
                <Route path="/edit-task/:taskListId" element={<EditTask />}/>
          </Route>

          <Route path="/sign-in" element={<SignIn />}/>
          <Route path="/sign-up" element={<SingUp />}/>
          <Route path="/forgot-password" element={<ForgotPassword />}/>

          <Route path='/category/:categoryName/:projectID' element={<PrivateRoute />}>
                   <Route path="/category/:categoryName/:projectID" element={<Project />}/>
            </Route>
        
            <Route path='/category/:id' element={<PrivateRoute />}>
                   <Route path="/category/:id" element={<Task />}/>
            </Route>

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
