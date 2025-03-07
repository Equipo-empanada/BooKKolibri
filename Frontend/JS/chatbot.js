class Chatbox {
    constructor() {
        this.args = {
            openButton: null,
            chatBox: null,
            sendButton: null
        };

        this.state = false;
        this.messages = [];
    }

    init() {
        this.injectCSS();
        this.injectHTML();

        this.args.openButton = document.querySelector('.chatbox__button');
        this.args.chatBox = document.querySelector('.chatbox__support');
        this.args.sendButton = document.querySelector('.send__button');

        this.display();
    }

    injectCSS() {
        const css = `
        :root {
            --primaryGradient: linear-gradient(93.12deg, #1A4265 0.52%, #456e92 100%);
            --secondaryGradient: linear-gradient(268.91deg, #1A4265 -2.14%, #456e92 99.69%);
            --primaryBoxShadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
            --secondaryBoxShadow: 0px -10px 15px rgba(0, 0, 0, 0.1);
            --primary: #1A4265;
        }
        
        /* CHATBOX
        =============== */
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        
        .container__chatbox {
            font-weight: 400;
            font-size: 100%;
            background: #F1F1F1;
        }
        .chatbox {
            position: fixed;
            bottom: 20px; /* Distance from the bottom of the screen */
            right: 20px; /* Distance from the right of the screen */
            max-width: 400px;
            width: 100%;
            z-index: 1000; /* Ensure it stays on top of other elements */
        }
        
        /* CONTENT IS CLOSE */
        .chatbox__support {
            display: flex;
            flex-direction: column;
            background: #eee;
            width: 300px;
            height: 350px;
            z-index: -123456;
            opacity: 0;
            transition: all .5s ease-in-out;
        }
        
        /* CONTENT ISOPEN */
        .chatbox--active {
            transform: translateY(-40px);
            z-index: 123456;
            opacity: 1;
        
        }
        
        /* BUTTON */
        .chatbox__button {
            text-align: right;
        }
        
        .send__button {
            padding: 6px;
            background: transparent;
            border: none;
            outline: none;
            cursor: pointer;
        }
        
        
        /* HEADER */
        .chatbox__header {
            position: sticky;
            top: 0;
            background: orange;
        }
        
        .chatbox__image--header img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
        }
        
        /* MESSAGES */
        .chatbox__messages {
            margin-top: auto;
            display: flex;
            overflow-y: scroll;
            flex-direction: column-reverse;
        }
        
        .messages__item {
            background: orange;
            max-width: 60.6%;
            width: fit-content;
        }
        
        .messages__item--operator {
            margin-left: auto;
        }
        
        .messages__item--visitor {
            margin-right: auto;
        }
        
        /* FOOTER */
        .chatbox__footer {
            position: sticky;
            bottom: 0;
        }
        
        .chatbox__support {
            background: #f9f9f9;
            height: 450px;
            width: 350px;
            box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
        }
        
        /* HEADER */
        .chatbox__header {
            background: var(--primaryGradient);
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            padding: 15px 20px;
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
            box-shadow: var(--primaryBoxShadow);
        }
        
        .chatbox__image--header {
            margin-right: 10px;
        }
        
        .chatbox__heading--header {
            font-family: "Nunito", sans-serif;
            font-size: 1.2rem;
            color: white;
        }
        
        .chatbox__description--header {
            font-family: "Nunito", sans-serif;
            font-size: .9rem;
            color: white;
        }
        
        /* Messages */
        .chatbox__messages {
            padding: 0 20px;
        }
        
        .messages__item {
            margin-top: 10px;
            background: #444;
            padding: 8px 12px;
            max-width: 70%;
        }
        
        .messages__item--visitor,
        .messages__item--typing {
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
            border-bottom-right-radius: 20px;
        }
        
        .messages__item--operator {
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
            border-bottom-left-radius: 20px;
            background: var(--primary);
            color: white;
        }
        
        /* FOOTER */
        .chatbox__footer {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            padding: 20px 20px;
            background: var(--secondaryGradient);
            box-shadow: var(--secondaryBoxShadow);
            border-bottom-right-radius: 10px;
            border-bottom-left-radius: 10px;
            margin-top: 20px;
        }
        
        .chatbox__footer input {
            width: 80%;
            border: none;
            padding: 10px 10px;
            border-radius: 30px;
            text-align: left;
            color: black;
        }
        
        .chatbox__footer input:placeholder {
            color: #888;
        }

        .chatbox__send--footer {
            color: white;
        }
        
        .chatbox__button button,
        .chatbox__button button:focus,
        .chatbox__button button:visited {
            padding: 10px;
            background: white;
            border: none;
            outline: none;
            border-top-left-radius: 50px;
            border-top-right-radius: 50px;
            border-bottom-left-radius: 50px;
            box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
            cursor: pointer;
        }
        
        `;

        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    injectHTML() {
        const html = `
            <div class="container">
                <div class="chatbox">
                    <div class="chatbox__support">
                        <div class="chatbox__header">
                            <div class="chatbox__image--header">
                                <img src="../Frontend/assets/logochat.jpg" alt="image">
                            </div>
                            <div class="chatbox__content--header">
                                <h4 class="chatbox__heading--header">Web Chat</h4>
                                <p class="chatbox__description--header">Hola, soy Kolibot ¿Cómo puedo ayudarte?</p>
                            </div>
                        </div>
                        <div class="chatbox__messages">
                            <div></div>
                        </div>
                        <div class="chatbox__footer">
                            <input type="text" placeholder="Escribe un mensaje...">
                            <button class="chatbox__send--footer send__button">Enviar</button>
                        </div>
                    </div>
                    <div class="chatbox__button">
                        <button><img src="../Frontend/assets/chatbox-icon.svg" /></button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
    }

    display() {
        const { openButton, chatBox, sendButton } = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatBox));
        sendButton.addEventListener('click', () => this.onSendButton(chatBox));

        const node = chatBox.querySelector('input');
        node.addEventListener("keyup", ({ key }) => {
            if (key === "Enter") {
                this.onSendButton(chatBox);
            }
        });
    }

    toggleState(chatbox) {
        this.state = !this.state;

        // show or hides the box
        if (this.state) {
            chatbox.classList.add('chatbox--active');
        } else {
            chatbox.classList.remove('chatbox--active');
        }
    }

    onSendButton(chatbox) {
        var textField = chatbox.querySelector('input');
        let text1 = textField.value;
        if (text1 === "") {
            return;
        }

        let msg1 = { name: "User", message: text1 };
        this.messages.push(msg1);

        fetch('http://localhost:5000/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text1 }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(r => r.json())
            .then(r => {
                let msg2 = { name: "Sam", message: r.answer };
                this.messages.push(msg2);
                this.updateChatText(chatbox);
                textField.value = '';
            }).catch((error) => {
                console.error('Error:', error);
                this.updateChatText(chatbox);
                textField.value = '';
            });
    }

    updateChatText(chatbox) {
        var html = '';
        this.messages.slice().reverse().forEach(function (item, index) {
            if (item.name === "Sam") {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>';
            } else {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>';
            }
        });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
}

const chatbox = new Chatbox();
chatbox.init();
