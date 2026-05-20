# 🎓 NextStepUni-Web

> A full-stack university and bursary discovery platform designed to help students explore higher education opportunities, scholarships, and career pathways.

![GitHub repo size](https://img.shields.io/github/repo-size/DevMbhoni/NextStepUni-Web)
![GitHub last commit](https://img.shields.io/github/last-commit/DevMbhoni/NextStepUni-Web)
![GitHub stars](https://img.shields.io/github/stars/DevMbhoni/NextStepUni-Web?style=social)

---

## 📌 Overview

NextStepUni-Web is a modern full-stack web application developed to help students make informed academic decisions by providing access to:

- 🎓 Universities and programmes
- 💰 Bursaries and scholarships
- 📋 Admission requirements
- 🔍 Search and filtering functionality
- 👤 User authentication and profile management
- 🤖 AI-assisted chatbot for student guidance

The platform aims to simplify the process of discovering universities and funding opportunities by centralizing information in one place.

---

## 🚀 Problem Statement

Many students struggle to:

- Find relevant universities
- Discover available bursaries
- Understand entry requirements
- Access reliable and centralized information
- Determine eligibility for funding opportunities

Information is often fragmented across multiple websites, making decision-making difficult and time-consuming.

**NextStepUni-Web solves this problem by creating a centralized educational discovery platform.**

---

## ✨ Features

### 👨‍🎓 Student Features

- User Registration & Login
- Browse Universities
- Search & Filter Institutions
- View Programme Information
- Explore Bursaries & Scholarships
- Save Favourite Opportunities
- Profile Management

### 💰 Bursary System

- Browse bursaries
- Eligibility requirements
- Application deadlines
- Funding information
- Study-field matching

### 🛠️ Admin Features

- Manage universities
- Manage bursaries
- Update academic information
- Moderate system content

### 🤖 AI Chatbot

A lightweight AI-powered assistant that helps users answer questions related to:

- Universities
- Admission requirements
- Bursaries
- Scholarships
- Funding opportunities

The chatbot uses system data to provide responses and guidance.

---

## 🧱 Tech Stack

### Frontend
- HTML
- CSS
- JavaScript
- React

### Backend
- ASP.NET Core Web API
- C#

### Database
- SQL Server
- Entity Framework Core

### Authentication
- JWT Authentication 

### Development Tools
- Visual Studio
- VS Code
- Git & GitHub

---

## 🏗️ System Architecture

```plaintext
Frontend (Web Application)
        ↓
ASP.NET Core API
        ↓
Business Logic Layer
        ↓
SQL Server Database
```

---

## 📂 Project Structure

```plaintext
NextStepUni-Web
│── Frontend
│── Backend
│── Controllers
│── Models
│── Services
│── Data
│── Database
│── Authentication
│── UI Components
```

---

## ⚙️ Installation & Setup

### Clone Repository

```bash
git clone https://github.com/DevMbhoni/NextStepUni-Web.git
```

### Navigate to Project

```bash
cd NextStepUni-Web
```

### Install Dependencies

```bash
npm install
```

### Run Frontend

```bash
npm start
```

### Run Backend

```bash
dotnet run
```

---

## 🗄️ Database Configuration

Update the connection string inside:

```json
appsettings.json
```

Example:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER;Database=NextStepUniDB;Trusted_Connection=True;"
}
```

Then run migrations:

```bash
dotnet ef database update
```

---

## 🌍 Deployment Status

🚧 Currently running locally.

Cloud deployment is planned for a future release while infrastructure and hosting configurations are being finalized.

Planned deployment technologies:

- Microsoft Azure
- SQL Cloud Database
- CI/CD with GitHub Actions

---

## 📸 Screenshots

### Universities Page
<img width="1897" height="862" alt="image" src="https://github.com/user-attachments/assets/60f65ebb-bfb5-43c9-82ad-4d09cdf71c06" />

### Bursaries page
<img width="1877" height="861" alt="image" src="https://github.com/user-attachments/assets/e201c977-f480-4188-b1d0-afa761b55209" />

### Student Dashboard
<img width="1902" height="855" alt="image" src="https://github.com/user-attachments/assets/6124a1f7-6bf1-43e1-b799-3407412b0c65" />

### AI Chatbot
<img width="601" height="857" alt="image" src="https://github.com/user-attachments/assets/4d8f91e6-6772-4f01-8067-d90f5b699792" />

### Admin Dashboard
<img width="1881" height="858" alt="image" src="https://github.com/user-attachments/assets/403e0f32-7df6-4973-b096-b54f7619eb84" />

---

## 🔮 Future Improvements

- Cloud deployment
- Advanced AI chatbot
- University comparison tools
- Application tracking
- Notification system
- Mobile responsiveness

---

## 👨‍💻 Developer

**Mbhoni Shipalana**

Computer Science & Statistics Graduate  
Aspiring Software Engineer & Data Analyst

📧 Email: shipalanambhoniii@gmail.com  
💼 LinkedIn: https://www.linkedin.com/in/mbhoni-shipalana-83b9b826b/ 
🐙 GitHub: https://github.com/DevMbhoni

---

## ⭐ Support

If this project helped or interested you, feel free to star the repository.
