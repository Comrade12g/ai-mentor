import { db } from './firebase';
import { doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { UserProfile } from '../types';

export const UserService = {
  /**
   * Creates or overwrites a user profile in Firestore.
   */
  async createUser(profile: UserProfile) {
    try {
      await setDoc(doc(db, 'users', profile.uid), profile, { merge: true });
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  },

  /**
   * Marks a specific lesson topic as completed for the given user.
   */
  async markLessonComplete(uid: string, topic: string) {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        completedLessons: arrayUnion(topic)
      });
    } catch (error) {
      console.error("Error updating lesson progress:", error);
      throw error;
    }
  }
};
