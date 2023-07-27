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

fetch(URL).then(response_callback).then(data_callback);


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







