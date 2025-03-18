class ChatHistory {
    constructor() {
        this.messages = [];
    }

    addMessage(message, sender) {
        const timestamp = new Date().toLocaleString();
        this.messages.push({ message, sender, timestamp });
    }

    getHistory() {
        return this.messages;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const historyMessages = new ChatHistory();

    // Fonction pour afficher un message dans la boîte de chat
    function showMessage(messageObj, isFromHistory = false) {
        var chatBox = document.getElementById('chat-box');
        var messageElement = document.createElement('div');

        if (isFromHistory) {
            var historySeparator = document.createElement('div');
            historySeparator.textContent = '--- Message chargé depuis l\'historique ---';
            historySeparator.style.textAlign = 'center';
            historySeparator.style.color = '#999';
            historySeparator.style.margin = '10px 0';
            chatBox.appendChild(historySeparator);
        }

        var messageText = document.createElement('div');
        messageText.textContent = messageObj.message;
        messageText.style.color = 'red';
        messageText.style.border = '1px solid #ccc';
        messageText.style.padding = '5px';
        messageText.style.margin = '5px 0';
        messageText.style.borderRadius = '5px';

        var messageTime = document.createElement('div');
        messageTime.textContent = messageObj.timestamp;
        messageTime.style.fontSize = '0.8em';
        messageTime.style.color = '#888';

        if (messageObj.sender === 'user') {
            messageText.style.backgroundColor = '#f1f1f1';
            messageText.style.alignSelf = 'flex-end';
        } else if (messageObj.sender === 'bot') {
            messageText.style.backgroundColor = '#e0f7fa';
            messageText.style.alignSelf = 'flex-start';
        }

        messageElement.appendChild(messageText);
        messageElement.appendChild(messageTime);
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Fonction pour traiter le message de l'utilisateur
    function processMessage(intents, message) {
        let response = "Je suis désolé, je ne suis pas sûr de comprendre.";

        if (Array.isArray(intents)) {
            intents.forEach(intent => {
                intent.patterns.forEach(pattern => {
                    if (message.toLowerCase().includes(pattern.toLowerCase())) {
                        response = intent.responses[Math.floor(Math.random() * intent.responses.length)];
                    }
                });
            });
        } else {
            console.error('intents is not an array:', intents);
        }

        return response;
    }

    // Fonction pour envoyer un message
    function sendMessage(intents) {
        var userInput = document.getElementById('user-input').value;
        var userMessage = { message: userInput, sender: 'user', timestamp: new Date().toLocaleString() };

        showMessage(userMessage);
        historyMessages.addMessage(userMessage.message, userMessage.sender);

        var botResponseMessage = processMessage(intents, userInput);
        var botMessage = { message: botResponseMessage, sender: 'bot', timestamp: new Date().toLocaleString() };

        showMessage(botMessage);
        historyMessages.addMessage(botMessage.message, botMessage.sender);

        document.getElementById('user-input').value = '';
    }

    function fetchJSON(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.intents) {
                    sendMessage(data.intents);
                } else {
                    console.error('The JSON structure is incorrect:', data);
                }
            })
            .catch(error => console.error('Error fetching JSON:', error));
    }

    document.getElementById('send-button').addEventListener('click', function() {
        fetchJSON('../json/intents.json');
    });

    // Fonction pour sauvegarder les messages dans la session navigateur
    function saveMessages() {
        console.log('Saving chat history...');  
        sessionStorage.setItem('chatHistory', JSON.stringify(historyMessages.getHistory()));
    }

    // Fonction pour charger les messages de la session navigateur
    function loadMessages() {
        const chatHistory = JSON.parse(sessionStorage.getItem('chatHistory'));
        if (chatHistory) {
            chatHistory.forEach(message => {
                showMessage(message, true);
            });
        }
    }

    // Charger les messages au chargement de la page
    loadMessages();

    // Sauvegarder les messages avant de quitter la page
    window.addEventListener('beforeunload', saveMessages);
});