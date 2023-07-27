let URL = "https://cosc203.cspages.otago.ac.nz/labs/files/emoji.json";

function response_callback(response) {
    if (response.status != 200) {
        return console.log('fail');
    }
    if (response.status == 200) {
        return response.text();
    }
}

function data_callback(data) {
    let emoji_array = JSON.parse(data);
    for (x of emoji_array) {
        console.log(x.emoji);
    }
}

fetch(URL).then(response_callback).then(data_callback);