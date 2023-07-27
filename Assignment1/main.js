let URL = "./nzbird.json";

function response_callback(response) {
	if (response.status != 200) {
		return console.log('fail');
	}
	if (response.status == 200) {
		return response.text();
	}
}

function data_callback(data) {
	let birb_array = JSON.parse(data);
	for (x of birb_array) {
		createBirbCard(x)
	}
}

function loadAllBirbs() {
	//remove old main
	const old_main = document.querySelector("main");
	old_main.remove();
	//make new main
	let new_main = document.createElement("main");
	document.querySelector("#page-wrapper").appendChild(new_main);
	fetch(URL).then(response_callback).then(data_callback);
}

function createBirbCard(b) {
	let birb_card = document.createElement("article");
	birb_card.setAttribute("class", "birbcard");

	let imageAndName = document.createElement("div");
	imageAndName.setAttribute("class", "onImageText");

	let image = document.createElement("img");
	image.setAttribute("src", b.photo.source);

	let maori_name = document.createElement("h2");
	maori_name.setAttribute("class", "title");
	maori_name.textContent = b.primary_name;

	let photo_credit = document.createElement("p");
	photo_credit.setAttribute("class", "photoCredit");
	photo_credit.textContent = b.photo.credit;

	let content = document.createElement("div");
	content.setAttribute("class", "content");

	let english_name = document.createElement("h3");
	english_name.textContent = b.english_name;

	let description = document.createElement("p");
	description.textContent = b.scientific_name + " " + b.order + " " + b.family;

	imageAndName.appendChild(image);
	imageAndName.appendChild(maori_name);
	imageAndName.appendChild(photo_credit);

	content.appendChild(english_name);
	content.appendChild(description);

	birb_card.appendChild(imageAndName);
	birb_card.appendChild(content);

	let main = document.querySelector("main");
	main.appendChild(birb_card);
}

function filter_birb_callback(data) {
	let birb_array = JSON.parse(data);
	let filtered_array = [];

	let search_input = document.querySelector("#birb");
	const search = search_input.value;
	console.log(search);
	search_input = '';

	let cons_input = document.querySelector("#conservation");
	const conStatus = cons_input.value;
	cons_input = '';

	let sort_input = document.querySelector("#sort");
	const sort = sort_input.value;
	sort_input = '';

	//remove old main
	const old_main = document.querySelector("main");
	old_main.remove();
	//make new main
	let new_main = document.createElement("main");
	document.querySelector("#page-wrapper").appendChild(new_main);

	if (search != '') {
		for (x of birb_array) {
			if (x.primary_name.includes(search) || x.english_name.includes(search) || x.scientific_name.includes(search) || x.order.includes(search) || x.family.includes(search) || x.other_names.includes(search)) {
				filtered_array.push(x);
			}
		}
	}
	for (x of filtered_array) {
		createBirbCard(x);
	}

	let bannerClicker = document.querySelector("#banner");
	bannerClicker.addEventListener('click', loadAllBirbs);

}

function filterBirb(eventData) {
	//collection of data from form on page
	eventData.preventDefault();

	fetch(URL).then(response_callback).then(filter_birb_callback);
}

let filterButton = document.querySelector("#filterButton");
filterButton.addEventListener('click', filterBirb);
loadAllBirbs();






