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

io.on('connection', (socket) => {
    socket.on('login message', req => {   
        let res = {}     
        if (req.code === code) {
            users.push(req.nickname);
            res = {'status': 200, 'success': `Přihlásil se nový uživatel: ${req.nickname}`}
        } else {
            res = {'status': 400, 'error': 'Neplatný kód'}
        }
        io.emit('login message', res);
    });

    socket.on('chat message', msg => {
      io.emit('chat message', msg);
    });

    socket.on('canvas message', msg => {
      circles.push(msg);  
      io.emit('canvas message', circles);
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));