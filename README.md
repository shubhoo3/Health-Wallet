# 🏥 Digital Health Wallet

A **full-stack Digital Health Wallet** that allows users to securely store, track, visualize, and share medical reports and health vitals anytime, anywhere.

This project demonstrates **secure healthcare data handling**, **role-based access control**, and **data visualization** using modern web technologies.

---

## 📌 Problem Statement

Design a Health Wallet that is accessible to a person anywhere, anytime with the following capabilities:

- Upload medical reports 
- Track health vitals over time
- Retrieve reports by date, vitals, and category
- Share selected reports with doctors, family members, or friends with controlled access

---

## ✨ Features

### 👤 User Management
- User registration and login
- JWT-based authentication
- Role-based access:
  - **Owner**
  - **Viewer (Read-only)**

### 📄 Health Reports
- Upload medical reports (PDF / Images)
- Store metadata:
  - Report type (Blood Test, X-Ray, etc.)
  - Date
  - Associated vitals
- View and download reports
- Filter reports by:
  - Date
  - Category
  - Vital type

### ❤️ Vitals Tracking
- Record vitals over time:
  - Blood Sugar
  - Blood Pressure
  - Heart Rate
  - Temperature
  - Weight
  - Oxygen Level
- Visualize trends using charts
- Filter vitals by date range

### 🔐 Access Control
- Share specific reports with:
  - Doctors
  - Family members
  - Friends
- Read-only access for shared users
- Separate views:
  - **Shared by Me**
  - **Shared with Me**

---

## 🛠️ Tech Stack

### Frontend
- React.js (Vite)
- Axios
- Recharts
- Deployed on **Vercel**

### Backend
- Node.js
- Express.js
- JWT Authentication
- Multer (File uploads)
- Deployed on **Render**

### Database
- SQLite (Persistent disk on Render)

---


