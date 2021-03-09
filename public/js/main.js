const message = document.getElementById('message');
const send = document.getElementById('send');
const chatBox = document.getElementById('chatbox');
const socket = io();

class ChatItem {
    constructor(message, nick='Anonymous', time='Eternity') {
        this.message = message;
        this.nick = nick;
        this.time = time;
    }
    
    render(parent) {
        let template  = `
        <div class="media border p-3 mt-2">
            <img src="img/avatar-man.png" alt="${this.nick}" class="mr-3 mt-3 rounded-circle" style="width:60px;">
            <div class="media-body">
            <h4>${this.nick} <small><i>Posted on ${this.time}</i></small></h4>
            <p>${this.message}</p>
            </div>
        </div>`;
        parent.innerHTML += template;
    }
}

send.addEventListener('click', function(e){
    e.preventDefault();
    if (message.value) {
      socket.emit('chat message', message.value);
      message.value = '';
    }
});

socket.on('chat message', function (msg) {
    let chatItem = new ChatItem(msg);
    chatItem.render(chatBox);
    window.scrollTo(0, document.body.scrollHeight);
});


