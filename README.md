# 🚭 Smoking Cessation Support System

A full-stack web application designed to help users quit smoking by tracking progress, setting goals, and receiving coaching support.

---

## 📌 Overview
This system provides tools for users to:
- Track daily smoking habits
- Set personalized quit plans
- Monitor progress and achievements
- Interact with coaches and community

---

## 🧠 Features

### 👤 User Features
- User registration & authentication (JWT)
- Create and manage quit plans
- Track smoking reduction progress
- Receive notifications and achievements
- Join community discussions

### 🧑‍⚕️ Coach Features
- Manage appointments with users
- Provide consultation and support
- Monitor user progress

### 🛠️ Admin Features
- Manage users and system data
- View system reports

---

## 🏗️ System Architecture

- **Backend:** ASP.NET Core Web API
- **Frontend:** ReactJS (Vite)
- **Database:** SQL Server
- **Authentication:** JWT (Role-based: Admin, Member, Coach)

---

## ⚙️ Technologies Used

### Backend
- C# (.NET Core)
- Entity Framework Core
- RESTful API
- SQL Server

### Frontend
- ReactJS
- Vite
- TypeScript

### Tools
- Git & GitHub
- Postman (API testing)

---

## 📊 Database

- Designed with 20+ relational tables
- Includes:
  - User, MemberProfile, CoachProfile
  - GoalPlan, ProgressLog
  - Appointment, Feedback
  - Notification, Badge, Ranking

---

## 🚀 How to Run the Project

### Backend
```bash
cd WebSmokingSupport
dotnet restore
dotnet run