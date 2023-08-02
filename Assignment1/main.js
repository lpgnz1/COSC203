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

function conservationSelector(status) {
	if (status == "Not Threatened") { return "#02a028"}
	if (status == "Naturally Uncommon") { return "#649a31"}
	if (status == "Relict") { return "#99cb68"}
	if (status == "Recovering") {return "#fecc33"}
	if (status == "Declining") {return "#fe9a01"}
	if (status == "Nationally Increasing") {return "#c26967"}
	if (status == "Nationally Vulnerable") {return "#9b0000"}
	if (status == "Nationally Endangered") {return "#660032"}
	if (status == "Nationally Critical") {return "#320033"}
	if (status == "Extinct") {return "black"}
	if (status == "Data Deficient") {return "black"}
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

	let scientific_name = document.createElement("p");
	scientific_name.setAttribute("class", "data");
	scientific_name.textContent = "Scientific Name: " + b.scientific_name;
	let order = document.createElement("p");
	order.setAttribute("class", "data");
	order.textContent = "Order: " + b.order;	
	let family = document.createElement("p");
	family.setAttribute("class", "data");
	family.textContent = "Family: " + b.family;
	let status = document.createElement("p");
	status.setAttribute("class", "data");
	status.textContent = "Conservation Status: " + b.status;
	// let length = document.createElement("p");
	// length.textContent = "Length: " + b.length[0] + " " + b.length[1];
	// let weight = document.createElement("p");
	// weight.textContent = "Weight: " + b.weight[0] + " " + b.weight[1];

	birb_card.style.outlineColor = conservationSelector(b.status);

	imageAndName.appendChild(image);
	imageAndName.appendChild(maori_name);
	imageAndName.appendChild(photo_credit);

	content.appendChild(english_name);
	content.appendChild(scientific_name);
	content.appendChild(order);
	content.appendChild(family);
	content.appendChild(status);
	// content.appendChild(length);
	// content.appendChild(weight);

	birb_card.appendChild(imageAndName);
	birb_card.appendChild(content);

	let main = document.querySelector("main");
	main.appendChild(birb_card);
}


function filterBirb(eventData) {
	//collection of data from form on page
	eventData.preventDefault();

	fetch(URL).then(response_callback).then(filter_birb_callback);
}

function filter_birb_callback(data) {
	let birb_array = JSON.parse(data);
	let search_filtered_array = [];

	// retrieves input from form
	let search_input = document.querySelector("#birb");
	const search = search_input.value;
	search_input = '';

	let cons_input = document.querySelector("#conservation");
	const conStatus = cons_input.options[cons_input.selectedIndex].text;
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

	//filters by search terms
	if (search != '') {
		for (x of birb_array) {
			if (x.primary_name.includes(search) || x.english_name.includes(search) || x.scientific_name.includes(search) || x.order.includes(search) || x.family.includes(search) || x.other_names.includes(search)) {
				search_filtered_array.push(x);
			}
		}
	} else { search_filtered_array = birb_array; }

	// filters by conservation status, after filtering by search terms
	let filtered_array = [];
	if (conStatus != "All") {
		for (x of search_filtered_array) {
			if (x.status == conStatus) {
				filtered_array.push(x);
			}
		}
	} else { filtered_array = search_filtered_array; }


	//when user searchs with blank search bar and default 'all' conservation status and default 'primary name' sort
	if (filtered_array.length == 0) {
		alert("No results found, or no search terms entered.");
		loadAllBirbs();
	}

	//if all search terms are filled in 
	for (x of filtered_array) {
		createBirbCard(x);
	}

	let bannerClicker = document.querySelector("#banner");
	bannerClicker.addEventListener('click', loadAllBirbs);
	
}

let filterButton = document.querySelector("#filterButton");
filterButton.addEventListener('click', filterBirb);
loadAllBirbs();






