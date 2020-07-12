const sts = {
    width : 450,
    height : 700,
    plsize : 30, // playerの画面上のサイズ
    acf : 2, // 移動の加速係数
    mvbit : 5, // キャラクターの移動単位
    aglbit : 5  // 砲台の回転単位
};
class Player{
    constructor(name){
        this.name = name;
        this.x = Math.floor(Math.random() * sts.width);
        this.y = Math.floor(Math.random() * sts.height);
        this.agl = Math.floor(Math.random() * 360 );
        this.id = 0;
    }
    move(distance){
        this.x += distance;
        this.y += distance;
    }
    turn(agl){
        this.agl += agl
    }
}
exports.sts = sts;
exports.Player = Player;
