import { onSnapshot, doc } from 'firebase/firestore';

// Your Firebase setup (replace with your actual setup)
import { firestore  } from './database';

/**
 * Get real-time updates for a Firestore document.
 * @param {string} collectionName - Name of the collection.
 * @param {string} documentId - ID of the document.
 * @returns {Promise} - Resolves with updated data whenever the document changes.
 */
function getFirestoreDocumentUpdates(collectionName, documentId) {
  const docRef = doc(firestore , collectionName, documentId);

  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        // Resolve the promise with the latest data from Firestore
        resolve(doc.data());
      } else {
        // Reject the promise if the document doesn't exist
        reject(new Error('Document does not exist'));
      }
    });

    // Attach the unsubscribe function to the promise
    resolve.unsubscribe = unsubscribe;
  });
}

export default getFirestoreDocumentUpdates;
