'use strict'

let socket;
socket = io.connect('http://localhost:3000');


let players = [];
let walls = [];

let playername;
let myindex = 0;
let mydata = {
    idx : myindex,
    x : 0,
    y : 0,
    agl : 0
}
let ongame = false;

////////// 画面切り替え //////////
// Sets the client's playername
const setplayername = () => {
    playername = cleanInput($('.playernameInput').val().trim());

    // If the playername is valid
    if (playername) {
        $('.login.page').fadeOut();
        $('.lobby').fadeIn();
        // $('.login.page').off('click');
        console.log('work');

      // Tell the server your playername
      socket.emit('adduser', playername);
    }
}
/// ユーザー名の決定
$(window).keydown(event => {
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      if (playername) {
        typing = false;
      } else {
        setplayername();
      }
    }
});
//ユーザー名入力補助
const cleanInput = (input) => {
    return $('<div/>').text(input).html();
  }
// lobbyでのユーザー一覧の表示
socket.on('players', function(players){
    // let entries = "<ul class='entries'>";
    let entries = "<ul>";
    for(let i = 0; i < players.length; i++){
      entries += "<li>"+ (i+1) + " : " + players[i].name + "</li>";
    }
    entries += "</ul>"
    $(".wrapper").html(entries);
    myindex = players.findIndex(({name})=> name === playername);
  
    //ゲームの開始
    $(".gamestart").click(()=>{
        ongame = true;
      console.log("clicked")
      console.log("My index is : "+ myindex);
      //ゲーム画面表示メソッドを呼ぶ
      socket.emit('GAME_START');
    });
});

// ゲーム画面
socket.on('startgame',function(objs){
    $('.lobby').fadeOut();
    $('.game').fadeIn();
    players = objs.players;
    walls = objs.walls;
    console.log(objs);
});
///////////// p5.js ////////////////
function setup() {
    let canvas = createCanvas(sts.width, sts.height);
    canvas.parent('canvas');

}
let x = 0;
function draw() {
    background(255);
    for(let idx = 0; idx < players.length; idx++){
        console.log(players[idx].name);
        // ellipse(players[idx].x, players[idx].y, sts.plsize, sts.plsize);
        showCharacter(players[idx]);
    }
    walls.forEach(wall => {
        push();
        fill(0);
        noStroke();
        strokeWeight(2);
        rect(wall.x, wall.y, wall.w, wall.h);
        pop();        
    });

    ellipse(100,100,50,50);

    if(ongame){
       
        // console.log("mydata is "+mydata);
        // socket.emit('move',mydata);
        socket.emit('move', keys);

    }
}
socket.on('update', function(objs){
    players = objs.players;
    walls = objs.walls;
});

// 使用するキーのkeycode一覧
let gate = [32,68, 69, 70, 74, 75, 76, 83];

// キーコマンドの配列
let keys = {
    '32':false,
    '68':false,
    '69':false,
    '70':false,
    '74':false,
    '75':false,
    '76':false,
    '83':false
}

function keyPressed(){
    if(ongame){
        if(gate.indexOf(keyCode) >= 0){
            keys[keyCode]=true;
            console.log(keys);
            // socket.emit('move', keys);
        }
    }
}
function keyReleased(){
    if(ongame){
        if(gate.indexOf(keyCode) >= 0){
            keys[keyCode]=false;
            console.log(keys);
        }
    }
}

function showCharacter(player){
    let x = player.x;
    let y = player.y;
    let agl = player.agl;
    push();
    fill(0);
    noStroke();
    translate(x, y);
    ellipse(0, 0, sts.plsize);
    textAlign(CENTER);
    text(player.name, 0, -sts.plsize*(2/3));
    push();
    rotate(agl);
    triangle(player.plsize/2 + 7, 0, player.plsize/2, -3, player.plsize/2, 3);
    pop();
    pop();
}