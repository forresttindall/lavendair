# Firebase Setup Guide

This guide will help you set up Firebase authentication for the Lavendair application.

## Prerequisites

- A Google account
- Node.js and npm installed
- The Lavendair project cloned locally

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter a project name (e.g., "lavendair-app")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project console, click on "Authentication" in the left sidebar
2. Click on the "Get started" button
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

## Step 3: Create a Web App

1. In the Firebase project overview, click the web icon (</>) to add a web app
2. Enter an app nickname (e.g., "lavendair-web")
3. Check "Also set up Firebase Hosting" if you plan to deploy (optional)
4. Click "Register app"

## Step 4: Get Configuration Keys

After registering your app, you'll see a configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## Step 5: Configure Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the Firebase configuration in your `.env` file:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
   ```

## Step 6: Create Admin User (Optional)

1. In the Firebase Console, go to Authentication > Users
2. Click "Add user"
3. Enter email: `forrest@creationbase.io`
4. Enter a password: `admin123` (or your preferred password)
5. Click "Add user"

## Step 7: Test the Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the login page
3. Try logging in with:
   - **Admin Login**: `forrest@creationbase.io` / `admin123`
   - **Development Login**: `dev@lavendair.com` / `dev123` (works without Firebase)
   - **Regular Login**: Create a new account or use Firebase users

## Development Login

For development purposes, you can use the built-in development login that doesn't require Firebase:

- Click the "🛠️ Dev" button on the login page
- Use `dev@lavendair.com` / `dev123`
- Or set custom credentials in your `.env` file:
  ```env
  VITE_DEV_EMAIL=your_dev_email@example.com
  VITE_DEV_PASSWORD=your_dev_password
  ```

## Security Notes

- Never commit your `.env` file to version control
- Use Firebase Security Rules to protect your data
- Consider setting up Firebase App Check for additional security
- The admin credentials are hardcoded for demo purposes - in production, use proper role-based access control

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Make sure all Firebase environment variables are set correctly
- Check that your Firebase project is properly configured

### "Firebase: Error (auth/invalid-api-key)"
- Verify your `VITE_FIREBASE_API_KEY` is correct
- Make sure the API key is enabled in the Firebase Console

### "Firebase: Error (auth/user-not-found)"
- The user doesn't exist in Firebase Authentication
- Create the user in the Firebase Console or use the registration flow

For more detailed Firebase documentation, visit: https://firebase.google.com/docs/auth/web/start