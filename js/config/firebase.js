// Firebase Web configuration is public project metadata, not an authentication secret.
const firebaseConfig = {
  apiKey: "AIzaSyAmQiE6pP-zzs4GdC6uB4y6kCPQKLio514",
  authDomain: "lemonsqueezy-2026.firebaseapp.com",
  projectId: "lemonsqueezy-2026",
  storageBucket: "lemonsqueezy-2026.firebasestorage.app",
  messagingSenderId: "720217680377",
  appId: "1:720217680377:web:2b9ccd4cd7d57c7d9db528",
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
// Firestore's own IndexedDB cache supports repeat reads and offline browsing.
// Multi-tab mode prevents an extra open tab from disabling persistence.
// Security rules still apply to server reads and writes.
db.enablePersistence({ synchronizeTabs: true }).catch((error) => {
  if (error.code !== "failed-precondition" && error.code !== "unimplemented")
    console.warn("Firestore local cache unavailable:", error);
});
