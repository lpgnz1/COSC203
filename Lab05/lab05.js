const API_URL = 'http://oucs1555.staff.uod.otago.ac.nz:8080'
// const API_URL = 'http://localhost:8080'

// global variable for user name
let userName = ""
let latest_message_time = 0;
/* this function reloads ALL messages from the server */
function loadAllMessages() {
    /* TASK 3 */
    time = new Date().getTime();
    /* 1: fetch messages.json */
    let URL = "http://localhost:8080/messages.json";

    function response_callback(response) {
        if (response.status != 200) {
            return;
        }
        if (response.status == 200) {
            return response.text();
        }
    }

    function data_callback(data) {
        let messages_array = JSON.parse(data);

        for (x of messages_array) {
            if (userName == x.name) {
                new ChatMessage(x.name, x.message, x.time, "message-self");
            } else {
                new ChatMessage(x.name, x.message, x.time, "message-other");
            }
        }
        return;
    }

    let e = document.getElementById("#chat-log-container");
    e.innerHTML ='';

    function get_latest_message(data) {
        let messages_array = JSON.parse(data);
        let latest_message = messages_array[messages_array.length - 1];
        if(latest_message.time > latest_message_time){
            latest_message_time = latest_message.time;
            loadAllMessages();
        }
    }

    

    fetch(URL).then(response_callback).then(data_callback);
    /* 2: clear chat-log-container */

    /* 3: for each message in array */
    /* create each message element */

    setTimeout((fetch(URL).then(response_callback).then(get_latest_message)), 500);
}

/* this function sends a new message to the server */
function submitNewMessage() {
    /* get input form data */
    const msgInput = document.querySelector('#message-text');
    const message = msgInput.value;
    msgInput.value = ""; // clear the input form

    /* create local message element on the page */
    let time = new Date().getTime();
    new ChatMessage(userName, message, time, "message-self")

    /* TASK 4: POST messageData to the server */
    const data_to_post = {
        "name": userName,
        "message": message,
        "time": time
    };

    const string_to_send = JSON.stringify(data_to_post);

    const options = {
        method: 'POST',
        body: string_to_send, // stringify the data before sending!
        headers: { 'Content-Type': 'application/json' }
    }

    let URL = "http://localhost:8080/send-message";

    function post_response_callback(response) {
        if (response.status == 201) {
            return response.text();
        }
        if (response.status == 400) {
            return;
        }
        return;
    }

    function post_data_callback(data) {
        loadAllMessages();
        return;
    }

    fetch(URL, options).then( post_response_callback ).then( post_data_callback );
}
/* form submission event handler */
function clickHandler(event) {
    event.preventDefault();
    submitNewMessage();
}
document.querySelector("#message-button").addEventListener('click', clickHandler);

loadAllMessages();