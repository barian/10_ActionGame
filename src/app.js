var size;
//1:地面　2:ブロック　3:プレイヤ　4:ゾンビ 5:こうもり
var level = [
   [0,0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0,0],
   [0,0,0,0, 0, 0, 0, 0, 0, 0, 5, 0, 0,0,0,0],
   [0,0,0,0, 0, 0, 0, 0, 0, 0, 2, 2, 2,0,0,0],
   [0,0,0,0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0,0],
   [0,0,0,0, 0, 0, 2, 2, 2, 0, 0, 0, 0,0,0,0],
   [0,0,0,0, 0, 0, 0, 3, 0, 0, 0, 4, 0,0,0,6],
   [1,1,1,1, 1, 1, 1, 1, 1, 1, 1, 1, 1,1,1,1]
];
var tileSize = 96;
var playerPosition; //マップ内のプレイやの位置(ｘ、ｙ)を保持する
var playerSprite; //プレイヤーのスプライト
var leftBtn; //左ボタン
var rightBtn; //右ボタン
var jumpBtn; //ジャンプ
var winSize;
var jump;
var jump_attack;
var attack;
var walk;
var keyone = false;

var GameScene = cc.Scene.extend({
   onEnter: function() {
      this._super();

      winSize = cc.director.getWinSize();

      var background = new backgroundLayer();
      this.addChild(background);
      var level = new levelLayer();
      this.addChild(level);
      var player = new playerLayer();
      this.addChild(player);
      var enemys = new enemyLayer();
      this.addChild(enemys);
   }
});


var backgroundLayer = cc.Layer.extend({
   ctor: function() {
      this._super();

      var backgroundSprite = cc.Sprite.create(res.background_back_png);
      var size = backgroundSprite.getContentSize();
      //console.log(size);
      this.addChild(backgroundSprite);
      //console.log(winSize.width,winSize.height);
      backgroundSprite.setPosition(winSize.width / 2, winSize.height / 2);
      //背景画像を画面の大きさに合わせるためのScaling処理
      backgroundSprite.setScale(winSize.width / size.width/0.5, winSize.height / size.height);
      //足場
      var background_frontSprite = cc.Sprite.create(res.background_front_png);
      this.addChild(background_frontSprite);
      background_frontSprite.setPosition(winSize.width / 2, winSize.height/4.5);
      background_frontSprite.setScale(winSize.width / size.width/0.5, winSize.height / size.height);
      //ぶら下がり
      var ui_panels = cc.Sprite.create(res.ui_panels_png);
      this.addChild(ui_panels);
      ui_panels.setPosition(winSize.width / 2, winSize.height/0.95);
      ui_panels.setScale(winSize.width / size.width/1.2, winSize.height / size.height/1.5);

   }

});

var levelLayer = cc.Layer.extend({
   ctor: function() {
      this._super();
      var size = cc.director.getWinSize();
      for (i = 0; i < 7; i++) {　　　　　　
         for (j = 0; j < 16; j++) {
            switch (level[i][j]) {
               case 1:
                  var groundSprite = cc.Sprite.create(res.ground_png);
                  groundSprite.setPosition(tileSize / 2 + tileSize * j, 96 * (7 - i) - tileSize / 2);
                  this.addChild(groundSprite);
                  break;
               case 2:
                  var blockSprite = cc.Sprite.create(res.block_png);
                  blockSprite.setPosition(tileSize / 2 + tileSize * j, 96 * (7 - i) - tileSize / 2);
                  this.addChild(blockSprite);
                  break;
            }
         }
      }
   }
});


