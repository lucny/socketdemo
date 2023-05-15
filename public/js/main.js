const message = document.getElementById('message');
const send = document.getElementById('send');
const chatBox = document.getElementById('chatbox');
const socket = io();

class ChatItem {
    constructor(message, nick='Anonymous', color='black', time='Eternity') {
        this.message = message;
        this.nick = nick;
        this.color = color;
        this.time = time;
    }
    
    render(parent) {
        let template  = `
        <div class="media border p-3 mt-2" style="background-color: ${this.color}">
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
        if (message.value)
          socket.emit('chat', {nick: nick.value, color: color.value, message: message.value});
      message.value = '';
    }
});

socket.on('chat', msg => {
    let chatItem = new ChatItem(msg.message, msg.nick, msg.color, (new Date()).toLocaleTimeString());
    chatItem.render(chatBox);
    window.scrollTo(0, document.body.scrollHeight);
});

/**************************************************************/
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

let current = {
  color: color.value
};
let drawing = false;

canvas.addEventListener('mousedown', onMouseDown, false);
canvas.addEventListener('mouseup', onMouseUp, false);
canvas.addEventListener('mouseout', onMouseUp, false);
canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);

//Touch support for mobile devices
canvas.addEventListener('touchstart', onMouseDown, false);
canvas.addEventListener('touchend', onMouseUp, false);
canvas.addEventListener('touchcancel', onMouseUp, false);
canvas.addEventListener('touchmove', throttle(onMouseMove, 10), false);


socket.on('drawing', onDrawingEvent);

function drawLine(x0, y0, x1, y1, color, emit){
  context.beginPath();
  context.moveTo(x0, y0);
  context.lineTo(x1, y1);
  context.strokeStyle = color;
  context.lineWidth = 2;
  context.stroke();
  context.closePath();

  if (!emit) { return; }

  socket.emit('drawing', {
    x0: x0,
    y0: y0,
    x1: x1,
    y1: y1,
    color: color
  });
}

function onMouseDown(e){
  current.color = color.value;  
  drawing = true;
  current.x = e.offsetX||e.touches[0].offsetX;
  current.y = e.offsetY||e.touches[0].offsetY;
  console.log(current.x);
}

function onMouseUp(e){
  if (!drawing) { return; }
  drawing = false;
  drawLine(current.x, current.y, e.offsetX||e.touches[0].offsetX, e.offsetY||e.touches[0].offsetY, current.color, true);
}

function onMouseMove(e){
  if (!drawing) { return; }
  drawLine(current.x, current.y, e.offsetX||e.touches[0].offsetX, e.offsetY||e.touches[0].offsetY, current.color, true);
  current.x = e.offsetX||e.touches[0].offsetX;
  current.y = e.offsetY||e.touches[0].offsetY;
}


// limit the number of events per second
function throttle(callback, delay) {
  var previousCall = new Date().getTime();
  return function() {
    var time = new Date().getTime();

    if ((time - previousCall) >= delay) {
      previousCall = time;
      callback.apply(null, arguments);
    }
  };
}

function onDrawingEvent(data){
  //var w = canvas.width;
  //var h = canvas.height;
  drawLine(data.x0, data.y0, data.x1, data.y1, data.color);
}
