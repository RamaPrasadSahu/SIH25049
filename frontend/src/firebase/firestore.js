import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';

// User Profile Operations
export const createUserProfileDoc = async (userId, profileData) => {
  const userRef = doc(db, 'users', userId);
  return await setDoc(userRef, {
    uid: userId,
    ...profileData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }, { merge: true });
};

export const getUserProfileDoc = async (userId) => {
  const userRef = doc(db, 'users', userId);
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data() : null;
};

// Conversation Operations
export const createConversationDoc = async (userId, title, language) => {
  const convRef = collection(db, 'conversations');
  return await addDoc(convRef, {
    userId,
    title,
    language,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const getUserConversations = async (userId) => {
  try {
    const q = query(
      collection(db, 'conversations'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc'),
      limit(20)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.warn('Firestore offline query fallback:', error.message);
    return [];
  }
};

// Message Operations
export const addMessageDoc = async (conversationId, messageData) => {
  const msgRef = collection(db, 'conversations', conversationId, 'messages');
  return await addDoc(msgRef, {
    conversationId,
    ...messageData,
    createdAt: serverTimestamp()
  });
};

export const getConversationMessages = async (conversationId) => {
  try {
    const q = query(
      collection(db, 'conversations', conversationId, 'messages'),
      orderBy('createdAt', 'asc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.warn('Firestore messages query fallback:', error.message);
    return [];
  }
};

// Prediction Record Operations
export const savePredictionDoc = async (userId, predictionResult, features) => {
  const predRef = collection(db, 'predictions');
  return await addDoc(predRef, {
    userId,
    features,
    ...predictionResult,
    createdAt: serverTimestamp()
  });
};

export const getUserPredictions = async (userId) => {
  try {
    const q = query(
      collection(db, 'predictions'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.warn('Firestore predictions query fallback:', error.message);
    return [];
  }
};
