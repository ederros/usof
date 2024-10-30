# USOF API

USOF API is a Node.js application that serves as a backend for a user management and content system. It includes functionality for user authentication, content creation, and management of posts, comments, and likes.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Initialization](#database-initialization)
- [Running the Application](#running-the-application)
- [Dependencies](#dependencies)
- [API Endpoints](#api-endpoints)

## Installation

1. Clone the repository:
   ```  
   git clone https://github.com/ederros/usof.git
   cd usof

2. Install the dependencies:
npm install


## Environment Variables
Create a .env file in the root of your project and add the following environment variables:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=12345678
DB_NAME=usof
PORT=5050
MAIL=server@gmail.com
MAIL_PASS=application_password
JWT_SECRET=super_secret_code

## Database Initialization
To set up the database, follow these steps:

1. Navigate to the sql folder:

cd sql

2. Execute the SQL initialization script via the command line:

Use the following command:
 
mysql -u your_username -p < db_init.sql

![Database EER diagram](https://ibb.co/6D4qg8T)  

## Running the Application
To start the API server, run the following command in the root directory of your project:

node app.js
Your API should now be running on http://localhost:5050 or with another port what you are set in .env file.

## Dependencies
The following dependencies are required for this project:
{
  "dependencies": {
    "bcrypt": "^5.1.1",
    "cookie-parser": "^1.4.7",
    "dotenv": "^16.4.5",
    "ejs": "^3.1.10",
    "express": "^4.21.1",
    "express-session": "^1.18.1",
    "fs": "^0.0.1-security",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1",
    "mysql2": "^3.11.3",
    "node-querybuilder": "^2.1.1",
    "nodemailer": "^6.9.16",
    "prisma": "^5.21.1"
  }
}

## API Endpoints

Authentication Endpoints

POST /api/auth/register - Register a new user
POST /api/auth/register/ - Confirm user registration
POST /api/auth/login - User login
POST /api/auth/logout - User logout
POST /api/auth/password-reset - Request password reset
POST /api/auth/password-reset/ - Confirm password reset

User Endpoints

GET /api/users - Retrieve all users
GET /api/users/ - Retrieve a user by ID
POST /api/users - Create a new user
PATCH /api/users/ - Update a user by ID
PATCH /api/users/avatar - Upload a user's avatar
DELETE /api/users/ - Delete a user by ID

Post Endpoints

GET /api/posts - Retrieve all posts
GET /api/posts/ - Retrieve a post by ID
GET /api/posts/comments - Retrieve comments for a post
GET /api/posts/categories - Retrieve categories for a post
GET /api/posts/likes - Retrieve likes for a post
POST /api/posts - Create a new post
POST /api/posts/comments - Create a comment on a post
POST /api/posts/like - Like a post
PATCH /api/posts/ - Update a post by ID
DELETE /api/posts/ - Delete a post by ID
DELETE /api/posts/like - Remove like from a post

Category Endpoints

GET /api/categories - Retrieve all categories
GET /api/categories/ - Retrieve a category by ID
GET /api/categories/posts - Retrieve posts for a category
POST /api/categories - Create a new category
PATCH /api/categories/ - Update a category
DELETE /api/categories/ - Delete a category

Comment Endpoints

GET /api/comments/ - Retrieve a comment by ID
GET /api/comments/like - Retrieve likes for a comment
POST /api/comments/like - Like a comment
PATCH /api/comments/ - Update a comment
DELETE /api/comments/ - Delete a comment
DELETE /api/comments/like - Remove like from a comment