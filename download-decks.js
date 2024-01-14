import { downloadAllAnkiDecks, downloadAnkiFile, deleteAnkiDeckAndFile } from "./firebaseDB.js";
import { landing } from "./landing.js";

export function downloadDecks() {
    const newBody = document.body.cloneNode(false);
    document.body.parentNode.replaceChild(newBody, document.body);
    const ankiDecksPage = `
        <div class="container text-center mt-3">
            <h1>
                <i id="refreshDecksIcon" class="bi bi-arrow-clockwise me-2"></i>
                Download Decks
            </h1>
            <button id="closeButton" class="btn-close position-fixed top-0 end-0 m-3" aria-label="Close"></button>
            <table class="table mt-4" id="ankiDecksTable">
                <thead>
                    <tr>
                        <th scope="col">Deck</th>
                        <th scope="col">Author</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Decks will be populated here -->
                </tbody>
            </table>
        </div>
    `;

    document.body.innerHTML = ankiDecksPage;

    document.getElementById('refreshDecksIcon').addEventListener('click', async () => {
        await redrawTable();
    });

    document.getElementById('closeButton').addEventListener('click', function() {
        landing();
    });

    async function redrawTable() {
        const table = $('#ankiDecksTable').DataTable();
        table.clear().destroy(); // Clear the existing table and destroy the DataTable object
        await populateAnkiDecksTable(); // Repopulate the table
    }

	async function populateAnkiDecksTable() {
		const tbody = document
			.getElementById("ankiDecksTable")
			.getElementsByTagName("tbody")[0];
		const decks = await downloadAllAnkiDecks();

		decks.forEach((deck) => {
			const row = tbody.insertRow();
			const deckCell = row.insertCell(0);
			const authorCell = row.insertCell(1);
			const deleteCell = row.insertCell(2);

            deckCell.innerHTML = `<a href="#" class="deck-download" data-id="${deck.id}" data-deck-name="${deck['Deck-Name']}">${deck["Deck-Name"]}</a>`;

			authorCell.textContent = deck.User;
			deleteCell.innerHTML = `<a href="#" class="deck-delete" data-id="${deck.id}"><i class="bi bi-trash"></i></a>`;
		});

		attachEventListeners();
		initializeDataTable();
	}

	populateAnkiDecksTable();

	function attachEventListeners() {
		// Attach download event listeners
        document.querySelectorAll(".deck-download").forEach((element) => {
            element.addEventListener("click", async (event) => {
                event.preventDefault();
                const anchorElement = event.target.closest('.deck-download');
                const uuid = anchorElement.getAttribute("data-id");
                const deckName = anchorElement.getAttribute("data-deck-name");
        
                try {
                    // Pass both UUID and deck name to the download function
                    await downloadAnkiFile(uuid, deckName);
                } catch (error) {
                    console.error("Error downloading Anki file:", error);
                }
            });
        });

		// Attach delete event listeners
        document.querySelectorAll(".deck-delete").forEach((element) => {
            element.addEventListener("click", async (event) => {
                event.preventDefault();
                const anchorElement = event.target.closest('.deck-delete');
                const uuid = anchorElement.getAttribute("data-id");
    
                if (
                    confirm(
                        "Are you sure you want to delete this deck? It will not be recoverable."
                    )
                ) {
                    try {
                        await deleteAnkiDeckAndFile(uuid);
                        // Redraw the table
                        redrawTable();
                    } catch (error) {
                        console.error("Error deleting deck:", error);
                    }
                }
            });
        });
	}

    async function redrawTable() {
        const table = $('#ankiDecksTable').DataTable();
        table.clear().destroy(); // Clear the existing table and destroy the DataTable object
        await populateAnkiDecksTable(); // Repopulate the table
    }

	function initializeDataTable() {
		$("#ankiDecksTable").DataTable({
			paging: false, // Disable pagination
			info: false, // Hide the information underneath the table
			scrollY: "200px", // Set the vertical scroll
			scrollCollapse: true,
			responsive: true, // Enable responsiveness
		});
	}
}
