# 🚀 Mahipal Singh — Portfolio

A modern, AI-inspired personal portfolio website built with **Angular** and powered by a **Python/FastAPI** backend with **MongoDB** for contact form submissions.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Angular](https://img.shields.io/badge/Angular-21-red?logo=angular)
![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)

---

## ✨ Features

- 🎨 **Futuristic AI-inspired UI** — animated loader, glassmorphism, dark theme
- 📱 **Fully Responsive** — optimized for all screen sizes
- 📬 **Contact Form** — submissions stored in MongoDB Atlas via REST API
- 🔒 **Health-check aware** — contact form gracefully degrades if backend is offline
- ⚡ **Smooth Animations** — micro-interactions and scroll effects throughout

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 21, TypeScript, CSS |
| Backend | Python, FastAPI |
| Database | MongoDB Atlas |
| Deployment | *(add your platform here, e.g. Vercel / Render)* |

---

## 📂 Project Structure

```
portfolio/              # Angular frontend
│
├── src/
│   ├── app/            # Components (hero, about, skills, projects, contact)
│   └── assets/         # Images and static files
│
├── angular.json
└── package.json

portfolio_backend/      # Python FastAPI backend (separate repo)
├── app/
│   ├── main.py         # FastAPI app & routes
│   └── models.py       # Pydantic models
└── requirements.txt
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20
- Angular CLI (`npm install -g @angular/cli`)
- Python >= 3.11
- MongoDB Atlas account (or local MongoDB)

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/mahipalSingh08/mahipal-portfolio.git
cd mahipal-portfolio

# Install dependencies
npm install

# Start development server
ng serve
```

Navigate to `http://localhost:4200/`

### Backend Setup

```bash
# Navigate to the backend repo
cd portfolio_backend

# Create and activate virtual environment
python -m venv .venv
.venv\Scripts\activate     # Windows
# source .venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Add your MONGO_URI to .env

# Run the server
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000/`

---

## 🌐 Live Demo

> 🔗 https://www.mahipal.tech/

---

## 📬 Contact

**Mahipal Singh**  
📧 *(your email here)*  
🔗 [LinkedIn](https://linkedin.com/in/mahipalsingh) · [GitHub](https://github.com/mahipalSingh08)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
