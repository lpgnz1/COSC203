function myEventHandler(eventData) {
    // Keep this! Otherwise the <form> will reload the page
    eventData.preventDefault();

    let inputRef = document.querySelector("#message-text");
    let messageInput = inputRef.value;
    inputRef.value = "";                   // Clear the input field
    
    let messageP = document.createElement("p");   // Create a <p> element
    messageP.textContent = messageInput;          // Set the text content
    let messageDiv = document.createElement("div");  // Create a <div> element
    messageDiv.setAttribute("class", "message-self");  // Set the class attribute
    messageDiv.appendChild(messageP);  // Add the <p> element to the <div> element
    let chatContainer = document.querySelector("#chat-log-container"); // Get the chat log container
    chatContainer.appendChild(messageDiv);  // Add the <div> element to the chat log container

    let timeP = document.createElement("p");   // Create a <p> element
    timeP.setAttribute("class", "timestamp");  // Set the class attribute
    const d = new Date();
    timeP.textContent = d.getHours() + ":" + d.getMinutes(); // Set the text content
    messageDiv.appendChild(timeP);  // Add the <p> element to the <div> element

    setTimeout(recieveMessage, 1000);
}

let bot_messages = [];
bot_messages[0] = "How's Antarctica?";
bot_messages[1] = "Wanna get some sushi later? 🍣😋";
bot_messages[2] = "I 🐳 always be here for you.";  
bot_messages[3] = "Noot noot 🐧";
bot_messages[4] = "There's plenty of 🐟 in the 🌊 but I like you best ❤️";

function recieveMessage() {
    // Keep this! Otherwise the <form> will reload the page
    

    let messageP = document.createElement("p");   // Create a <p> element
    messageP.textContent = bot_messages[Math.floor((5*Math.random()))];          // Set the text content
    let messageDiv = document.createElement("div");  // Create a <div> element
    messageDiv.setAttribute("class", "message-other");  // Set the class attribute
    messageDiv.appendChild(messageP);  // Add the <p> element to the <div> element
    let chatContainer = document.querySelector("#chat-log-container"); // Get the chat log container
    chatContainer.appendChild(messageDiv);  // Add the <div> element to the chat log container

    let timeP = document.createElement("p");   // Create a <p> element
    timeP.setAttribute("class", "timestamp");  // Set the class attribute
    const d = new Date();
    timeP.textContent = d.getHours() + ":" + d.getMinutes(); // Set the text content
    messageDiv.appendChild(timeP);  // Add the <p> element to the <div> element
    
}

setInterval(recieveMessage, 5000);

let btnRef = document.querySelector("#message-button");

btnRef.addEventListener('click', myEventHandler);

