# Mall Customer Segmentation

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Python Backend](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)
![Frontend](https://img.shields.io/badge/Frontend-React_Vite-61DAFB?logo=react)
![Machine Learning](https://img.shields.io/badge/ML-Scikit_Learn-F7931E?logo=scikit-learn)

A full-stack, aesthetically driven application for performing **K-Means Customer Segmentation** on Mall Customers. This project leverages an underlying Machine Learning model via Python, provides predictions via a FastAPI backend, and visualizes the clustering using an ultra-premium dark-themed React + Vite interface.

## 🚀 Features

- **Unsupervised Learning Core**: Uses Scikit-learn's `KMeans` algorithm to discover natural groupings among customers based on Annual Income and Spending Score.
- **Lightning-Fast API**: Built with `FastAPI` and `uvicorn`, exposing endpoints for dynamic, real-time segment prediction via REST API.
- **Cyber-Aesthetic UI**: A modern React frontend featuring glassmorphism, responsive Recharts visualization, micro-animations, and a sleek dark theme utilizing custom Google Fonts.

## 📂 Project Structure
- `backend/`
  - `train.py`: The data-processing script. Reads the CSV, fits the K-Means + Scaler, and dumps the binaries into `backend/model/`.
  - `main.py`: The FastAPI server application to serve cluster data and accept prediction parameters.
  - `requirements.txt`: Python dependencies.
- `frontend/`
  - A standard modern React + Vite + CSS application.
  - `src/App.jsx`: Main routing logic and UI for the dashboard scatterplot and dynamic prediction form.

## ⚙️ Installation & Running Locally

1. **Clone the repository**
```bash
git clone https://github.com/your-username/mall-customer-segmentation.git
cd "mall-customer-segmentation"
```

2. **Run the Backend API**
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

3. **Run the Frontend UI**
*(In a separate terminal)*
```bash
cd frontend
npm install
npm run dev
```

Visit the frontend at [http://localhost:5173/](http://localhost:5173/) to interact with the model!

## 🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
