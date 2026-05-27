# ServiceHub

Full Stack service order management system for technical teams.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

---

# About the Project

ServiceHub is a complete service order management platform designed for technical teams and operational workflows.

The system allows administrators and technicians to manage service requests, monitor execution progress, generate technical reports, upload attachments, and track operational metrics through a responsive dashboard.

This project was built focusing on modern full stack architecture, REST APIs, authentication, relational databases, and responsive UI design.

---

# Features

## Authentication & Authorization
- JWT authentication
- Role-based access control
- Admin and Technician permissions

## Service Orders
- Create service orders
- Priority management
- Workflow status control
- Separate execution tabs
- Assigned technician management

## Technical Execution
- Accept service orders
- Add support team members
- Technical report submission
- Image/file upload support
- Execution history

## Dashboard
- Operational metrics
- Critical service orders
- Completion rate
- Active technicians
- Recent activity feed

## Technician Management
- Create technicians
- Edit technician data
- Activate/deactivate technicians
- Individual profile page

## Responsive Design
- Desktop and mobile support

---

# Technologies Used

## Frontend
- React
- React Router DOM
- Axios
- CSS3

## Backend
- Node.js
- Express
- Prisma ORM
- JWT
- Multer
- Bcrypt

## Database
- PostgreSQL

## Deployment
- Vercel
- Render
- Neon Database

---

# Architecture

```txt
Frontend (React)
↓
REST API (Node + Express)
↓
Prisma ORM
↓
PostgreSQL
```

---

# Live Demo

Frontend:
https://servicehub-dun.vercel.app

Backend:
https://servicehub-fvu4.onrender.com

---

# Screenshots

## Dashboard
(Add screenshot here)

## Service Orders
(Add screenshot here)

## Technical Report
(Add screenshot here)

## Technician Management
(Add screenshot here)

---

# Running Locally

## Backend

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# Learning Outcomes

During the development of this project, I practiced and improved concepts such as:

- REST APIs
- Full Stack Architecture
- JWT Authentication
- Relational Databases
- File Upload Handling
- Role-Based Permissions
- Responsive Design
- Application Deployment
- Clean Code Organization

---

# Future Improvements

- Real-time notifications
- Internal chat system
- Digital signature support
- Analytics charts
- PWA support
- WhatsApp integration
- Full maintenance history

---

# Author

Developed by Hiago Rodrigues Tabelli.