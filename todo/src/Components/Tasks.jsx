import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Tasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Fetch tasks data from the server
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:8000/tasks', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setTasks(response.data.tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="container mt-4">
      <h2>My Tasks</h2>
      <ul className="list-group">
        {tasks.map((task) => (
          <li key={task._id} className="list-group-item">
            <h4>{task.title}</h4>
            <p className='fs-5'> {task.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tasks;
