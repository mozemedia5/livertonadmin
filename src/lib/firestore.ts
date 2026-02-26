import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { db } from './firebase';

// Types
export interface Order {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  businessName?: string;
  businessType: string;
  services: string[];
  projectDescription: string;
  targetAudience: string;
  designStyle: string;
  timeline: string;
  budgetRange?: string;
  additionalNotes?: string;
  status: 'new' | 'in-progress' | 'completed';
  createdAt: Timestamp;
}

export interface Rating {
  id?: string;
  appId: string;
  rating: number;
  deviceId: string;
  createdAt: Timestamp;
}

export interface Review {
  id?: string;
  appId: string;
  userName: string;
  review: string;
  rating: number;
  createdAt: Timestamp;
}

export interface Donation {
  id?: string;
  fullName: string;
  email: string;
  amount: number;
  reason: string;
  message?: string;
  status: 'pending' | 'completed';
  createdAt: Timestamp;
}

export interface ContactSubmission {
  id?: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Timestamp;
}

export interface Love {
  id?: string;
  appId: string;
  deviceId: string;
  createdAt: Timestamp;
}

// Orders
export const createOrder = async (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
  return await addDoc(collection(db, 'orders'), {
    ...order,
    status: 'new',
    createdAt: Timestamp.now()
  });
};

export const getOrders = async () => {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
};

export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, { status });
};

export const deleteOrder = async (orderId: string) => {
  await deleteDoc(doc(db, 'orders', orderId));
};

// Ratings
export const createRating = async (appId: string, rating: number, deviceId: string) => {
  const existingRating = await getUserRating(appId, deviceId);
  if (existingRating) {
    const ratingRef = doc(db, 'ratings', existingRating.id!);
    await updateDoc(ratingRef, { rating, createdAt: Timestamp.now() });
    return existingRating.id;
  }
  const docRef = await addDoc(collection(db, 'ratings'), {
    appId,
    rating,
    deviceId,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

export const getUserRating = async (appId: string, deviceId: string) => {
  const q = query(collection(db, 'ratings'), where('appId', '==', appId), where('deviceId', '==', deviceId));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Rating;
};

export const getAverageRating = async (appId: string) => {
  const q = query(collection(db, 'ratings'), where('appId', '==', appId));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return 0;
  const ratings = snapshot.docs.map(doc => doc.data().rating);
  return ratings.reduce((a, b) => a + b, 0) / ratings.length;
};

export const getRatingCount = async (appId: string) => {
  const q = query(collection(db, 'ratings'), where('appId', '==', appId));
  const snapshot = await getDocs(q);
  return snapshot.size;
};

// Reviews
export const createReview = async (review: Omit<Review, 'id' | 'createdAt'>) => {
  return await addDoc(collection(db, 'reviews'), {
    ...review,
    createdAt: Timestamp.now()
  });
};

export const getReviews = async (appId?: string) => {
  let q;
  if (appId) {
    q = query(collection(db, 'reviews'), where('appId', '==', appId), orderBy('createdAt', 'desc'));
  } else {
    q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));
};

// Loves
export const toggleLove = async (appId: string, deviceId: string) => {
  const q = query(collection(db, 'loves'), where('appId', '==', appId), where('deviceId', '==', deviceId));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    await addDoc(collection(db, 'loves'), {
      appId,
      deviceId,
      createdAt: Timestamp.now()
    });
    return true;
  } else {
    await deleteDoc(doc(db, 'loves', snapshot.docs[0].id));
    return false;
  }
};

export const getLoveCount = async (appId: string) => {
  const q = query(collection(db, 'loves'), where('appId', '==', appId));
  const snapshot = await getDocs(q);
  return snapshot.size;
};

export const hasUserLoved = async (appId: string, deviceId: string) => {
  const q = query(collection(db, 'loves'), where('appId', '==', appId), where('deviceId', '==', deviceId));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

// Donations
export const createDonation = async (donation: Omit<Donation, 'id' | 'createdAt' | 'status'>) => {
  return await addDoc(collection(db, 'donations'), {
    ...donation,
    status: 'pending',
    createdAt: Timestamp.now()
  });
};

export const getDonations = async () => {
  const q = query(collection(db, 'donations'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Donation));
};

// Contact Submissions
export const createContactSubmission = async (submission: Omit<ContactSubmission, 'id' | 'createdAt'>) => {
  return await addDoc(collection(db, 'contacts'), {
    ...submission,
    createdAt: Timestamp.now()
  });
};

export const getContactSubmissions = async () => {
  const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactSubmission));
};

// Analytics
export const getTotalVisits = async () => {
  const docRef = doc(db, 'analytics', 'visits');
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data().count : 0;
};

export const incrementVisits = async () => {
  const docRef = doc(db, 'analytics', 'visits');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    await updateDoc(docRef, { count: (docSnap.data().count || 0) + 1 });
  } else {
    await setDoc(docRef, { count: 1 });
  }
};

export const getMostViewedApp = async () => {
  const docRef = doc(db, 'analytics', 'appViews');
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : {};
};

export const incrementAppView = async (appId: string) => {
  const docRef = doc(db, 'analytics', 'appViews');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    await updateDoc(docRef, { [appId]: (data[appId] || 0) + 1 });
  } else {
    await setDoc(docRef, { [appId]: 1 });
  }
};
