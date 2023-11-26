import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Register from './components/Register';
import Login from './Components/Login';
import TaskForm from './Components/TaskForm';
import Tasks from './Components/Tasks';
import TaskDetails from './Components/TaskDetails';

function App() {
  return (
    <Router>
    <Switch>
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/create-task" component={TaskForm} />
      <Route path="/task/:id" component={TaskDetails} />
    </Switch>
  </Router>
  );
}

export default App;
