import { landing } from "./landing.js";
import { uploadAnkiDeck } from "./firebaseDB.js";
import { showLoadingAnimation } from "./loadingAnimation.js";
import { downloadDecks } from "./download-decks.js";

export async function createDeckForm() {
	const newBody = document.body.cloneNode(false);
    document.body.parentNode.replaceChild(newBody, document.body);
	const createDeckPage = `
  <div class="container text-center mt-3">
    <h1>Create Deck</h1>
    <label for="deck" class="form-label mt-4">Input ChatGPT JSON</label>
    <textarea id="deck" class="form-control mx-auto" style="max-width: min(90vw, 1000px);" rows="20"></textarea>
    <div class="mt-4">
      <button id="cancelButton" class="btn btn-secondary me-2">Cancel</button>
      <button id="saveButton" class="btn btn-primary">Save</button>
    </div>
  </div>
`;

	document.body.innerHTML = createDeckPage;

	document.getElementById("cancelButton").addEventListener("click", landing);
	document.getElementById("saveButton").addEventListener("click", () => {
		const deckJson = document.getElementById("deck").value;
		sendDeckToAwsAndUpload(deckJson);
	});

	async function sendDeckToAwsAndUpload(deck) {
		try {
			showLoadingAnimation();
			// Step 1: Send the deck JSON to AWS API
			const response = await fetch(
				"https://j4our5myah.execute-api.us-east-2.amazonaws.com/generate-apkg",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: deck,
				}
			);

			if (!response.ok) {
				throw new Error(
					`AWS API responded with status: ${response.status}`
				);
			}

			// Step 2: Receive the .apkg file in the response
			const blob = await response.blob();
			const file = new File([blob], `${deck.deck_name}.apkg`, {
				type: "application/octet-stream",
			});

			// Step 3: Retrieve the user from local storage
			const user = localStorage.getItem("user");
			if (!user) {
				throw new Error("User not found in local storage");
			}

			// Step 4: Call uploadAnkiDeck function
			deck = JSON.parse(deck);
			await uploadAnkiDeck(deck.deck_name, user, file);
			downloadDecks();
		} catch (error) {
			console.error("Error in sending deck to AWS and uploading:", error);
			throw error;
		}
	}
}