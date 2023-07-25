let birb_data;

async function fetchData() {
	const response = await fetch('nzbird.json');
	if (!response.ok){
		console.error(response.status); // error handling
	}
	const data = await response.json();  // parse to JSON
	birb_data = data;
}

function createBirbCard(b) {
	let birb_card = document.createElement("article");
	birb_card.setAttribute("class", "birbcard");

	let image = document.createElement("img");
	image.setAttribute("src", b["photo"]["source"]);

	let maori_name = document.createElement("h3");
	maori_name.textContent = b["primary_name"];

	let english_name = document.createElement("h2");
	english_name.textContent = b["english_name"];

	let description = document.createElement("p");
	description.textContent = b["description"];

	birb_card.appendChild(image);
	birb_card.appendChild(maori_name);
	birb_card.appendChild(english_name);
	birb_card.appendChild(description);

	let main = document.querySelector("#main");
	main.appendChild(birb_card);
}

function createBirbCards() {
	for (b in birb_data) {
		createBirbCard(birb_data[b]);
	}
}

fetchData();  // call the async function to populate birb_data
createBirbCards();
createBirbCards();




