# SunnyBooks Backend (FWEB_Backend)

This repository contains the backend for the SunnyBooks system.  
It is built using Node.js and Express, with MongoDB Atlas as the database.  
The backend provides REST APIs for users, books, loans, and reservations.

This project follows DevOps and GitOps practices.  
The backend is connected to GitHub and deployed on Render.

When code is pushed to the `main` branch:
- GitHub Actions runs a CI pipeline
- Dependencies are installed
- The server is started as a sanity check
- Render automatically deploys the latest version

No manual deployment is required.

GitHub is the single source of truth.  
All deployments are triggered by Git commits.

The backend is live at:  
https://fweb-backend-8ge9.onrender.com

Health check endpoint:  
GET /

Environment variables are managed in Render and not committed to GitHub.  
This includes the MongoDB connection string and port number.

Technologies used:
- Node.js
- Express.js
- MongoDB Atlas
- GitHub Actions
- Render
