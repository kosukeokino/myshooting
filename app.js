'use strict'

var express = require('express');
var app = express();
var server = app.listen(3000);

var STS = require('./src/settings.js');
console.log(STS.sts);

app.use(express.static(__dirname));
console.log('service start.');

var socket = require('socket.io');
var io = socket(server);

let id0 = Math.floor(Math.random() * 1000);

// class Player{
//     constructor(name){
//         this.name = name;
//         this.x = Math.floor(Math.random() * STS.sts.width);
//         this.y = Math.floor(Math.random() * STS.sts.height);
//         this.agl = Math.floor(Math.random() * 360 );
//         this.id = 0;
//     }
//     move(distance){
//         this.x += distance;
//         this.y += distance;
//     }
//     turn(agl){
//         this.agl += agl
//     }
// }

let players = [];

io.sockets.on('connection', function(socket) {
    // 接続の確認
    console.log('new connection: '+socket.id);

    socket.on('adduser', function(playername){
        console.log("new one come");
        // 新規接続者のインスタンス化
        let player = new STS.Player(playername);
        player.id = id0;
        id0++;
        console.log(player.name);
        
        // 新規接続者をplayersに追加
        let numopl = players.length;
        players[numopl] = player;
        console.log(numopl);

        //// ★確認
        console.log('++++++++++');
        for(let i = 0; i < numopl+1; i++){
            console.log(players[i].id + " : " + players[i].name);
        }
        console.log('++++++++++');
        //// ★おわり

        io.sockets.emit('players', players);
    });
    socket.on('GAME_START',function() {
        io.sockets.emit('startgame', players);
    });
    socket.on('move', function(data) {
        let obj = players[data.idx];
        obj.x = data.x;
        obj.y = data.y;
        obj.agl = data.agl;
        io.sockets.emit('update', players);
        // socket.broadcast.emit('update', players);
    });


})