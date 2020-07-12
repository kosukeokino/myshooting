'use strict'

// const { Player } = require("./settings");

let socket;
socket = io.connect('http://localhost:3000');


let players = [];
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
socket.on('startgame',function(pls){
    $('.lobby').fadeOut();
    $('.game').fadeIn();
    players = pls;
    console.log(players.length);
});
///////////// p5.js ////////////////
function setup() {
    let canvas = createCanvas(sts.width, sts.height);
    canvas.parent('canvas');
}
let x = 0;
function draw() {
    background(100);
    for(let idx = 0; idx < players.length; idx++){
        // console.log(players[idx].name);
        ellipse(players[idx].x, players[idx].y, sts.plsize, sts.plsize);
    }
    ellipse(100,100,50,50);
    // if(keyIsPressed===true){
    //     console.log('key is pressed');
    //     // keycommand();
    // }
    ellipse(x, 200, 50,50);
    if(keyIsPressed){
      x += 1;
      keycommand();
    }
    if(ongame){
        
        console.log("mydata is "+mydata);
        socket.emit('move',mydata);
    }
    
}
socket.on('update', function(pls){
    players = pls;
    mydata.x = players[myindex].x;
    mydata.y = players[myindex].y;
    mydata.agl = players[myindex].agl;
});
// function kiicoda(){
//     console.log(keyCode);
// }

function keycommand(){

    // let me = new Player('name');
    // let me = players[myindex];
    // console.log(me);

    console.log(mydata.x);

    // mydata.x = me.x;
    // mydata.y = me.y;
    // mydata.agl = me.agl;
    // console.log("me"+me);
    // console.log("mydata"+mydata);

    // // 加速
    // let acf = 1;
    // if(keyIsDown(32)){acf = sts.acf;}
    // // 動く
    // switch (keyCode){
     ////// 移動 //////////
    //     // left : [s]
    //     case 83:
    //         mydata.x -= acf* sts.mvbit;
    //         break;
    //     // right : [f]
    //     case 70:
    //         mydata.x += acf* sts.mvbit;
    //         break;
    //     // up : [e]
    //     case 69:
    //         mydata.y -= acf* sts.mvbit;
    //         break;
    //     // down : [d]
    //     case 68:
    //         mydata.y += acf* sts.mvbit;
    //         break;
    //  ///// 砲台 ////////// 
    //     // 時計周り
    //     case 76:
    //         mydata.agl += acf* sts.aglbit;
    //         break;
    //     // 反時計回り
    //     case 74:
    //         mydata.agl -= acf* sts.aglbit;
    //         break;
    //     // 発射
    //     case 75:
    //         // 球を撃つメソッド
    //         break;
    //     default:
    //         break;
    // }
    // console.log(mydata);



    // console.log(acf);
}
