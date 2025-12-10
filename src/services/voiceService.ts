
import { db } from './firebase';
import { collection, addDoc, serverTimestamp, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { VoiceUtterance, VoiceSession } from '../types';

export const VoiceService = {
  async saveSession(userId: string, transcript: VoiceUtterance[], summary: string) {
    if (!userId) throw new Error("User ID required");
    
    try {
      const docRef = await addDoc(collection(db, 'voiceSessions'), {
        userId,
        transcript,
        summary,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error saving voice session:", error);
      throw error;
    }
  },

  async getSessions(userId: string): Promise<VoiceSession[]> {
    if (!userId) return [];
    try {
      const q = query(
        collection(db, 'voiceSessions'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      } as VoiceSession));
    } catch (error) {
      console.error("Error fetching voice sessions:", error);
      return [];
    }
  },

  async deleteSession(sessionId: string) {
    try {
      await deleteDoc(doc(db, 'voiceSessions', sessionId));
    } catch (error) {
      console.error("Error deleting voice session:", error);
      throw error;
    }
  }
};
