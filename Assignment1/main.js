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

//called when coloring in the outline of the bird card based on conservation status
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

//creates a bird card for each bird in given array
function createBirbCard(b) {
	let birb_card = document.createElement("article");
	birb_card.setAttribute("class", "birbcard");

	//creates image and name element
	let imageAndName = document.createElement("div");
	imageAndName.setAttribute("class", "onImageText");

	//creates image, title and photo credit elements
	let image = document.createElement("img");
	image.setAttribute("src", b.photo.source);

	let maori_name = document.createElement("h2");
	maori_name.setAttribute("class", "title");
	maori_name.textContent = b.primary_name;

	let photo_credit = document.createElement("p");
	photo_credit.setAttribute("class", "photoCredit");
	photo_credit.textContent = b.photo.credit;

	//creates content element
	let content = document.createElement("div");
	content.setAttribute("class", "content");

	//creates h3 element for english name
	let english_name = document.createElement("h3");
	english_name.textContent = b.english_name;

	//creates a p element for each piece of data
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
	let length = document.createElement("p");
	length.textContent = "Length: " + b.size.length.value + " " + b.size.length.units;
	let weight = document.createElement("p");
	weight.textContent = "Weight: " + b.size.weight.value + " " + b.size.weight.units;

	//colors in the outline of the bird card based on conservation status
	birb_card.style.outlineColor = conservationSelector(b.status);

	//appends all elements to their parents
	imageAndName.appendChild(image);
	imageAndName.appendChild(maori_name);
	imageAndName.appendChild(photo_credit);

	content.appendChild(english_name);
	content.appendChild(scientific_name);
	content.appendChild(order);
	content.appendChild(family);
	content.appendChild(status);
	content.appendChild(length);
	content.appendChild(weight);

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
	const sort = sort_input.options[sort_input.selectedIndex].text;
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

	//sorts by sort type, after filtering by search terms and conservation status
	let sorted_array = sortBirbData(filtered_array, sort);

	//when user searchs with blank search bar and default 'all' conservation status and default 'primary name' sort
	if (sorted_array.length == 0) {
		alert("No results found, or no search terms entered.");
		loadAllBirbs();
	}

	//if all search terms are filled in 
	for (x of sorted_array) {
		createBirbCard(x);
	}

	//adds event listener to banner to load all birds
	let bannerClicker = document.querySelector("#banner");
	bannerClicker.addEventListener('click', loadAllBirbs);

	//clears search box and resets conservation status and sort type to default
	document.getElementById("birb").value = '';
	document.getElementById("conservation").value = 'All';
	document.getElementById("sort").value = 'Primary Name';

	
}

function sortBirbData(birbData, sortType){
	if (sortType == ''){
		return birbData;
	}
	// Sort the birdData array based on the sortType
	return birbData.sort((birb1, birb2) => {
		if (sortType === "Primary Name") {
			return birb1.primary_name.localeCompare(birb2.primary_name);
		} 
		else if (sortType === "English_name") {
			return birb1.english_name.localeCompare(birb2.english_name);
		}
		else if (sortType === "Scientific Name") {
			return birb1.scientific_name.localeCompare(birb2.scientific_name);
		}
		else if (sortType === "Order") {
			return birb1.order.localeCompare(birb2.order);
		}
		else if (sortType === "Family") {
			return birb1.family.localeCompare(birb2.family);
		}
		else if (sortType === "Length") {
			return birb1.size.length.value - birb2.size.length.value;
		}
		else if (sortType === "Weight") {
			return birb1.size.weight.value - birb2.size.weight.value;
		}
		else { console.log('fail');}
	});
	
}

//adds event listener to filter button and loads all birds on page load
let filterButton = document.querySelector("#filterButton");
filterButton.addEventListener('click', filterBirb);
loadAllBirbs();