var player;
var playerLayer = cc.Layer.extend({
   ctor: function() {
      this._super();
      player = new Player();
      this.addChild(player);
      //ショッピングカートを操作するレイヤー

      //左ボタン
      leftBtn = cc.Sprite.create(res.leftbutton_png);
      this.addChild(leftBtn, 0);
      leftBtn.setPosition(60, 40);
      leftBtn.setOpacity(128);
      leftBtn.setTag(1);
      //右ボタン
      rightBtn = cc.Sprite.create(res.rightbutton_png);
      this.addChild(rightBtn, 0);
      rightBtn.setPosition(150, 40);
      rightBtn.setOpacity(128);
      rightBtn.setTag(2);

      //ジャンプボタン
      jumpBtn = cc.Sprite.create(res.rightbutton_png);
      jumpBtn.setRotation(-90);
      this.addChild(jumpBtn, 0);
      jumpBtn.setPosition(winSize.width - 60, 40);
      jumpBtn.setOpacity(128);
      jumpBtn.setTag(3);


      cc.eventManager.addListener(listener, leftBtn);
      cc.eventManager.addListener(listener.clone(), rightBtn);
      cc.eventManager.addListener(listener.clone(), jumpBtn);

      cc.eventManager.addListener(keylistener, this);

   }

});


var Player = cc.Sprite.extend({
   ctor: function() {
      this._super();
      this.initWithFile(res.bat_frames);
      this.workingFlag = false;
      this.xSpeed = 0;
      this.ySpeed = 0;
      this.jumpFlag = false;
      for (i = 0; i < 7; i++) {　　　　　　
         for (j = 0; j < 16; j++) {
            if (level[i][j] == 3) {
               this.setPosition(tileSize / 2 + tileSize * j, 96 * (7 - i) - tileSize / 2);
               playerPosition = {
                  x: j,
                  y: i
               };
            }
         }
      }
      var animationframe = [];
      var playerframe = [];
      //スプライトフレームを格納する配列
      var texture = cc.textureCache.addImage(res.player_png);
      for (i = 0; i < 4; i++) {
        for (j = 0; j < 4; j++) {
          //スプライトフレームを作成
          var frame = new cc.SpriteFrame.createWithTexture(texture, cc.rect(192 * j, 128 * i, 192, 128));
          //スプライトフレームを配列に登録
          animationframe.push(frame);
          playerframe.push(frame);
          if(i == 1 && j == 2 || i == 2 && j == 2){
            j++;
          }
        }
        //スプライトフレームの配列を連続再生するアニメーションの定義
        var animation = new cc.Animation(animationframe, 0.2);
        //永久ループのアクションを定義
        if(i == 0)
        jump_attack = new cc.RepeatForever(new cc.animate(animation));
        if(i == 1)
        jump = new cc.RepeatForever(new cc.animate(animation));
        if(i == 2)
        attack = new cc.RepeatForever(new cc.animate(animation));
        if(i == 3)
        walk  = new cc.RepeatForever(new cc.animate(animation));
        animationframe = animationframe.slice( 0,0 ) ;
      }
      //実行
      cc.Follow(player);
      this.runAction(attack);
      this.stopAction(attack);
      this.runAction(jump);
      this.stopAction(jump);
      this.runAction(jump_attack);
      this.stopAction(jump_attack);
      this.runAction(walk);

      this.scheduleUpdate();
   },


   //移動のため
   update: function(dt) {
      console.log(this.jumpFlag, this.ySpeed);

      if (this.xSpeed > 0) { //スピードが正の値（右方向移動）
         //　向きを判定させる
         this.setFlippedX(false);
      }
      if (this.xSpeed < 0) { //スピードが負の値（左方向移動）
         this.setFlippedX(true);
      }
      //プレイヤーを降下させる処理　ジャンプボタンが押されてないときで、プレイヤが空中にある場合
      if (this.jumpFlag == false) {
         if (this.getPosition().y < tileSize * 1.6) this.ySpeed = 0;
         else this.ySpeed = this.ySpeed - 0.5;
      }
      
      //位置を更新する
      this.setPosition(this.getPosition().x + this.xSpeed, this.getPosition().y + this.ySpeed);
   }

});


