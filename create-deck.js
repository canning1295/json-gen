import { landing } from "./landing.js";
import { uploadAnkiDeck, getTextFromAnkiSettings, writeToAnkiSettings } from "./firebaseDB.js";
import { showLoadingAnimation } from "./loadingAnimation.js";
import { downloadDecks } from "./download-decks.js";
import { instructions } from "./instructions.js";
import { options } from "./options.js";

export async function createDeckForm() {
	let key = localStorage.getItem("apiKey");
	if (!key) {console.log('no key');options(); return;}
    const newBody = document.body.cloneNode(false);
    document.body.parentNode.replaceChild(newBody, document.body);
    const createDeckPage = `
    <div class="container text-center mt-3">
        <h1>Create Deck <i id="instructionsIcon" class="bi bi-info-circle-fill" data-bs-toggle="modal" data-bs-target="#instructionsModal"></i></h1>
        <label for="deckInput" class="form-label mt-4">Input Your Prompt</label>
        <textarea id="deckInput" class="form-control mx-auto" style="max-width: min(90vw, 1000px);" rows="20"></textarea>
        <div class="mt-4">
            <button id="cancelButton" class="btn btn-secondary me-2">Cancel</button>
            <button id="generateButton" class="btn btn-primary">Generate</button>
        </div>
        <!-- Modal Structure -->
        <div class="modal fade" id="instructionsModal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
            <div class="modal-dialog modal-fullscreen">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalLabel">Instructions</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <textarea id="instructionsText" class="form-control" rows="25"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button id="saveInstructions" class="btn btn-primary">Save</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.innerHTML = createDeckPage;

    // Add event listeners
    document.getElementById("cancelButton").addEventListener("click", landing);
	document.getElementById("saveInstructions").addEventListener("click", async function(event) {
		event.stopPropagation(); // Prevents triggering of parent event listeners
	
		const text = document.getElementById("instructionsText").value;
		await writeToAnkiSettings(text);
		document.querySelector('#instructionsModal .btn-close').click();
	});

    // Fetch and populate instructions text
    getTextFromAnkiSettings().then(text => {
        if (text !== null) {
            document.getElementById("instructionsText").value = text;
        }
    });

    document.getElementById("generateButton").addEventListener("click", async () => {
        showLoadingAnimation();
        const prompt = instructions + document.getElementById("deckInput").value;
        const deckJson = await sendPromptToChatGPT(prompt);
        sendDeckToAwsAndUpload(JSON.stringify(deckJson));
    });

	async function sendPromptToChatGPT(prompt) {
		const apiKey = key;
		const url = 'https://api.openai.com/v1/chat/completions';
	
		const headers = {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${apiKey}`
		};
	
		const body = JSON.stringify({
			model: "gpt-4-1106-preview",
			messages: [
				{
					role: "user",
					content: prompt
				}
			],
			max_tokens: 4096
		});
	
		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: headers,
				body: body
			});
	
			let data = await response.json();
			console.log('response from ChatGPT:', data);
			data = JSON.parse(data.choices[0].message.content)
			console.log('data:', data)
			return data;
		} catch (error) {
			console.error('Error:', error);
		}
	}

	async function sendDeckToAwsAndUpload(deck) {
		try {
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
			const file = new File([blob], `${JSON.parse(deck).deck_name}.apkg`, {
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