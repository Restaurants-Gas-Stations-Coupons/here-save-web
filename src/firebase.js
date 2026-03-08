import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBwfEjaxbAc5ydDH2gGGCwIvJ9KsxuZ89I',
  authDomain: 'payloex.firebaseapp.com',
  projectId: 'payloex',
  storageBucket: 'payloex.firebasestorage.app',
  messagingSenderId: '801626498477',
  appId: '1:801626498477:web:64bdf17e983e1d2647ad24',
  measurementId: 'G-3GLRJ57GJD',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };
