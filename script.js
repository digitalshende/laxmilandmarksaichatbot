// ─── Google Sheet API URL (इथे तुमची URL टाका) ───
const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbynJECs_N4wgksb2SpQGiYh3hf5E8gIKmYVP6hCSB6gke2ZWNb-YGlICxbg4pVkSysUIw/exec";

// Session ID
if (!sessionStorage.getItem('sessionId')) {
    sessionStorage.setItem('sessionId', 'user_' + Date.now());
}

const chatBox = document.getElementById("chat-box");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// ─── Quick Buttons ───
document.querySelectorAll(".quick-buttons button").forEach(button => {
    button.addEventListener("click", () => sendMessage(button.innerText));
});

sendBtn.addEventListener("click", () => sendMessage(input.value));
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage(input.value);
});

// ─── Send Message ───
function sendMessage(message) {
    if (message.trim() === "") return;
    addUserMessage(message);
    input.value = "";
    showTyping();

    setTimeout(() => {
        removeTyping();
        const reply = botReply(message);
        sendToSheet(message, reply);
    }, 1500);
}

// ─── User Message ───
function addUserMessage(text) {
    chatBox.innerHTML += `
        <div class="message user">
            <div class="bubble">${text}</div>
        </div>
    `;
    scrollBottom();
}

// ─── Bot Reply ───
function botReply(msg) {
    const lower = msg.toLowerCase();
    let answer = "";
    if (lower.includes("1 bhk") || lower.includes("१")) {
        answer = "🏠 1 BHK फ्लॅट उपलब्ध आहेत.";
    } else if (lower.includes("2 bhk") || lower.includes("२")) {
        answer = "🏢 2 BHK प्रीमियम फ्लॅट उपलब्ध आहेत.";
    } else if (lower.includes("किंमत") || lower.includes("price")) {
        answer = "💰 कृपया मोबाईल नंबर द्या. Sales Team किंमत सांगेल.";
    } else if (lower.includes("स्थान") || lower.includes("location")) {
        answer = "📍 लक्ष्मी अंगण, शिरवळ.";
    } else if (lower.includes("ब्रोशर") || lower.includes("brochure")) {
        answer = "📄 ब्रोशरसाठी 8237371724 वर WhatsApp करा.";
    } else if (lower.includes("साइट") || lower.includes("visit")) {
        answer = "📅 Site Visit साठी नाव व मोबाईल पाठवा.";
    } else if (lower.includes("कॉल") || lower.includes("call")) {
        answer = "📞 8237371724";
    } else if (lower.includes("कर्ज") || lower.includes("loan")) {
        answer = "🏦 Home Loan सुविधा उपलब्ध.";
    } else {
        answer = "🤖 धन्यवाद. तुमचा प्रश्न AI कडे पाठवला.";
    }

    chatBox.innerHTML += `
        <div class="message">
            <img src="https://cdn-icons-png.flaticon.com/512/8350/8350373.png" alt="Bot">
            <div class="bubble">${answer}</div>
        </div>
    `;
    scrollBottom();
    return answer;
}

// ─── Typing ───
function showTyping() {
    chatBox.innerHTML += `
        <div class="message" id="typing">
            <img src="https://cdn-icons-png.flaticon.com/512/8350/8350373.png" alt="Bot">
            <div class="bubble"><span>.</span><span>.</span><span>.</span></div>
        </div>
    `;
    scrollBottom();
}
function removeTyping() {
    const el = document.getElementById("typing");
    if (el) el.remove();
}

function scrollBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}

// ─── Google Sheet वर डेटा पाठवा ───
function sendToSheet(userMsg, botReply) {
    const payload = {
        userMessage: userMsg,
        botReply: botReply,
        sessionId: sessionStorage.getItem('sessionId')
    };

    console.log("Sending to Sheet:", payload);

    fetch(SHEET_API_URL, {
        method: 'POST',
        mode: 'no-cors',  // 'cors' ऐवजी 'no-cors' वापरा
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(() => {
        // mode: 'no-cors' मुळे response मिळत नाही, पण request पाठवली जाते
        console.log('Request sent (no-cors mode)');
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}