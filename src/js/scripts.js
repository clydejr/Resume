// This file is intentionally blank
// Use this file to add JavaScript to your project

/**AI Chat Logic */
const chatSection = document.getElementById("chatSection");
  const chatTitle = document.getElementById("chatTitle");
  const chatSubtitle = document.getElementById("chatSubtitle");
  const welcomeMsg = document.getElementById("welcomeMsg");
  const chatInput = document.querySelector(".chat-input");
  const chatBtn = document.getElementById("chatMeBtn");
  const chatMessages = document.getElementById("chatMessages");

  let activeAssistant = "aws";
  let awsClient = null;
  let geminiClient = null;

  function clearChat() {
    chatMessages.innerHTML = "";
  }

  // Set theme, send button, and input placeholder
  function setAssistant(assistant) {
    activeAssistant = assistant;
    
  // ✅ clear first
    clearChat(); // clear messages on toggle

    if (assistant === "aws") {
      chatSection.classList.remove("gemini-theme");
      chatSection.classList.add("aws-theme");
      chatTitle.textContent = "AWS Assistant";
      chatSubtitle.textContent = "Powered by AWS Cloud Native";
      welcomeMsg.textContent = "👋 Welcome! Ask me about my AWS-powered projects.";
      chatSection.style.backgroundColor = "#f45907"
      
    // ✅ now add stock message AFTER clearing
    appendMessage("bot", "👋 Welcome! Ask me about my AWS-powered projects.");
      
      chatBtn.style.background = "linear-gradient(90deg, #252f3e, #ff9900)";
      chatInput.placeholder = "Ask me about AWS projects...";
    } else {
      chatSection.classList.remove("aws-theme");
      chatSection.classList.add("gemini-theme");
      chatTitle.textContent = "Gemini Assistant";
      chatSubtitle.textContent = "Powered by Google Gemini AI";
      welcomeMsg.textContent = "🌌 Hello! Ask me about my Gemini-powered projects.";
      
    // ✅ add Gemini stock message AFTER clearing
    appendMessage("bot", "🌌 Hello! Ask me about my Gemini-powered projects.");
      
      chatBtn.style.background = "linear-gradient(90deg, var(--google-blue), var(--google-red), var(--google-yellow), var(--google-green))";
      chatInput.placeholder = "Ask me about Gemini projects...";
    }
  }

  document.getElementById("awsBtn").addEventListener("click", () => setAssistant("aws"));
  document.getElementById("geminiBtn").addEventListener("click", () => setAssistant("gemini"));

chatBtn.addEventListener("click", async () => {
    const message = chatInput.value.trim();
    if (!message) return;
    chatInput.value = "";
    await sendMessage(message);
  });

  async function sendMessage(message) {
    appendMessage("user", message);
    
     // show typing indicator
    const typingDiv = document.createElement("div");
    typingDiv.classList.add("message", "bot-message");
    typingDiv.innerHTML = `<div class="typing-indicator"></div>`;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    let responseText = "";

    if (activeAssistant === "aws") {
      if (!awsClient) awsClient = await initAwsClient();
      responseText = await callAwsAPI(message, awsClient);
    } else {
      if (!geminiClient) geminiClient = await initGeminiClient();
      responseText = await callGeminiAPI(message, geminiClient);
    }

    // remove typing indicator
    typingDiv.remove();

    appendMessage("bot", responseText);
  }

  function appendMessage(sender, text) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message");

  if (sender === "user") {
    msgDiv.classList.add("user-message");
    // ✅ add theme-specific class for user too
    msgDiv.classList.add(activeAssistant === "aws" ? "aws-user" : "gemini-user");
  } else {
    msgDiv.classList.add("bot-message");
    msgDiv.classList.add(activeAssistant === "aws" ? "aws-bot" : "gemini-bot");
  }

  msgDiv.textContent = text;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

  chatBtn.addEventListener("click", () => {
    const message = chatInput.value.trim();
    if (!message) return;
    chatInput.value = "";
    sendMessage(message);
  });

  async function initAwsClient() {
    console.log("Initializing AWS client...");
    return {}; // replace with actual AWS client
  }

async function callAwsAPI(message, client) {
    try {
        const response = await fetch('https://i2flgq8kxe.execute-api.us-east-1.amazonaws.com/prod/chat', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ 
                question: message,
                timestamp: new Date().toISOString()
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Return the answer from your knowledge base
        return data.answer || data.response || 'I apologize, but I couldn\'t generate a response. Please try rephrasing your question.';
        
    } catch (error) {
        console.error('AWS API error:', error);
        return 'I\'m having trouble connecting right now. Please try again in a moment, or feel free to contact me directly!';
    }
}

// ----------------- Google Gemini -----------------

  async function initGeminiClient() {
    console.log("Initializing Gemini client...");
    return {}; // replace with actual Gemini client
  }

 async function callGeminiAPI(message, client) {
    try {
      const response = await client.chat({
        model: "gemini-1",
        input: message
      });
      return response.outputText || "No response from Gemini";
    } catch (err) {
      console.error(err);
      return "Error contacting Gemini API";
    }
  }

  // Typewriter animation variables
  let hasAnimated = false;
  let typewriterTimeout;

  // Typewriter animation function
  function typeWriter(element, text, speed = 50) {
    element.textContent = '';
    let i = 0;
    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        typewriterTimeout = setTimeout(type, speed);
      }
    }
    type();
  }

  // Intersection Observer for scroll-triggered animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        const currentText = welcomeMsg.textContent;
        typeWriter(welcomeMsg, currentText, 50);
      }
    });
  }, { threshold: 0.5 });

  // Start observing the chat section
  observer.observe(chatSection);

  // Initialize default theme
  setAssistant(activeAssistant);