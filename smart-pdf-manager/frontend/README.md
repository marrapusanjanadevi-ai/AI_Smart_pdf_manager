<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
# AI Smart PDF Manager

A mobile-first intelligent document management system that processes PDFs, enables natural language search via embeddings, auto-categorizes content, provides smart merge suggestions, and allows date-based deletion.

## 🚀 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS 3, Lucide Icons
- **Backend**: FastAPI, SQLAlchemy, SQLite, Python
- **AI/NLP**: Sentence Transformers (`all-MiniLM-L6-v2`), FAISS Vector Database, PyMuPDF (Fitz)

## ⚙️ How to Run Locally

### 1. Start the Backend API

```bash
cd backend
python -m venv venv

# Activate Environment (Windows)
.\venv\Scripts\activate
# Activate Environment (Mac/Linux)
source venv/bin/activate

# Install Dependencies
pip install fastapi uvicorn sqlalchemy pymupdf sentence-transformers faiss-cpu python-multipart

# Start Server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

*The backend will be available at http://localhost:8000. It manages SQLite & FAISS vector states automatically.*

### 2. Start the Frontend App

```bash
cd frontend

# Install Node Dependencies
npm install

# Start Vite Dev Server
npm run dev -- --host
```

*The frontend application will be available at http://localhost:5173. You can access it on your local network using your machine's IP address (e.g. http://192.168.x.x:5173).*
>>>>>>> cbf5054b150bbb567e7305fb6fe8b764bc9e2da8
