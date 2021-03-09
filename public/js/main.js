/* Chat */

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


/* Canvas */
const canvas = document.getElementById("mycanvas");
const ctx = canvas.getContext("2d");
const color = document.getElementById("color");

class Circle {
  static DEFAULT_RADIUS = 20;

  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = Circle.DEFAULT_RADIUS;
  }
}

function redrawCanvas(circles) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach(function(circle) {
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
      ctx.fillStyle = circle.color;
      ctx.fill();
      ctx.closePath();
    });
}

canvas.addEventListener("click", function (event) {
  socket.emit('canvas message', new Circle(event.offsetX, event.offsetY, color.value));
});

socket.on('canvas message', function (circles) {
  redrawCanvas(circles);
});
