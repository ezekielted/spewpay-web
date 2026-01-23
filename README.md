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

### Project Structure

- app/: Next.js pages and layouts (Auth + Dashboard)
- services/: Centralized API logic (Repository pattern)
- components/: Reusable UI components and theme providers
- public/: Static assets and icons

### Key Features

- Service-Based Architecture: Centralized API client using the Repository pattern for clean and maintainable code.
- Secure Authentication Flow: Signup and Login pages fully integrated with the Spewpay API.
- Real-Time Dashboard: Live balance tracking and transaction history visualization.
- Wallet Onboarding: Intelligent "Create Wallet" flow for new users with simulated backend integration.
- Responsive Layout: Persistent sidebar with mobile-optimized navigation.
- Dual Theme Support: Full light and dark mode support using CSS variables.
