# FastAPI MongoDB CRUD Application

This is a simple CRUD (Create, Read, Update, Delete) application built with FastAPI and MongoDB. It provides a RESTful API for managing tasks.

## Features

- User registration and login
- Token-based authentication
- Create, read, update, and delete tasks
- Secure access using OAuth2

## Prerequisites

- Python 3.8+
- MongoDB installed and running
- Additional dependencies listed in requirements.txt

## Installation

1. Clone the repository:

- git clone https://github.com/safwannazir911/FastApi
    
2. Install dependencies:

- pip install -r requirements.txt
- cd todo
- npm i

3. Run the applications backend server:

- uvicorn main:app --reload

4. Run the applications frontend server:

- cd todo
- npm start

## API Documentation

Access the Swagger documentation at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) to explore and test the API.

## Endpoints

- **POST /register**: Register a new user.
- **POST /login**: Obtain an access token.
- **POST /create_task**: Create a new task.
- **GET /tasks**: Get a list of tasks for the logged-in user.
- **GET /task/{task_id}**: Get details of a specific task by ID.
- **PUT /update_task/{task_id}**: Update task details.
- **DELETE /delete_task/{task_id}**: Delete a task.