//タッチリスナーの実装
var listener = cc.EventListener.create({
   event: cc.EventListener.TOUCH_ONE_BY_ONE,
   // swallowTouches: true,

   onTouchBegan: function(touch, event) {
      var target = event.getCurrentTarget();
      var location = target.convertToNodeSpace(touch.getLocation());
      var spriteSize = target.getContentSize();
      var spriteRect = cc.rect(0, 0, spriteSize.width, spriteSize.height);
      //タッチした場所が、スプライトの内部に収まっていたら
      if (cc.rectContainsPoint(spriteRect, location)) {
         console.log(target.getTag() + "Btnがタッチされました");

         //タッチしたスプライトが左ボタンだったら
         if (target.getTag()　 == 1) {
            player.xSpeed = -2.5;
            leftBtn.setOpacity(255);
            rightBtn.setOpacity(128);
            animestop();
            player.runAction(walk);
         } else {
            //タッチしたスプライトが右ボタンだったら
            if (target.getTag()　 == 2) {
               player.xSpeed = 2.5;
               rightBtn.setOpacity(255);
               leftBtn.setOpacity(128);
               animestop();
               player.runAction(walk);
            }
         }
         //タッチしたスプライトがジャンプボタンだったら
         if (target.getTag()　 == 3) {
            if (player.jumpFlag == false && player.ySpeed == 0) player.ySpeed = 1;
            player.jumpFlag = true;
            jumpBtn.setOpacity(255);
            animestop();
            player.runAction(jump);
         }
      }
      return true;
   },
   //タッチを止めたときは、移動スピードを0にする
   onTouchEnded: function(touch, event) {
      player.jumpFlag = false;
      player.xSpeed = 0;
      //player.ySpeed = 0;
      leftBtn.setOpacity(128);
      rightBtn.setOpacity(128);
      jumpBtn.setOpacity(128);
   }

});

//キーボードリスナーの実装
var keylistener = cc.EventListener.create({
   event: cc.EventListener.KEYBOARD,
   // swallowTouches: true,

   onKeyPressed: function(keyCode, event) {
     if(keyone == false){
     if(keyCode == 87){
       animestop();
       if(player.ySpeed != 0){
         player.runAction(jump_attack);
       }else{
         player.runAction(attack);
       }
     }
      if (keyCode == 65) { // a-Keyで左に移動
         player.xSpeed = -2.5;
         leftBtn.setOpacity(255);
         rightBtn.setOpacity(128);
         animestop();
         player.runAction(walk);
      }
      if (keyCode == 68) { // d-Keyで左に移動
         player.xSpeed = 2.5;
         rightBtn.setOpacity(255);
         leftBtn.setOpacity(128);
         animestop();
         player.runAction(walk);
      }
      if (keyCode == 32 || keyCode == 38) { // スペースキーか上矢印キーでジャンプ
         if (player.jumpFlag == false && player.ySpeed == 0 && keyone == false) player.ySpeed = 9;
         else player.ySpeed = player.ySpeed-0.5;
         player.jumpFlag = true;
         jumpBtn.setOpacity(255);
         animestop();
         player.runAction(jump);
       }
      }
      if(keyone == true){
      if (keyCode == 65) { // a-Keyで左に移動
          player.xSpeed = -2.5;
          leftBtn.setOpacity(255);
          rightBtn.setOpacity(128);
      }
      if (keyCode == 68) { // d-Keyで左に移動
          player.xSpeed = 2.5;
          rightBtn.setOpacity(255);
          leftBtn.setOpacity(128);
        }
        if (keyCode == 32 || keyCode == 38) { // スペースキーか上矢印キーでジャンプ
           if (player.jumpFlag == false && player.ySpeed == 0 && keyone == true) player.ySpeed = 9;
           else player.ySpeed = player.ySpeed-0.5;
           player.jumpFlag = true;
           jumpBtn.setOpacity(255);
           animestop();
           //player.playerframe[10]
           player.runAction(jump);
         }
      }
      keyone = true;
      return true;
   },
   onKeyReleased: function(keyCode, event) {
      player.jumpFlag = false;
      player.xSpeed = 0;
      keyone = false;
      //player.ySpeed = 0;
      leftBtn.setOpacity(128);
      rightBtn.setOpacity(128);
      jumpBtn.setOpacity(128);
   },

});
//animationstop関数
function animestop(){
  player.stopAction(walk);
  player.stopAction(jump);
  player.stopAction(jump_attack);
  player.stopAction(attack);
}
