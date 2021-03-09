const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

let circles = [];
let users = [];
const code = '123456';
let t = 0;

io.on('connection', (socket) => {
    socket.on('login message', req => {   
        let res = {}     
        if (req.code === code) {
            users.push(req.nickname);
            res = {'status': 200, 'success': `Přihlásil se nový uživatel: ${req.nickname}`, 'nick': req.nickname}
        } else {
            res = {'status': 400, 'error': 'Neplatný kód', 'nick': req.nickname}
        }
        io.emit('login message', res);
        io.emit('canvas message', {'nick': users[t], 'data': circles});
    });

    socket.on('chat message', msg => {
      let d = new Date();  
      msg['time'] = `${d.toLocaleDateString()}, ${d.toLocaleTimeString()}`;
      io.emit('chat message', msg);
    });

    socket.on('canvas message', msg => {        
      circles.push(msg);  
      t++;
      io.emit('canvas message', {'nick': users[t % users.length], 'data': circles});
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));