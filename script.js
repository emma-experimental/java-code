(function() {
    if (window.ChatWidgetLoaded) return;
    window.ChatWidgetLoaded = true;

    const config = window.ChatWidgetConfig || {};
    const webhook = config.webhook || {};
    const branding = config.branding || {};
    const style = config.style || {};

    const defaults = {
        webhook: { url: '' },
        branding: {
            name: 'AI Support',
            welcomeText: 'Welcome! How can I help you today?',
            responseTimeText: 'I typically respond within seconds'
        },
        style: {
            primaryColor: '#10b981',
            secondaryColor: '#059669',
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#1f2937'
        }
    };

    const finalConfig = {
        webhook: { ...defaults.webhook, ...webhook },
        branding: { ...defaults.branding, ...branding },
        style: { ...defaults.style, ...style }
    };

    const css = `
        .ai-chat-widget {
            position: fixed !important;
            bottom: 20px !important;
            ${finalConfig.style.position}: 20px !important;
            z-index: 999999 !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }

        .ai-chat-toggle {
            width: 60px !important;
            height: 60px !important;
            border-radius: 50% !important;
            background: linear-gradient(135deg, ${finalConfig.style.primaryColor}, ${finalConfig.style.secondaryColor}) !important;
            border: none !important;
            cursor: pointer !important;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: all 0.3s ease !important;
            position: relative !important;
        }

        .ai-chat-toggle:hover { transform: scale(1.05) !important; box-shadow: 0 6px 25px rgba(0,0,0,0.25) !important; }
        .ai-chat-toggle svg { width: 24px !important; height: 24px !important; fill: white !important; transition: transform 0.3s ease !important; }
        .ai-chat-toggle.active svg { transform: rotate(180deg) !important; }

        .ai-chat-notification { position: absolute !important; top: -5px !important; right: -5px !important; width: 20px !important; height: 20px !important; background: #ff4757 !important; border-radius: 50% !important; display: none !important; align-items: center !important; justify-content: center !important; color: white !important; font-size: 12px !important; font-weight: bold !important; animation: pulse 2s infinite !important; }

        @keyframes pulse { 0%,100%{ transform: scale(1); opacity:1 } 50%{ transform: scale(1.1); opacity:0.8 } }

        .ai-chat-container {
            width: 350px !important;
            height: 500px !important;
            background: ${finalConfig.style.backgroundColor} !important;
            border-radius: 20px !important;
            box-shadow: 0 10px 40px rgba(0,0,0,0.15) !important;
            display: none !important;
            flex-direction: column !important;
            overflow: hidden !important;
            position: absolute !important;
            bottom: 80px !important;
            ${finalConfig.style.position}: 0 !important;
            opacity: 0 !important;
            transform: translateY(20px) !important;
            transition: all 0.3s ease !important;
        }

        .ai-chat-container.active { display: flex !important; opacity: 1 !important; transform: translateY(0) !important; }
        .ai-chat-header { background: linear-gradient(135deg, ${finalConfig.style.primaryColor}, ${finalConfig.style.secondaryColor}) !important; color: white !important; padding: 20px !important; display: flex !important; align-items: center !important; gap: 12px !important; }
        .ai-chat-avatar { width: 40px !important; height: 40px !important; border-radius: 50% !important; background: rgba(255,255,255,0.2) !important; display: flex !important; align-items: center !important; justify-content: center !important; font-weight: bold !important; font-size: 16px !important; }
        .ai-chat-info h3 { margin: 0 0 2px 0 !important; font-size: 16px !important; }
        .ai-chat-info p { margin: 0 !important; font-size: 12px !important; opacity: 0.8 !important; }
        .ai-chat-status { width: 8px !important; height: 8px !important; background: #4ade80 !important; border-radius: 50% !important; display: inline-block !important; margin-right: 5px !important; animation: pulse 2s infinite !important; }

        .ai-chat-messages { flex: 1 !important; padding: 20px !important; overflow-y: auto !important; background: #f8fafc !important; display: flex !important; flex-direction: column !important; gap: 15px !important; }
        .ai-chat-messages::-webkit-scrollbar { width: 4px !important; }
        .ai-chat-messages::-webkit-scrollbar-thumb { background: #cbd5e1 !important; border-radius: 2px !important; }

        .ai-message { display: flex !important; gap: 10px !important; animation: slideIn 0.3s ease !important; }
        @keyframes slideIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        .ai-message.user { flex-direction: row-reverse !important; }

        .ai-message-avatar { width: 32px !important; height: 32px !important; border-radius: 50% !important; display:flex !important; align-items:center !important; justify-content:center !important; font-size:12px !important; font-weight:bold !important; flex-shrink:0 !important; }
        .ai-message.bot .ai-message-avatar { background: linear-gradient(135deg, ${finalConfig.style.primaryColor}, ${finalConfig.style.secondaryColor}) !important; color: white !important; }
        .ai-message.user .ai-message-avatar { background: #4ade80 !important; color: white !important; }

        .ai-message-content { max-width: 80% !important; padding: 12px 16px !important; border-radius: 18px !important; word-wrap: break-word !important; color: ${finalConfig.style.fontColor} !important; }
        .ai-message.bot .ai-message-content { background: white !important; border-bottom-left-radius: 6px !important; box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important; }
        .ai-message.user .ai-message-content { background: linear-gradient(135deg, ${finalConfig.style.primaryColor}, ${finalConfig.style.secondaryColor}) !important; color: white !important; border-bottom-right-radius: 6px !important; }

        .ai-message-text { margin: 0 !important; font-size: 14px !important; line-height: 1.4 !important; }
        .ai-message-time { font-size: 11px !important; opacity: 0.6 !important; margin-top: 4px !important; }

        .ai-typing-indicator { display: none !important; padding: 12px 16px !important; background: white !important; border-radius: 18px !important; border-bottom-left-radius: 6px !important; box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important; max-width: 80% !important; }
        .ai-typing-dots { display:flex !important; gap:4px !important; }
        .ai-typing-dot { width:6px !important; height:6px !important; background:#94a3b8 !important; border-radius:50% !important; animation: typing 1.4s infinite !important; }
        .ai-typing-dot:nth-child(2) { animation-delay: 0.2s !important; } .ai-typing-dot:nth-child(3) { animation-delay: 0.4s !important; }
        @keyframes typing { 0%,60%,100%{ transform:translateY(0); opacity:0.4 } 30%{ transform:translateY(-8px); opacity:1 } }

        .ai-chat-input { padding:20px !important; background:white !important; border-top:1px solid #e2e8f0 !important; display:flex !important; gap:10px !important; align-items:flex-end !important; }
        .ai-input-field { flex:1 !important; min-height:20px !important; max-height:100px !important; padding:12px 16px !important; border:2px solid #e2e8f0 !important; border-radius:25px !important; outline:none !important; resize:none !important; font-family:inherit !important; font-size:14px !important; line-height:1.4 !important; transition:border-color 0.3s ease !important; }
        .ai-input-field:focus { border-color: ${finalConfig.style.primaryColor} !important; }

        .ai-send-button { width:40px !important; height:40px !important; border:none !important; border-radius:50% !important; background: linear-gradient(135deg, ${finalConfig.style.primaryColor}, ${finalConfig.style.secondaryColor}) !important; color:white !important; cursor:pointer !important; display:flex !important; align-items:center !important; justify-content:center !important; transition: all 0.3s ease !important; flex-shrink:0 !important; }
        .ai-send-button:hover { transform: scale(1.05) !important; }
        .ai-send-button:disabled { opacity:0.5 !important; cursor:not-allowed !important; transform:none !important; }

        .ai-welcome-message { background: rgba(16,185,129,0.1) !important; border: 1px solid rgba(16,185,129,0.3) !important; border-radius:12px !important; padding:16px !important; text-align:center !important; color:${finalConfig.style.fontColor} !important; font-size:14px !important; line-height:1.5 !important; }

        @media (max-width:768px) {
            .ai-chat-widget { bottom: 15px !important; ${finalConfig.style.position}: 15px !important; }
            .ai-chat-container { width: calc(100vw - 30px) !important; height: calc(100vh - 150px) !important; max-width:400px !important; bottom:85px !important; ${finalConfig.style.position}: -10px !important; }
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = css;
    document.head.appendChild(styleSheet);

    const widgetHTML = `
        <div class="ai-chat-widget">
            <button class="ai-chat-toggle" id="aiChatToggle" aria-label="Open chat">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L1 23l6.71-1.97C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.4 0-2.69-.35-3.83-.99L2 20l.99-6.17C2.35 12.69 2 11.4 2 10c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/>
                    <circle cx="8.5" cy="12" r="1.5"/>
                    <circle cx="15.5" cy="12" r="1.5"/>
                    <circle cx="12" cy="12" r="1.5"/>
                </svg>
                <div class="ai-chat-notification" id="aiChatNotification">1</div>
            </button>

            <div class="ai-chat-container" id="aiChatContainer" role="dialog" aria-hidden="true">
                <div class="ai-chat-header">
                    <div class="ai-chat-avatar" id="aiChatAvatar">${finalConfig.branding.name.charAt(0).toUpperCase()}</div>
                    <div class="ai-chat-info">
                        <h3 id="aiChatTitle">${finalConfig.branding.name}</h3>
                        <p><span class="ai-chat-status" aria-hidden="true"></span>Online</p>
                    </div>
                </div>

                <div class="ai-chat-messages" id="aiChatMessages" aria-live="polite">
                    <div class="ai-welcome-message">
                        ${finalConfig.branding.welcomeText}<br>
                        <small style="opacity: 0.7;">${finalConfig.branding.responseTimeText}</small>
                    </div>
                </div>

                <div class="ai-chat-input">
                    <textarea class="ai-input-field" id="aiMessageInput" placeholder="Type your message..." rows="1"></textarea>
                    <button class="ai-send-button" id="aiSendButton" aria-label="Send message">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                            <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;

    class AIChatWidget {
        constructor() {
            this.userId = this.generateUserId();
            this.isOpen = false;
            this.isTyping = false;
            this.config = finalConfig;

            document.body.insertAdjacentHTML('beforeend', widgetHTML);

            // initialize elements
            this.initializeElements();
            this.bindEvents();
            this.setupAutoResize();

            // small delayed notification to draw attention
            setTimeout(() => this.showNotification(), 3000);
            console.info('AI Chat Widget initialized', { userId: this.userId });
        }

        generateUserId() {
            try {
                if (window.crypto && crypto.getRandomValues) {
                    const arr = new Uint8Array(8);
                    crypto.getRandomValues(arr);
                    return 'user_' + Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('') + '_' + Date.now();
                }
            } catch (e) { /* ignore and fallback */ }
            return 'user_' + Math.random().toString(36).slice(2, 11) + '_' + Date.now();
        }

        initializeElements() {
            this.toggle = document.getElementById('aiChatToggle');
            this.container = document.getElementById('aiChatContainer');
            this.messages = document.getElementById('aiChatMessages');
            this.input = document.getElementById('aiMessageInput');
            this.sendBtn = document.getElementById('aiSendButton');
            this.notification = document.getElementById('aiChatNotification');

            // defensive checks
            if (!this.toggle || !this.container || !this.messages || !this.input || !this.sendBtn) {
                console.error('AI Chat Widget: missing DOM elements during initialization.');
            }
        }

        bindEvents() {
            if (this.toggle) this.toggle.addEventListener('click', () => this.toggleChat());
            if (this.sendBtn) this.sendBtn.addEventListener('click', () => this.sendMessage());
            if (this.input) {
                this.input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        this.sendMessage();
                    }
                });
                this.input.addEventListener('input', () => this.adjustTextareaHeight());
            }

            // close chat on outside click (optional - safe behavior)
            document.addEventListener('click', (e) => {
                if (!this.container || !this.toggle) return;
                if (this.isOpen && !this.container.contains(e.target) && !this.toggle.contains(e.target)) {
                    this.toggleChat(); // close
                }
            });
        }

        setupAutoResize() {
            this.adjustTextareaHeight();
        }

        adjustTextareaHeight() {
            if (!this.input) return;
            this.input.style.height = 'auto';
            const newHeight = Math.min(this.input.scrollHeight, 100);
            this.input.style.height = (newHeight || 24) + 'px';
        }

        toggleChat() {
            this.isOpen = !this.isOpen;
            if (!this.container || !this.toggle) return;

            if (this.isOpen) {
                this.container.classList.add('active');
                this.toggle.classList.add('active');
                this.container.setAttribute('aria-hidden', 'false');
                this.hideNotification();
                setTimeout(() => { try { this.input.focus(); } catch (e) {} }, 300);
            } else {
                this.container.classList.remove('active');
                this.toggle.classList.remove('active');
                this.container.setAttribute('aria-hidden', 'true');
            }
        }

        showNotification() {
            if (this.notification) this.notification.style.display = 'flex';
        }

        hideNotification() {
            if (this.notification) this.notification.style.display = 'none';
        }

        async sendMessage() {
            if (!this.input) return;
            const message = (this.input.value || '').trim();
            if (!message || this.isTyping) return;

            this.addMessage(message, 'user');
            this.input.value = '';
            this.adjustTextareaHeight();

            this.showTypingIndicator();

            try {
                const response = await this.callN8N(message);
                this.hideTypingIndicator();

                const botMessage = this.processResponse(response);
                this.addMessage(botMessage, 'bot');
            } catch (error) {
                this.hideTypingIndicator();
                console.error('Chat Error:', error);
                this.addMessage('Sorry, I\'m having trouble connecting right now. Please try again in a moment.', 'bot');
            }
        }

        async callN8N(message) {
            // if no webhook configured, return a mock response (so devs can test UI)
            if (!this.config.webhook || !this.config.webhook.url) {
                // simulate a small delay
                await new Promise(r => setTimeout(r, 700));
                return { reply: `You said: "${message}". (This is a local mock reply because no webhook.url is configured.)` };
            }

            // real webhook call
            const payload = {
                message: message,
                userId: this.userId,
                timestamp: new Date().toISOString()
            };

            const resp = await fetch(this.config.webhook.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!resp.ok) {
                throw new Error(`HTTP error! status: ${resp.status}`);
            }

            // attempt to parse JSON, if not JSON, return text
            const contentType = resp.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                return await resp.json();
            } else {
                const text = await resp.text();
                // return as reply string
                return { reply: text };
            }
        }

        processResponse(response) {
            try {
                if (response == null) return 'No response received.';
                if (typeof response === 'string') return response;
                if (response.reply) return String(response.reply);
                if (response.data && response.data.reply) return String(response.data.reply);

                if (Array.isArray(response)) {
                    return response.map(item =>
                        typeof item === 'string' ? item : (item.reply || JSON.stringify(item, null, 2))
                    ).join('\n\n');
                }

                if (typeof response === 'object') {
                    const textFields = ['message', 'text', 'content', 'answer', 'result'];
                    for (const field of textFields) {
                        if (response[field]) return String(response[field]);
                    }
                    return this.formatJsonToText(response);
                }

                return String(response);
            } catch (error) {
                console.error('Error processing response:', error);
                return 'I received a response but had trouble understanding it. Could you please try rephrasing your question?';
            }
        }

        formatJsonToText(obj) {
            try {
                const formatted = JSON.stringify(obj, null, 2)
                    .replace(/[{}"]/g, '')
                    .replace(/,\n/g, '\n')
                    .replace(/:\s+/g, ': ')
                    .trim();
                return formatted || 'I received your message but the response format was unclear.';
            } catch (error) {
                return 'I received your message but had trouble processing the response.';
            }
        }

        addMessage(text, sender) {
            if (!this.messages) return;
            const messageDiv = document.createElement('div');
            messageDiv.className = `ai-message ${sender}`;

            const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const avatar = sender === 'user' ? 'U' : (this.config.branding.name ? this.config.branding.name.charAt(0).toUpperCase() : 'A');

            // ensure text is string and escaped
            const safeText = this.escapeHtml(text);

            messageDiv.innerHTML = `
                <div class="ai-message-avatar">${avatar}</div>
                <div class="ai-message-content">
                    <p class="ai-message-text">${safeText}</p>
                    <div class="ai-message-time">${currentTime}</div>
                </div>
            `;

            this.messages.appendChild(messageDiv);
            this.scrollToBottom();
        }

        showTypingIndicator() {
            if (!this.messages) return;
            this.isTyping = true;
            if (this.sendBtn) this.sendBtn.disabled = true;

            const typingDiv = document.createElement('div');
            typingDiv.className = 'ai-message bot';
            typingDiv.id = 'aiTypingIndicator';
            typingDiv.innerHTML = `
                <div class="ai-message-avatar">${this.config.branding.name.charAt(0).toUpperCase()}</div>
                <div class="ai-typing-indicator" style="display:block !important;">
                    <div class="ai-typing-dots">
                        <div class="ai-typing-dot"></div>
                        <div class="ai-typing-dot"></div>
                        <div class="ai-typing-dot"></div>
                    </div>
                </div>
            `;
            this.messages.appendChild(typingDiv);
            this.scrollToBottom();
        }

        hideTypingIndicator() {
            this.isTyping = false;
            if (this.sendBtn) this.sendBtn.disabled = false;
            const typingIndicator = document.getElementById('aiTypingIndicator');
            if (typingIndicator) typingIndicator.remove();
        }

        scrollToBottom() {
            setTimeout(() => { if (this.messages) this.messages.scrollTop = this.messages.scrollHeight; }, 100);
        }

        escapeHtml(text) {
            // convert non-strings to string safely, then escape HTML
            const str = (text === undefined || text === null) ? '' : String(text);
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML.replace(/\n/g, '<br>');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new AIChatWidget());
    } else {
        new AIChatWidget();
    }
})();
