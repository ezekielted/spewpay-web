# Spewpay Frontend

Spewpay is a high-performance Fintech dashboard built with Next.js, featuring a double-entry ledger system and integrated payment processing.

## 🚀 Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Package Manager**: Yarn
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API Client**: Axios (Service/Repository Pattern)

## 🛠️ Getting Started

### 1. Installation

```bash
yarn install
```

### 2. Run Development Server

```bash
yarn dev
```

Open http://localhost:3000 with your browser to see the result.

### 3. Build for Production

```bash
yarn build
```

### 📂 Project Structure

app/: Next.js pages and layouts. Includes Auth (Login/Signup) and the core Dashboard.
services/: The API logic layer. All backend communication is centralized here.
components/: Reusable UI elements and theme providers.
public/: Static assets and icons.

### ✨ Key Features

Service-Based Architecture: Centralized API client using the Repository pattern for clean, maintainable code.
Secure Auth Flow: Integrated Signup and Login pages connected to the Spewpay API.
Real-time Dashboard: Live balance tracking and transaction history visualization.
Wallet Onboarding: Intelligent "Create Wallet" flow for new users with simulated backend integration.
Responsive Layout: Persistent sidebar and mobile-optimized navigation.
Dual-Theme Support: Full Dark and Light mode support via CSS variables.
