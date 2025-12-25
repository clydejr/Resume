// This file is intentionally blank
// Use this file to add JavaScript to your project


// Script for confetti animation
    const hireMeBtn = document.getElementById('hireMeBtn');
    const backdrop = document.getElementById('contactBackdrop');
    const modal = document.getElementById('contactModal');
    const closeBtn = document.getElementById('closeBtn');
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    // Show floating button on scroll
    let isVisible = false;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 25 && !isVisible) {
        hireMeBtn.classList.add('visible');
        isVisible = true;
      } else if (window.scrollY <= 25 && isVisible) {
        hireMeBtn.classList.remove('visible');
        isVisible = false;
      }
    });

    // Open modal
    function openModal() {
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      setTimeout(() => {
        document.getElementById('name').focus();
      }, 300);
    }

    // Close modal
    function closeModal() {
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
      hireMeBtn.focus();
    }

    // Event listeners
    hireMeBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);

    // Close on backdrop click
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal();
      }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop.classList.contains('active')) {
        closeModal();
      }
    });

    // Form validation
    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(inputId, errorId, message) {
      const input = document.getElementById(inputId);
      const error = document.getElementById(errorId);
      input.classList.add('error');
      error.textContent = message;
      error.classList.add('visible');
    }

    function clearError(inputId, errorId) {
      const input = document.getElementById(inputId);
      const error = document.getElementById(errorId);
      input.classList.remove('error');
      error.classList.remove('visible');
    }

    // Clear errors on input
    ['name', 'email', 'message'].forEach(field => {
      document.getElementById(field).addEventListener('input', () => {
        clearError(field, field + 'Error');
      });
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Clear previous errors
      ['name', 'email', 'message'].forEach(field => {
        clearError(field, field + 'Error');
      });

      // Validate
      let isValid = true;
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name) {
        showError('name', 'nameError', 'Please enter your name');
        isValid = false;
      }

      if (!email) {
        showError('email', 'emailError', 'Please enter your email');
        isValid = false;
      } else if (!validateEmail(email)) {
        showError('email', 'emailError', 'Please enter a valid email');
        isValid = false;
      }

      if (!message) {
        showError('message', 'messageError', 'Please enter a message');
        isValid = false;
      }

      if (!isValid) return;

      // Show loading
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      try {
        // Demo mode - simulates successful submission with 1.5s delay
        // Replace this with your actual API call when ready
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Success!
        submitBtn.textContent = 'Sent! ✓';
        submitBtn.style.background = '#00CC66';

        // Hide form and show success message
        setTimeout(() => {
          form.style.display = 'none';
          document.querySelector('.alternative-contact').style.display = 'none';
          document.getElementById('successMessage').classList.add('visible');
        }, 100);


        // 🎉 CONFETTI!
        const isMobile = window.innerWidth < 768;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        console.log('Confetti check:', {
          confettiAvailable: typeof confetti !== 'undefined',
          isMobile,
          prefersReducedMotion
        });

        if (!prefersReducedMotion && typeof confetti !== 'undefined') {
          confetti({
            particleCount: isMobile ? 80 : 150,
            spread: 440,
            origin: { y: 0.6 },
            colors: ['#8B3FFF', '#FF69B4', '#00D4FF'],
            ticks: 800,
            gravity: .2,
            scalar: 1.5
          });
          console.log('Confetti triggered!');
        } else {
          console.log('Confetti skipped:', prefersReducedMotion ? 'reduced motion' : 'library not loaded');
        }

        // Auto-close after 2 seconds
        setTimeout(() => {
          closeModal();
          form.reset();
          form.style.display = '';
          document.querySelector('.alternative-contact').style.display = '';
          document.getElementById('successMessage').classList.remove('visible');
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3500);

      } catch (error) {
        console.error('Error:', error);
        submitBtn.textContent = 'Failed. Try Again?';
        submitBtn.style.background = '#FF4444';
        
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 2000);
      }
    });

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

                // Initialize default theme
                setAssistant(activeAssistant);