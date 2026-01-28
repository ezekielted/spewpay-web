# Mobile Porting Roadmap: Spewpay Expo Implementation

This document outlines the strategic milestones for porting the Spewpay Next.js web application to a native mobile experience using **Expo** and **React Native**.

---

## 🏗️ Architecture & Tech Stack
To maintain consistency with the web version, we will use:
- **Framework**: [Expo](https://expo.dev/) (Managed Workflow)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **State Management**: React Context / Hooks (Shared logic with web)
- **Storage**: [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/secure-store/) for sensitive auth tokens.
- **Icons**: `lucide-react-native`
- **Animations**: `react-native-reanimated` for the "Liquid Glass" feel.

---

## 📍 Milestones

### Milestone 1: Foundation & Project Setup
*Goal: Initialize the Expo project and establish shared logic.*
- [ ] Initialize Expo project with TypeScript and Expo Router.
- [ ] Configure NativeWind to match web Tailwind configuration (colors, spacing).
- [ ] **Logic Sync**: Port `services/` layer (Axios client). Replace `localStorage` with `Expo SecureStore` for auth tokens.
- [ ] Implement primitive UI components (Button, Input, Card) using the existing design system.

### Milestone 2: Authentication Flow
*Goal: Port the full login/signup/reset experience.*
- [ ] **Login Screen**: Port existing logic, including error handling.
- [ ] **Signup Screen**: Port multi-step registration flow.
- [ ] **Forgot/Reset Password**: Implement the newly created OTP and verification flow.
- [ ] Implement Auth Guards (Redirect to Login if no token).

### Milestone 3: Core Dashboard & Navigation
*Goal: Establish the mobile navigation hierarchy.*
- [ ] **Bottom Tab Navigator**: Implement the 5 core tabs (Overview, Deposit, Send, History, Organizations).
- [ ] **Header Profile Trigger**: Place the Profile link in the top-right header (matches web mobile refactor).
- [ ] Port the **Balance Visibility** logic using a shared Context provider.

### Milestone 4: Feature Porting & Layouts
*Goal: Migrate individual pages while optimizing for touch.*
- [ ] **Overview**: Recreate the balance card and recent activity list with native performance.
- [ ] **Transfer (Send)**: Port the recipient selection and amount inputs.
- [ ] **Deposit**: Implement deposit instructions and QR code generation.
- [ ] **History & Ledger**: Optimize long lists using `FlashList` for smooth scrolling.
- [ ] **Organizations**: Port management and team allocation features.

### Milestone 5: Profile & Settings Hub
*Goal: Implement the secondary navigation hub.*
- [ ] **Profile Page**: Recreate the user info card and navigation grid (Ledger, Settings, Appearance).
- [ ] **Appearance Settings**: Implement theme switching (Light/Dark) using `next-themes` equivalents for mobile.
- [ ] **Biometrics**: Add optional FaceID/TouchID login (Mobile-exclusive feature).

### Milestone 6: UI Refinement (The "Liquid Glass" Feel)
*Goal: Apply the premium aesthetic to native components.*
- [ ] Implement Gaussian blur effects using `expo-blur`.
- [ ] Recreate smooth micro-animations using `React Native Reanimated`.
- [ ] Optimize haptic feedback for primary buttons and successful transactions.

### Milestone 7: Testing, CI/CD & Deployment
*Goal: Prepare for store submission.*
- [ ] Configure **EAS (Expo Application Services)** for cloud builds.
- [ ] Conduct Internal Testing (TestFlight for iOS, App Center for Android).
- [ ] Performance audit: Ensure 60fps scrolling on History and Ledger pages.
- [ ] Submit to Apple App Store and Google Play Store.

---

## 🎨 Asset Migration Note
- Use SVGs for all icons via `react-native-svg`.
- Port existing brand assets (logos, manifest icons) into `assets/` directory.
- Use `expo-font` to load the same typography used in the web app.
