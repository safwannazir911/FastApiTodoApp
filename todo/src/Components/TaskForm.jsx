import React, { useState } from 'react';
import axios from 'axios';

function TaskForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const token = localStorage.getItem('access_token'); // Retrieve the token from wherever you store it
            const response = await axios.post('http://localhost:8000/create_task', {
                title,
                description,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('Task created successfully:', response.data);
            alert('Task created successfully!');
        } catch (error) {
            console.error('Task creation failed:', error);
            alert('Task creation failed!');
        }
    };

    return (
        <div className="container mt-4">
            <h2>Create a Task</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                        Task Title:
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </label>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                        Task Description:
                        <textarea
                            className="form-control"
                            id="description"
                            rows="3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </label>
                </div>
                <button type="submit" className="btn btn-primary">
                    Create Task
                </button>
            </form>
        </div>
    );
}

export default TaskForm;
