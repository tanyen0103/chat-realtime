(()=>{
    const app = document.querySelector(".app");
    const socket = io();

    let uname;

    // Join user event handler
    app.querySelector(".join-screen #join-user").onclick = () => {
        let username = app.querySelector(".join-screen #username").value;
        if(username.length == 0)
            return;
        socket.emit("newuser", username);
        uname = username;
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    };

    // Send a message event handler
    app.querySelector(".chat-screen #send-message").onclick = () => {
        let message = app.querySelector(".chat-screen #message-input").value;
        if(message.length == 0){
            return;
        }
        renderMessage("my", {
            username: uname,
            text: message,
        });
        socket.emit("chat", {
            username:uname,
            text:message,
        });
        app.querySelector(".chat-screen #message-input").value = "";
    };

    // Exit chat event handler
    app.querySelector(".chat-screen #exit-chat").onclick = () => {
        socket.emit("exituser",uname);
        window.location.href = window.location.href;
    };

    //Accept other localhost
    socket.on("update", (update) => {
        renderMessage("update", update);
    });
    socket.on("chat", (message) => {
        renderMessage("other", message);
    });

    //renderMessage function
    function renderMessage(type, message) {
        let messageContainer = app.querySelector(".chat-screen .messages");
        if(type == "my"){
            let el = document.createElement("div");
            el.setAttribute("class", "message my-message");
            el.innerHTML = `
                <div>
                    <div class="name">You</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(el);
        } else if(type == "other"){
            let el = document.createElement("div");
            el.setAttribute("class", "message other-message");
            el.innerHTML = `
                <div>
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(el);
        } else if(type == "update"){
            let el = document.createElement("div");
            el.setAttribute("class", "update");
            el.innerText = message;
            messageContainer.appendChild(el);
        }

        //Scroll chat to end
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }
})();