import React, { useState } from 'react';
import axios from 'axios';

function RegisterForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/register', {
                username,
                password,
            });

            console.log('Registration successful:', response.data);
            alert('Registration successful!');
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed!');
        }
    };

    return (
        <div className="container mt-4"> {/* Add Bootstrap container class */}
            <h2>User Registration</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3"> {/* Add Bootstrap margin class */}
                    <label htmlFor="username" className="form-label">
                        Username:
                        <input type="text" className="form-control" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </label>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password:
                        <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </label>
                </div>
                <button type="submit" className="btn btn-primary">Register</button> {/* Add Bootstrap button classes */}
            </form>
        </div>
    );
}

export default RegisterForm;
