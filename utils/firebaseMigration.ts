import db from './firebase';

export async function copyCollection(sourceCollection: string, targetCollection: string) {
    try {
        const sourceSnapshot = await db.collection(sourceCollection).get();

        if (sourceSnapshot.empty) {
            console.log(`Source collection "${sourceCollection}" is empty.`);
            return;
        }

        const batch = db.batch();

        sourceSnapshot.forEach(doc => {
            const targetDocRef = db.collection(targetCollection).doc(doc.id);
            batch.set(targetDocRef, doc.data());
        });

        await batch.commit();
        console.log(`Successfully copied all documents from "${sourceCollection}" to "${targetCollection}".`);
    } catch (error) {
        console.error('Error copying collection:', error);
    }
}
