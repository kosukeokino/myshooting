'use strict'

var express = require('express');
var app = express();
var server = app.listen(3000);

var STS = require('./src/settings.js');

app.use(express.static(__dirname));
console.log('service start.');

var socket = require('socket.io');
var io = socket(server);

let id0 = Math.floor(Math.random() * 900);

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
let walls = [STS.sts.walls];
let keys = [];

for(let i = 0; i < STS.sts.walls; i++){
    walls[i] = new STS.Wall(Math.floor(Math.random() * (STS.sts.width)), Math.floor(Math.random() * (STS.sts.height)));
}
console.log(walls);

let objects = {players, walls, keys};

io.sockets.on('connection', function(socket) {
    // 接続の確認
    console.log('new connection: '+socket.id);
    // connectionのスコープ内でplayerを定義
    let player = null;

    socket.on('adduser', function(playername){
        console.log("new one come");
        // playerのインスタンス化
        while(true){
            player = new STS.Player(playername);
            if(!player.interscts(objects)){
                break;
            }
            console.log("renew");
        }
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
        io.sockets.emit('startgame', objects);
    });
    socket.on('move', function(keys) {
        objects.keys = keys;
        player.action(objects);
        io.sockets.emit('update', objects);
        // socket.broadcast.emit('update', players);
    });

    function addbullet() {
        console.log('OK');
    }
})