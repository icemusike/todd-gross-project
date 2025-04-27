import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';

// Your web app's Firebase configuration
// Replace with your own Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Auth functions
export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = () => {
  return signOut(auth);
};

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore functions
export const saveOverlay = async (overlayData) => {
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  
  const overlayWithUser = {
    ...overlayData,
    userId: user.uid,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  if (overlayData.id) {
    const overlayRef = doc(db, 'overlays', overlayData.id);
    await updateDoc(overlayRef, {
      ...overlayWithUser,
      updatedAt: new Date()
    });
    return overlayData.id;
  } else {
    const docRef = await addDoc(collection(db, 'overlays'), overlayWithUser);
    return docRef.id;
  }
};

export const getOverlays = async () => {
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  
  const q = query(collection(db, 'overlays'), where('userId', '==', user.uid));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const getOverlayById = async (id) => {
  const docRef = doc(db, 'overlays', id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data()
    };
  } else {
    throw new Error('Overlay not found');
  }
};

export const deleteOverlay = async (id) => {
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  
  const docRef = doc(db, 'overlays', id);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) throw new Error('Overlay not found');
  if (docSnap.data().userId !== user.uid) throw new Error('Not authorized');
  
  await deleteDoc(docRef);
};

export { db, auth };
