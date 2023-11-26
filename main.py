from typing import Any, Optional
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from bson import ObjectId
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import JWTError, jwt
from dotenv import load_dotenv
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId, json_util
import json
import os

#Creating FastApi App
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

#DOT ENV Configuration
env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path)

# MongoDB Configuration
MONGODB_URL = os.environ.get("MONGODB_URL")
client = AsyncIOMotorClient(MONGODB_URL)
database = client["fastApiDB"]

# Dependency to get the MongoDB database
async def get_db():
    db = client.get_database()
    yield db

# Models
class User(BaseModel):
    username: str
    password: str

class Task(BaseModel):
    title: str
    description: str
    owner_id: Optional[Any]=None

#Token Configuration
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

SECRET_KEY = os.environ.get("SECRET_KEY")

#Getting the currenty logged in user
async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncIOMotorDatabase = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        user = await db.users.find_one({"username": username})
        if user is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    return user  # Return the user document instead of just the username

#Creating the Bearer token
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode,SECRET_KEY, algorithm="HS256")
    return encoded_jwt

# User Registration
@app.post("/register")
async def register(user: User, db: AsyncIOMotorDatabase = Depends(get_db)):
    # Save user data to MongoDB
    user_data = user.model_dump()
    result = await db.users.insert_one(user_data)
    return {"user_id": str(result.inserted_id)}

# Token endpoint for user login
@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncIOMotorDatabase = Depends(get_db)):
    user = await db.users.find_one({"username": form_data.username, "password": form_data.password})
    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Generate access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(data={"sub": user["username"]}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

# Create a new task for a specific user
@app.post("/create_task")
async def create_task(task: Task, current_user: User = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    task_data = task.model_dump()
    task_data["owner_id"] = current_user["_id"]
    result = await db.tasks.insert_one(task_data)
    return {"task_id": str(result.inserted_id)}

# Get a list of tasks for a logged-in user
@app.get("/tasks")
async def get_tasks(current_user: User = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    # Use aggregate to retrieve tasks associated with the current user
    pipeline = [
        {"$match": {"owner_id": current_user["_id"]}},
        {"$project": {"_id": 1, "title": 1, "description": 1, "owner_id": 1}},
    ]

    tasks_cursor = db.tasks.aggregate(pipeline)
    tasks = await tasks_cursor.to_list(length=None)
    #Used json_util.dumps to serialize MongoDB objects in the list of tasks, and then used json.loads to parse the JSON data back into a Python data structure. This ensures that ObjectId objects are serialized properly.
    # Convert ObjectId to string in each task
    tasks_str = json.loads(json_util.dumps(tasks))

    return {"tasks": tasks_str}

# Get details of a specific task by ID for the logged-in user
@app.get("/task/{task_id}")
async def get_task(task_id: str, current_user: User = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    task = await db.tasks.find_one({"_id": ObjectId(task_id), "owner_id": current_user["_id"]}, {"_id": 0, "title": 1, "description": 1})
    if task:
        return {"task": task}
    else:
        raise HTTPException(status_code=404, detail="Task not found")

# Update task details
@app.put("/update_task/{task_id}")
async def update_task(task_id: str, updated_task: Task, current_user: User = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    existing_task = await db.tasks.find_one({"_id": ObjectId(task_id), "owner_id": current_user["_id"]})
    if existing_task:
        await db.tasks.update_one({"_id": ObjectId(task_id)}, {"$set": updated_task.model_dump()})
        return {"message": "Task updated successfully"}
    else:
        raise HTTPException(status_code=404, detail="Task not found")

# Delete a task
@app.delete("/delete_task/{task_id}")
async def delete_task(task_id: str, current_user: User = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    result = await db.tasks.delete_one({"_id": ObjectId(task_id), "owner_id": current_user["_id"]})
    if result.deleted_count == 1:
        return {"message": "Task deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Task not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
