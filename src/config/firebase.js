import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:demo123456'
}

// Initialize Firebase only if we have valid configuration
let app = null
let auth = null
let db = null

try {
  // Only initialize if we have a real API key (not the demo one)
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'demo-api-key') {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
  } else {
    console.warn('Firebase not initialized: Using demo configuration. Please add your Firebase credentials to .env file.')
  }
} catch (error) {
  console.warn('Firebase initialization failed:', error.message)
}

export { auth, db }

export default app