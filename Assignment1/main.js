async function fetchData() {
	const response = await fetch("./data/nzbird.json");
	if (!response.ok){
		console.error(response.status); // error handling
	}
	const data = response.json()  // parse to JSON
	console.log(data); // use the data
}

fetchData();