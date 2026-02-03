# Harborview Project

A React Native mobile application built with Expo for managing educational simulations with role-based access control.

## 📋 Overview

Harborview Project is a simulation management platform that enables administrators to create, manage, and assign educational simulations to students. The app features real-time updates, user management, and a secure authentication system.

## ✨ Features

### Authentication

- **User Registration & Login**: Email/password authentication with Firebase
- **Role-Based Access**: Separate admin and student user roles
- **Forgot Password**: Password reset functionality via email
- **Username Recovery**: Retrieve username by email lookup

### Admin Features

- **Simulation Management**: Create, edit, delete, and lock/unlock simulations
- **User Assignment**: Assign specific simulations to individual students
- **Real-time Updates**: Live synchronization of simulation data
- **User Search**: Search and filter students by name or email
- **Access Control**: Grant or revoke student access to simulations

### Student Features

- **Assigned Simulations**: View only simulations assigned by administrators
- **Real-time Sync**: Automatic updates when simulations are modified
- **Locked Content**: Cannot access locked simulations

### UI/UX

- **Smooth Animations**: Slide-up and fade-in transitions for modals
- **Interactive Components**: Custom dropdown selectors and cards
- **Responsive Design**: Optimized for iOS and Android devices
- **Search Functionality**: Filter users in real-time

## 🛠️ Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Backend**: Firebase
  - Firebase Authentication
  - Cloud Firestore (NoSQL database)
  - Firebase Storage
- **State Management**: React Context API
- **UI Components**:
  - React Native core components
  - Expo Vector Icons
  - react-native-element-dropdown
- **Animations**: React Native Animated API

## 📁 Project Structure

```
harborview-project/
├── app/                          # App screens (file-based routing)
│   ├── (admin)/                 # Admin-only screens
│   │   ├── _layout.tsx
│   │   └── dashboard.tsx
│   ├── (auth)/                  # Authentication screens
│   │   ├── login.tsx
│   │   └── signup.tsx
│   ├── (student)/               # Student-only screens
│   │   ├── _layout.tsx
│   │   └── dashboard.tsx
│   ├── simulation/
│   │   └── [id].tsx            # Dynamic simulation detail page
│   ├── _layout.tsx
│   └── index.tsx
├── src/
│   ├── components/
│   │   └── ui/                 # Reusable UI components
│   │       ├── ManageUsersModal.tsx
│   │       ├── SimulationCard.tsx
│   │       ├── RoleSelector.tsx
│   │       └── ForgotPasswordModal.tsx
│   ├── context/
│   │   └── AuthContext.tsx     # Authentication context
│   ├── services/
│   │   ├── firebase.ts         # Firebase configuration
│   │   ├── adminService.ts     # Admin-specific operations
│   │   ├── studentService.ts   # Student-specific operations
│   │   └── passwordResetService.ts
│   └── data/
│       └── simulations.ts      # Simulation data
├── android/                     # Android native code
├── ios/                         # iOS native code
├── assets/                      # Images and static assets
├── app.json                     # Expo configuration
├── eas.json                     # EAS Build configuration
├── package.json
└── tsconfig.json

```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac only) or Android Emulator
- Firebase project with Authentication and Firestore enabled

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd harborview-project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Download configuration files:
     - `google-services.json` → place in `android/app/`
     - `GoogleService-Info.plist` → place in `ios/harborviewproject/`
   - Update `src/services/firebase.ts` with your Firebase config

4. **Set up Firestore Security Rules**

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       function isAuthenticated() {
         return request.auth != null;
       }

       function isAdmin() {
         return isAuthenticated() &&
                get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
       }

       match /users/{userId} {
         allow read: if isAdmin();
         allow write: if isAuthenticated() && request.auth.uid == userId;
       }

       match /simulations/{simId} {
         allow read, write: if isAdmin();
         allow read: if isAuthenticated();
       }
     }
   }
   ```

### Running the App

**Start the development server:**

```bash
npx expo start
```

**Run on iOS:**

```bash
npx expo run:ios
```

**Run on Android:**

```bash
npx expo run:android
```

**Run in Expo Go:**

- Scan the QR code with the Expo Go app (iOS/Android)

## 🔑 User Roles

### Admin

- Create, edit, and delete simulations
- Assign simulations to specific students
- Lock/unlock simulations
- View all users
- Manage user access

### Student

- View assigned simulations only
- Access unlocked simulations
- Real-time updates when content changes

## 📱 Key Features in Detail

### User Assignment System

Administrators can assign specific simulations to individual students:

- Search users by email or display name
- One-click assign/remove access
- Real-time UI updates
- Persistent storage in Firestore

### Authentication Flow

- Email/password registration with role selection
- Optional display name during signup
- Secure login with Firebase Authentication
- Password reset via email
- Username recovery by email lookup

### Real-time Synchronization

- Uses Firestore's `onSnapshot` for live updates
- Automatically reflects changes across all devices
- Soft-delete for simulations (preserves data)

## 🔐 Security

- Firebase Authentication for secure user management
- Firestore Security Rules for role-based access control
- Admin-only operations protected at database level
- Client-side validation with server-side enforcement

## 🏗️ Building for Production

### Using EAS Build

**Build for iOS:**

```bash
eas build --platform ios --profile production
```

**Build for Android:**

```bash
eas build --platform android --profile production
```

**Submit to App Stores:**

```bash
eas submit --platform ios
eas submit --platform android
```

## 📝 Development

### Branch Strategy

- `main`: Production-ready code
- `dev`: Development branch for new features

### Committing Changes

```bash
git checkout dev
git add .
git commit -m "Your commit message"
git push origin dev
```

### Merging to Main

```bash
git checkout main
git merge dev
git push origin main
```

## 🐛 Troubleshooting

**Firestore Permission Errors:**

- Verify security rules are deployed
- Ensure user document has `role` field set correctly

**Build Failures:**

- Clear cache: `npx expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Rebuild: `cd ios && pod install && cd ..`

**Firebase Configuration Issues:**

- Verify config files are in correct directories
- Check Firebase console for enabled services

## 📄 License

This project is private and proprietary.

## 👥 Contributors

- Taylor Shen

## 📞 Support

For issues or questions, please contact the development team.
