# Nesti Admin Dashboard

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

Nesti Admin is a modern, responsive dashboard template built for scalability and performance. It serves as the frontend interface for the Nesti Community ecosystem.

## 🚀 Features

* **Authentication Flow**: Full sign-in/sign-up integration with JWT handling.
* **Dynamic Dashboard**: Real-time data visualization using ApexCharts.
* **Form Management**: Complex form handling with validation and diverse input types.
* **Responsive Design**: Mobile-first architecture using Tailwind CSS.
* **Data Tables**: Interactive tables for Service and Category management.

## 🛠 Tech Stack

* **Core**: React 19, TypeScript, Vite
* **Styling**: Tailwind CSS v4
* **Routing**: React Router v7
* **State/API**: Axios (with Interceptors)
* **Testing**: Vitest, React Testing Library
* **Charts**: ApexCharts

## 📁 Project Structure

```
src/
├── api/          # Axios setup & API services
├── components/   # Reusable UI components (Atoms/Molecules)
├── layout/       # Main App Layouts (Sidebar, Header)
├── pages/        # Page-level components
├── context/      # Global state (Theme, Auth)
└── hooks/        # Custom React Hooks
```

## ⚙️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-repo/nesti-admin-frontend.git](https://github.com/your-repo/nesti-admin-frontend.git)
    cd nesti-admin-frontend
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory:
    ```env
    VITE_API_BASE_URL=http://localhost:8000/api
    # Do NOT put secret tokens here
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

## 📦 Building for Production (AWS/Vercel)

The project uses Vite for bundling. Environment variables in production must be set in your CI/CD pipeline (e.g., AWS Amplify Environment Variables).

```bash
npm run build
