let dataset = []; 
let fuse;  

fetch('/Chatbot/dataset.json')
  .then(response => response.json())
  .then(data => {
    dataset = data;  
    console.log('Dataset loaded:', dataset);

    
    fuse = new Fuse(dataset, {
      keys: ['question'],  
      includeScore: true,   
      threshold: 0.3    
    });
  })
  .catch(error => console.error('Error loading dataset:', error));

const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyD13ZaLZJNIbZJ9mlFWY1iLI1cEB3BVxuc";

// Function to display messages in the chat box
function displayMessage(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const newMessage = document.createElement('div');
    newMessage.className = sender;
    newMessage.textContent = `${sender}: ${message}`;
    chatBox.appendChild(newMessage);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the latest message
}

// Function to call Gemini API
async function getGeminiResponse(query) {
    let RequestOption = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "contents": [{ "parts": [{ "text": query }] }]
        })
    };

    try {
        let response = await fetch(Api_Url, RequestOption);
        let data = await response.json();
        let apiResponse = data.candidates[0].content.parts[0].text.trim();
        return apiResponse;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "Sorry, I couldn't find an answer for you right now.";
    }
}

// Handle user input
function handleUserInput() {
    const userInput = document.getElementById('user-input');
    const userMessage = userInput.value.trim().toLowerCase();
    if (userMessage) {
        displayMessage("User", userMessage);

        if (!fuse) {
            displayMessage("Bot", "Sorry, I'm still loading the data. Please try again in a moment.");
            return;
        }

        const results = fuse.search(userMessage);

        if (results.length > 0) {
           
            const bestMatch = results[0].item;
            displayMessage("Bot", bestMatch.answer);
        } else {
            displayMessage("Bot", "Sorry, I didn't find any relevant answers in the dataset. Let me search online.");
            getGeminiResponse(userMessage).then(apiAnswer => {
                displayMessage("Bot", apiAnswer);
            });
        }

        userInput.value = ""; 
    }
}

function toggleChat() {
    const chatContainer = document.getElementById('chat-container');
    chatContainer.classList.toggle('show');
}


document.getElementById('user-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        handleUserInput();
    }
});

document.getElementById('submit').addEventListener('click', function() {
    handleUserInput();
});

window.onload = () => {
    displayMessage("Bot", "Hello! How can I assist you today?");
};
