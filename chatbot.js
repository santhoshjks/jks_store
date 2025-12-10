// Customer Support Chatbot JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const chatbotBubble = document.getElementById('chatbotBubble');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');
    const quickButtons = document.querySelectorAll('.quick-btn');

    // Toggle chatbot window
    chatbotBubble.addEventListener('click', function() {
        chatbotWindow.classList.toggle('active');
        if (chatbotWindow.classList.contains('active')) {
            chatInput.focus();
        }
    });

    // Close chatbot window
    chatbotClose.addEventListener('click', function() {
        chatbotWindow.classList.remove('active');
    });

    // Send message function
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message === '') return;

        // Add user message
        addMessage(message, 'user');
        chatInput.value = '';

        // Show typing indicator
        showTypingIndicator();

        // Simulate bot response
        setTimeout(() => {
            removeTypingIndicator();
            const botResponse = generateBotResponse(message);
            addMessage(botResponse, 'bot');
        }, 1000 + Math.random() * 1000);
    }

    // Add message to chat
    function addMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `${sender}-message`;
        
        const icon = document.createElement('i');
        icon.className = sender === 'bot' ? 'fas fa-robot' : 'fas fa-user';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const paragraph = document.createElement('p');
        paragraph.textContent = message;
        
        messageContent.appendChild(paragraph);
        messageDiv.appendChild(icon);
        messageDiv.appendChild(messageContent);
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'bot-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        
        const icon = document.createElement('i');
        icon.className = 'fas fa-robot';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const dots = document.createElement('div');
        dots.className = 'typing-dots';
        dots.innerHTML = '<span>.</span><span>.</span><span>.</span>';
        
        messageContent.appendChild(dots);
        typingDiv.appendChild(icon);
        typingDiv.appendChild(messageContent);
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Generate bot response
    function generateBotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Store hours response
        if (message.includes('hours') || message.includes('open') || message.includes('close')) {
            return "Our store is open Monday to Saturday from 10:00 AM to 8:00 PM. We're closed on Sundays. You can also shop online 24/7!";
        }
        
        // Delivery response
        if (message.includes('delivery') || message.includes('shipping') || message.includes('home delivery')) {
            return "Yes! We offer free home delivery for orders above ₹999. Standard delivery takes 3-5 business days. Express delivery is available for an additional fee.";
        }
        
        // Return policy response
        if (message.includes('return') || message.includes('refund') || message.includes('exchange')) {
            return "We offer a 7-day return policy for most products. Items must be in original condition with packaging. Please bring your receipt for any returns or exchanges.";
        }
        
        // Contact agent response
        if (message.includes('agent') || message.includes('human') || message.includes('support')) {
            return "I'm connecting you with a human agent. Please wait a moment or call us directly at +91 8686757575 for immediate assistance.";
        }
        
        // Product related
        if (message.includes('mobile') || message.includes('phone')) {
            return "We have a wide range of mobile phones from top brands like Apple, Samsung, and more. Would you like to see our mobile collection?";
        }
        
        if (message.includes('laptop')) {
            return "Our laptop collection includes gaming laptops, business laptops, and budget-friendly options.";
        }
        
        if (message.includes('tv') || message.includes('television')) {
            return "We offer smart TVs from Samsung, LG, Sony, and more. Screen sizes range from 32\" to 75\" with prices starting from ₹15,999.";
        }
        
        if (message.includes('accessories')) {
            return "Our accessories section includes headphones, chargers, cables, and more. We have both original and third-party accessories to fit your budget.";
        }
        
        // Payment related
        if (message.includes('payment') || message.includes('pay') || message.includes('cash')) {
            return "We accept cash, UPI, net banking. All major payment methods are available for your convenience.";
        }
        
        // Location/Address
        if (message.includes('location') || message.includes('address') || message.includes('where')) {
            return "We're located at JKS Company Pvt. Ltd, 3/15 Pillaiyar Kovil Street, Anna Nagar, Chennai-600028, Tamil Nadu. We're near the Anna Nagar bus stand!";
        }
        
        // Greetings
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return "Hello! Welcome to JKS Store. How can I help you find the perfect electronics today?";
        }
        
        if (message.includes('thank') || message.includes('thanks')) {
            return "You're welcome! Is there anything else I can help you with?";
        }
        
        if (message.includes('bye') || message.includes('goodbye')) {
            return "Thank you for visiting JKS Store! Have a wonderful day and feel free to come back if you need any assistance.";
        }
        if (message.includes('cancel')) {
            return "For any changes or cancellations, please contact us via email.";
        }
        
        // Default response
        return "I understand you're asking about: " + userMessage + ". Let me help you with that! You can ask me about our products, store hours, delivery, returns, cancellation or contact information. For specific product inquiries, I'd be happy to assist you find what you're looking for.";
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Quick action buttons
    quickButtons.forEach(button => {
        button.addEventListener('click', function() {
            const message = this.getAttribute('data-message');
            chatInput.value = message;
            sendMessage();
        });
    });

    // Add typing dots animation
    const style = document.createElement('style');
    style.textContent = `
        .typing-dots span {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: var(--primary-color);
            margin: 0 2px;
            animation: typing 1.4s infinite;
        }
        
        .typing-dots span:nth-child(2) {
            animation-delay: 0.2s;
        }
        
        .typing-dots span:nth-child(3) {
            animation-delay: 0.4s;
        }
        
        @keyframes typing {
            0%, 60%, 100% {
                transform: translateY(0);
            }
            30% {
                transform: translateY(-10px);
            }
        }
    `;
    document.head.appendChild(style);

    // Close chat when clicking outside
    document.addEventListener('click', function(e) {
        if (!chatbotWindow.contains(e.target) && !chatbotBubble.contains(e.target)) {
            chatbotWindow.classList.remove('active');
        }
    });
});
