User Management API
This repository implements a role-based user management system using Node.js, Express, and MongoDB. The system supports Admin, Moderator, and Client roles with unique permissions. It provides functionality for user management, authentication, role-based access control, and managing moderator permissions.

Features
1. Authentication
Signup and Login: Users can register and log in securely using hashed passwords (bcrypt).
JWT-based Authorization: Securely manage user sessions using signed JSON Web Tokens (JWT) stored as HTTP-only cookies.
Logout: Clear authentication cookies to log out.
2. Role-Based Access Control (RBAC)
Admin:
Full access to user data.
Manage users (add, update, delete).
Handle moderator requests.
Moderator:
Request permission for specific actions.
Fetch user details and update them (with valid permissions).
Client:
Restricted role for general use.
3. Moderator Requests
Moderators can request temporary permissions to perform administrative actions. Admins approve or deny these requests.
Approved requests expire after a defined period.
4. Validators
Input validation for authentication endpoints.
Enforce strong passwords and valid email formats.
5. Database Integration
MongoDB schemas for Users and Moderator Requests.
Mongoose is used for modeling and querying.
Project Structure
bash
Copy code
|-- controllers/         # Logic for handling API endpoints
|-- middleware/          # Role-based access control and request validation
|-- models/              # Mongoose schemas for database entities
|-- routes/              # Route definitions for various endpoints
|-- utils/               # Helper functions (JWT handling, input validation)
|-- app.js               # Main entry point for the application
|-- .env.example         # Example environment variables
API Endpoints
Authentication
POST /signup
Purpose: Register a new user.
Body:
json
Copy code
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword",
  "role": "CLIENT"
}
Response: User registration confirmation.
POST /login
Purpose: Authenticate an existing user.
Body:
json
Copy code
{
  "email": "john@example.com",
  "password": "securePassword"
}
Response: Login success with session token.
GET /logout
Purpose: Logout the authenticated user.
Response: Clears the authentication cookie.
Admin Endpoints (Admin Role Required)
GET /admin/users
Purpose: Retrieve a list of all users.
POST /admin/add-user
Purpose: Add a new user.
Body:
json
Copy code
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securePassword",
  "role": "MODERATOR"
}
PUT /admin/update-user/:id
Purpose: Update user details.
DELETE /admin/delete-user/:id
Purpose: Remove a user by ID.
GET /admin/moderator-requests
Purpose: View all moderator permission requests.
PUT /admin/manage-request/:id
Purpose: Approve or deny a moderator request.
Body:
json
Copy code
{
  "status": "APPROVED",
  "expiresIn": 30
}
Moderator Endpoints (Moderator Role Required)
POST /moderator/request-permission
Purpose: Request permission for an administrative action.
Body:
json
Copy code
{
  "action": "UPDATE_USER"
}
GET /moderator/request-status
Purpose: Check the status of the requested permission.
GET /moderator/users/:id
Purpose: Fetch details of a user (with valid permission).
PUT /moderator/update-user/:id
Purpose: Update user details (with valid permission).
Validation
Sign-Up:
Name is required.
Email must be valid.
Password must be at least 6 characters.
Login:
Email is required.
Password must match a registered user.
Installation
Clone the repository:
bash
Copy code
git clone https://github.com/your-repo/user-management-api.git
Install dependencies:
bash
Copy code
npm install
Configure .env file (see .env.example):
env
Copy code
PORT=5000
MONGO_URI=mongodb://localhost:27017/user-management
JWT_SECRET=your_jwt_secret
Start the server:
bash
Copy code
npm start
Technologies Used
Node.js: Backend runtime.
Express.js: Server framework.
MongoDB: NoSQL database.
Mongoose: Object modeling for MongoDB.
Bcrypt: Secure password hashing.
JWT: Token-based authentication.

