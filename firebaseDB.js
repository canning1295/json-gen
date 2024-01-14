import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, doc, getDocs, setDoc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { getStorage, ref, deleteObject,uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";

const firebaseConfig = {
	apiKey: "AIzaSyAtx3-nsdgICRBjigpMDJFjvb8miZjDBHY",
	authDomain: "flashy-v1.firebaseapp.com",
	projectId: "flashy-v1",
	storageBucket: "flashy-v1.appspot.com",
	messagingSenderId: "777420221615",
	appId: "1:777420221615:web:c5345b22bfce7a494b385a",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export async function uploadAnkiDeck(deckName, user, file) {
    const uuid = self.crypto.randomUUID();

    const deckData = {
        "Deck-Name": deckName,
        User: user,
    };

    await setDoc(doc(db, "Anki-Decks", uuid), deckData);

    // Save file to Firebase Storage
    const fileRef = ref(storage, `anki_files/${uuid}`);
    await uploadBytes(fileRef, file);
    const fileUrl = await getDownloadURL(fileRef);
    await setDoc(doc(db, "Anki-Files", uuid), { File: fileUrl });

    console.log("Deck and file uploaded successfully");
}

export async function downloadAnkiFile(uuid, deckName) {
    try {
        const fileRef = ref(storage, `anki_files/${uuid}`);
        const fileUrl = await getDownloadURL(fileRef);

        // Fetch the file
        const response = await fetch(fileUrl);
        const blob = await response.blob();

        // Create a URL for the blob
        const blobUrl = URL.createObjectURL(blob);

        // Use the deck name for the file download, ensuring it has a .apkg extension
        const fileName = `${deckName.replace(/\s+/g, '_')}.apkg`;

        // Triggering the download
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (error) {
        console.error("Error downloading Anki file:", error);
        throw error;
    }
};

export async function downloadAllAnkiDecks() {
    try {
        const querySnapshot = await getDocs(collection(db, "Anki-Decks"));
        const decks = [];

        querySnapshot.forEach((docSnapshot) => {
            decks.push({ id: docSnapshot.id, ...docSnapshot.data() });
        });

        return decks;
    } catch (error) {
        console.error("Error fetching Anki-Decks:", error);
        throw error;
    }
}

export async function deleteAnkiDeckAndFile(uuid) {
    try {
        // Delete the deck document from Firestore
        await deleteDoc(doc(db, "Anki-Decks", uuid));

        // Delete the associated file from Firebase Storage
        const fileRef = ref(storage, `anki_files/${uuid}`);
        await deleteObject(fileRef);

        console.log("Anki deck and file deleted successfully for UUID:", uuid);
    } catch (error) {
        console.error("Error deleting Anki deck and file:", error);
        throw error; // or handle it as needed
    }
}

export async function updateDeckName(uuid, newDeckName) {
    try {
        await updateDoc(doc(db, "Anki-Decks", uuid), {
            "Deck-Name": newDeckName,
        });

        console.log(`Deck name updated to '${newDeckName}' for UUID: ${uuid}`);
    } catch (error) {
        console.error("Error updating deck name:", error);
        throw error;
    }
}

