// TaskDetails.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function TaskDetails() {
  const [task, setTask] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    // Fetch task details from the server based on the task ID
    const fetchTaskDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/task/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setTask(response.data.task);
      } catch (error) {
        console.error('Error fetching task details:', error);
      }
    };

    fetchTaskDetails();
  }, [id]);

  return (
    <div className="container mt-4">
      <h2>Task Details</h2>
      {task ? (
        <div>
          <h3>{task.title}</h3>
          <p className="fs-5">{task.description}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default TaskDetails;
