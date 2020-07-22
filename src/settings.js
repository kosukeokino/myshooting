const sts = {
    width : 1000,
    height : 700,
    plsize : 30, // playerの画面上のサイズ
    acf : 2, // 移動の加速係数
    mvbit : 2, // キャラクターの移動単位
    aglbit : 0.01*Math.PI,  // 砲台の回転単位
    walls : 4,  // wallの数
    bullspeed : 3,
    bulletsize : 2
};
class Player{
    constructor(name){
        this.name = name;
        this.x = Math.floor(Math.random() * (sts.width - sts.plsize) + sts.plsize/2);
        this.y = Math.floor(Math.random() * (sts.height -sts.plsize) + sts.plsize/2);
        this.agl = Math.floor(Math.random() * 360 );
        this.id = 0;
        this.plsize = sts.plsize;
        this.loaded = true;
    }
    action(objects){
        // 動く前の位置
        const _x = this.x;
        const _y = this.y;


        let acf = 1;　// 加速係数
        if(objects.keys['32']){
            acf = sts.acf;
        }
        ///// 移動 ////////// 
        // left : [s]
        if(objects.keys['83']){
            if(0 + sts.plsize/2 < this.x){
                this.x -= acf* sts.mvbit;
            }
        }   
        // right : [f]
        if(objects.keys['70']){
            if(this.x < sts.width - sts.plsize/2){
                this.x += acf* sts.mvbit;
            }
        }
        // up : [e]
        if(objects.keys['69']){
            if(0 + sts.plsize/2 < this.y){
                this.y -= acf* sts.mvbit;
            }
        }
        // down : [d]
        if(objects.keys['68']){
            if(this.y < sts.height - sts.plsize/2)
            this.y += acf* sts.mvbit;
        }

        ///// 砲台 ////////// 
        // 時計周り : [l]
        if(objects.keys['76']){
            this.agl += acf* sts.aglbit;
        }
        if(objects.keys['74']){
            this.agl -= acf* sts.aglbit;
        }
        if(objects.keys['75']){
            this.shoot(this.agl);
        }
        ///// 衝突の判定 //////////
        let collision = this.interscts(objects)
        if(collision){
            this.x = _x;
            this.y = _y;
        }
    }
    shoot(){
        if(this.loaded){
            console.log("shoot");
            let bullet = new Bullet(this.agl);
            addbullet(bullet);

            this.loaded = false;
            setTimeout(() => {
                this.loaded=true;
            }, 500);
        }
    }
    interscts(objects){
        let collision = false;
        objects.walls.forEach(wall => {
            if(collision){}
            else{
                collision = this.intersectWalls(wall);
            }
        });
        objects.players.forEach(plyr => {
            if(plyr == this){}
            else if(collision){}
            else{
                collision = this.intersectPlayer(plyr);
            }
        });
        return collision;
    }
    intersectWalls(wall){
        // 左(●■) || 右 || 上 || 下
        return (this.x+this.plsize/2 > wall.x) && 
               (wall.x+wall.w > this.x-this.plsize/2) &&
               (this.y+this.plsize/2 > wall.y) &&
               (wall.y+wall.h > this.y-this.plsize/2)
            ;
    }
    intersectPlayer(plyr){
        return (this.x-plyr.x)**2 + (this.y-plyr.y)**2 < (this.plsize/2 + plyr.plsize/2)**2;
    }
}
class Bullet{
    constructor(agl){
        this.x = sts.bullspeed*Math.cos(agl);
        this.y = sts.bullspeed*Math.sin(agl);
    }
}
class Wall{
    constructor(x0, y0){
        this.x = x0;
        this.y = y0;
        this.w = Math.floor(Math.random() * sts.width/4);
        this.h = Math.floor(Math.random() * sts.width/4);
    }
}
exports.sts = sts;
exports.Player = Player;
exports.Wall = Wall;
exports.Bullet = Bullet;