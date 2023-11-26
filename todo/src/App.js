import React, { useState } from 'react';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import RegisterationForm from './Components/RegisterationForm';
import Login from './Components/Login';
import TaskForm from './Components/TaskForm';
import Tasks from './Components/Tasks';
import TaskDetails from './Components/TaskDetails';

function App() {
  const [isNavOpen, setNavOpen] = useState(false);

  const toggleNav = () => {
    setNavOpen(!isNavOpen);
  };

  return (

    <BrowserRouter>
      <div>
        <nav className="navbar navbar-expand-lg nav ">

          <div className="container-fluid">
            <button
              className="navbar-toggler"
              type="button"
              onClick={toggleNav}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
              <div className="navbar-nav">
                <Link to="/register" className="nav-link active" aria-current="page">Register</Link>
                <Link to="/login" className="nav-link" >Login </Link>
                <Link to="/tasks" className="nav-link" >My Tasks </Link>
                <Link to="/create-task" className="nav-link" >Create Task</Link>
                <Link to="/task/:id" className="nav-link" >View Task</Link>
              </div>
            </div>
          </div>
        </nav>

        <div className={`offcanvas offcanvas-start ${isNavOpen ? 'show' : ''}`} id="offcanvas" tabIndex="-1" aria-labelledby="offcanvasLabel">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasLabel">Menu</h5>
            <button
              type="button"
              className="btn-close text-reset"
              onClick={toggleNav}
            ></button>
          </div>
          <div className="offcanvas-body">
            <ul className="nav flex-column position-relative">
              <li className="nav-item " onClick={toggleNav}>
                <Link to="/register" className="nav-link active" >Register</Link>
              </li>
              <li className="nav-item" onClick={toggleNav}>
                <Link to="/login" className="nav-link" >Login </Link>

              </li>
              <li className="nav-item" onClick={toggleNav}>
                <Link to="/tasks" className="nav-link" >My Tasks </Link>

              </li>
              <li className="nav-item" onClick={toggleNav}>
                <Link to="/create-task" className="nav-link" >Create Task</Link>
              </li>
              <li className="nav-item">
                <Link to="/task/:id" className="nav-link" >View Task</Link>
              </li>
            </ul>

          </div>

        </div>

        <Routes>
          <Route path="/" element={<RegisterationForm />} />
          <Route path="/register" element={<RegisterationForm/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/tasks" element={<Tasks/>} />
          <Route path="/create-task" element={<TaskForm/>} />
          <Route path="/task/:id" element={<TaskDetails/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
