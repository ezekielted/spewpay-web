# 📱 Detailed Mobile Porting Roadmap: Spewpay Expo Implementation

This document provides a technical blueprint and milestone-driven roadmap for transitioning the Spewpay Next.js web ecosystem into a high-performance, native mobile experience using **Expo** and **React Native**.

---

## 🏗️ Technical Architecture

### 1. Framework & Core Stack
- **Framework**: [Expo](https://expo.dev/) (Managed Workflow for rapid iteration and EAS support).
- **Navigation**: [Expo Router v3](https://docs.expo.dev/router/introduction/) (Standardizing file-based routing across web and mobile).
- **Styling**: [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS engine for React Native).
- **State Management**: 
  - **Server State**: `TanStack Query` (React Query) for caching and synchronization.
  - **Local State**: React Context for Auth and UI preferences.
- **Storage**: `Expo SecureStore` (for sensitive tokens) and `AsyncStorage` (for non-sensitive preferences).

### 2. Service & Logic Sharing Strategy
To avoid duplication, the `services/` layer should be abstracted:
- **API Client**: Standardize the `api-client.ts` to use a singleton instance that dynamically swaps storage engines (Local Storage vs. SecureStore).
- **Types**: Extract interfaces from `services/` into a shared `@spewpay/types` folder/package.
- **Validation**: Shared Zod schemas for forms (Login, Signup, Transfers).

---

## 📍 Porting Milestones

### Milestone 1: Environment & Shared Foundation
*Task: Setting up the infrastructure and bridging the web logic.*
- [ ] **Project Setup**: Initialize Expo with the `tabs` template.
- [ ] **NativeWind Integration**: Sync `tailwind.config.js` between Next.js and Expo.
- [ ] **Service Migration**:
  - Port `services/api-client.ts` with environment-aware token handling.
  - Port `auth.service.ts`, `wallet.service.ts`, and `transfer.service.ts`.
- [ ] **Theme System**: Implement Dark/Light mode using `nativewind` color schemes.

### Milestone 2: Authentication & Onboarding
*Task: Replicating the web security model for mobile.*
- [ ] **Login Screen**: Port multi-factor/OTP logic from `app/login`.
- [ ] **Signup Flow**: Recreate the multi-step registration UI (Personal -> Business -> Confirmation).
- [ ] **Auth Guards**: Implement Root Layout protection in Expo Router.
- [ ] **Biometrics (Native Bonus)**: Integrate `expo-local-authentication` for FaceID/TouchID login.

### Milestone 3: Core Navigation & Layouts
*Task: Mapping the dashboard structure to mobile paradigms.*
- [ ] **Bottom Tab Navigator**:
  - `(tabs)/index` ↔ `/dashboard`
  - `(tabs)/transfer` ↔ `/dashboard/transfer`
  - `(tabs)/history` ↔ `/dashboard/history`
  - `(tabs)/organizations` ↔ `/dashboard/organizations`
  - `(tabs)/profile` ↔ `/dashboard/profile`
- [ ] **Universal Header**: Custom header component with the "Profile Trigger" and Notification bell.

### Milestone 4: High-Fidelity Feature Porting
*Task: Transitioning complex dashboards and lists.*
- [ ] **Dashboard Overview**: Recreate the Glassmorphic balance cards.
- [ ] **Transaction History**: Use `@shopify/flash-list` for high-performance scrolling of `history` and `ledger` data.
- [ ] **Transfer Flow**: Port the recipient search and real-time fee calculation logic.
- [ ] **Org Management**: Port the allocation logic from `allocation.service.ts`.

### Milestone 5: The "Liquid Glass" Visual Polish
*Task: Applying the premium design system to native components.*
- [ ] **Blur Effects**: Use `expo-blur` for navigation bars and modal overlays.
- [ ] **Micro-animations**: Implement `react-native-reanimated` for layout transitions (e.g., balance reveal/hide).
- [ ] **Haptics**: Add `expo-haptics` feedback to successful transactions and button presses.

### Milestone 6: Native Integration & Testing
*Task: Optimizing for mobile-specific workflows.*
- [ ] **Push Notifications**: Integrate `expo-notifications` for transaction alerts.
- [ ] **Deep Linking**: Configure URL schemes for external payment redirects.
- [ ] **Performance Audit**: Ensure JS bundle sizes are optimized and startup time is < 2s.

### Milestone 7: Deployment & EAS
*Task: Productionizing the app for the stores.*
- [ ] **EAS Build**: Configure `eas.json` for development, staging, and production profiles.
- [ ] **Internal Distribution**: Deploy to Expo Go and TestFlight/App Center.
- [ ] **Store Assets**: Generate screenshots and metadata for Apple/Google.

---

## 🗺️ Page Mapping Table

| Web Route (`/app`) | Expo Route (`/app`) | Notes |
| :--- | :--- | :--- |
| `/login` | `/(auth)/login` | Secure token storage in SecureStore |
| `/signup` | `/(auth)/signup` | Multi-step form controller |
| `/dashboard` | `/(tabs)/index` | Primary wallet overview |
| `/dashboard/transfer` | `/(tabs)/transfer` | Recipient selection + Amount input |
| `/dashboard/history` | `/(tabs)/history` | Filterable transaction list |
| `/dashboard/profile` | `/(tabs)/profile` | Settings and User profile settings |
| `/dashboard/ledger` | `/profile/ledger` | Detailed movement tracking |

---

## 🛠️ Essential Native Packages
- **Navigation**: `expo-router`
- **Lists**: `@shopify/flash-list`
- **Forms**: `react-hook-form` + `zod`
- **Icons**: `@expo/vector-icons` (mapping to Lucide)
- **Security**: `expo-secure-store`
- **Image handling**: `expo-image` (for fast caching)
