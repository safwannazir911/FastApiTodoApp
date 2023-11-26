import React, { useState } from 'react';
import axios from 'axios';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/login', {
                username,
                password,
            });

            console.log('Login successful:', response.data);
            alert('Login successful!');
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed!');
        }
    };

    return (
        <div className="container mt-4"> {/* Add Bootstrap container class */}
            <h2>User Login</h2>
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
                <button type="submit" className="btn btn-primary">Login</button> {/* Add Bootstrap button classes */}
            </form>
        </div>
    );
}

export default Login;
