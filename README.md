# 10_CharacterAnimation

## 1.　schedule関数を利用しての歩行アニメーション
```
this.schedule(this.working,0.08);

},

working :function(event){
  this.workingFlag = (this.workingFlag==true)?false:true;

  if(this.workingFlag )   this.initWithFile(res.player01_png);
  else   this.initWithFile(res.player02_png);
}
```
## 2.　SpriteFrame　を利用しての歩行アニメーション
```
//スプライトフレームを格納する配列
var animationframe = [];
//スプライトフレームを作成
var frame1 = new cc.SpriteFrame(res.player01_png, cc.rect(0, 0, 96, 96));
var frame2 = new cc.SpriteFrame(res.player02_png, cc.rect(0, 0, 96, 96));
//スプライトフレームを配列に登録
animationframe.push(frame1);
animationframe.push(frame2);
//スプライトフレームの配列を連続再生するアニメーションの定義
var animation = new cc.Animation(animationframe, 0.08);
//永久ループのアクションを定義
var action = new cc.RepeatForever(new cc.animate(animation));
//実行
this.runAction(action);
```

## 3.　テクスチャアトラスを利用した歩行アニメーション
テクスチャアトラスとは? 複数の画像を1つの画像にまとめたものをアトラス画像といいます。そうすることで、画像ロード時に読み込むファイル数が減り、ロード時間が短くなります。
```
//スプライトフレームを格納する配列
var texture = cc.textureCache.addImage(res.player_sheet);
//スプライトフレームを作成
var frame1 = new cc.SpriteFrame.createWithTexture(texture, cc.rect(0, 0, 96, 96));
var frame2 = new cc.SpriteFrame.createWithTexture(texture, cc.rect(96, 0, 96, 96));
//スプライトフレームを配列に登録
var animationframe = [];
animationframe.push(frame1);
animationframe.push(frame2);
//スプライトフレームの配列を連続再生するアニメーションの定義
var animation = new cc.Animation(animationframe, 0.08);
//永久ループのアクションを定義
var action = new cc.RepeatForever(new cc.animate(animation));
//実行
this.runAction(action);
```
## 4.　plist（スプライトシート＋切り出し用のXML）を用いたアニメーション

直接画像ファイルから読み込む場合は画像ファイルのパスを引数で渡すだけなのですが、TxturePackerなど作成したスプライトシート(plist)を取り込む場合は手順が変わります。
```
// スプライトシートをスプライトフレームキャッシュに登録
cc.spriteFrameCache.addSpriteFrames(res.player_plist, res.player_sheet);

// スプライトフレームを取得 player01,player02はplistの中で定義されいいる
var frame1 = cc.spriteFrameCache.getSpriteFrame("player01");
var frame2 = cc.spriteFrameCache.getSpriteFrame("player02");

//スプライトフレームを配列に登録
var animationframe = [];
animationframe.push(frame1);
animationframe.push(frame2);
//スプライトフレームの配列を連続再生するアニメーションの定義
var animation = new cc.Animation(animationframe, 0.08);
//永久ループのアクションを定義
var action = new cc.RepeatForever(new cc.animate(animation));
//実行
this.initWithFile(res.player_sheet);
this.runAction(action);
```

## 5.　羽ばたきアニメーションをしながら、旋回飛行をするコウモリの実装
新規ﾌｧｲﾙ（EnemyBat.js）を追加し、index.htmlに記述する
```
<script type="text/javascript" src="cocos2d-js-v3.11.js" charset="UTF-8"></script>
<script type="text/javascript" src="src/resource.js" charset="UTF-8"></script>
<script type="text/javascript" src="src/EnemyBat.js" charset="UTF-8"></script>
<script type="text/javascript" src="src/app.js" charset="UTF-8"></script>
```
横2*縦2で構成されたスプライトシートからフレームを切り出して、アニメーションフレームに登録する処理
```
var animationframe = [];
//スプライトフレームを格納する配列
var texture = cc.textureCache.addImage(res.bat_frames);
for (i = 0; i < 2; i++) {
  for (j = 0; j < 2; j++) {
    //スプライトフレームを作成
    var frame = new cc.SpriteFrame.createWithTexture(texture, cc.rect(160 * j, 96 * i, 160, 96));
    //スプライトフレームを配列に登録
    animationframe.push(frame);
  }
}
//スプライトフレームの配列を連続再生するアニメーションの定義
var animation = new cc.Animation(animationframe, 0.08);
//永久ループのアクションを定義
var action = new cc.RepeatForever(new cc.animate(animation));
```

こうもりの八の字旋回運動の例、パラメータ設定を試行錯誤してください。

```
this.scheduleUpdate();

},

update: function(dt) {
this.FrameCount++;
//4フレームに1回　こうもりの移動計算する
if (this.FrameCount % 4 == 0) {
  //プレイヤーの位置をこうもりの位置の差を計算
  var offset_x = player.getPosition().x - this.getPosition().x;
  var offset_y = player.getPosition().y - this.getPosition().y;
  //offset_x = offset_x*Math.sin(offset_x);
  //蝙蝠のｘ移動速度をプレイヤとこうもりの間の距離の0.05倍にする
  var velocity_x = lerp(this.velocity.x, offset_x, 0.005);
  var velocity_y = this.velocity.y;
  //フォバリング高度より上なら下降させる。　降下下限高度より下にいたら、上昇させる
  if (this.getPosition().y > HoverHeight) velocity_y += -0.035;
  if (this.getPosition().y < RiseHeight) velocity_y += 0.05;
  //プレイヤーの位置よりできるだけ下にならないように
  if (this.getPosition().y < player.y + 20) velocity_y += 0.05;
  //8の字旋回軌道をsin計算で適当に補正
  velocity_y += 0.075 * Math.sin(this.FrameCount * 0.015) * Math.sin(this.FrameCount * 0.04);
  console.log(velocity_x, velocity_y);

  this.velocity.x = velocity_x;
  this.velocity.y = velocity_y;

  //  console.log(MoveDirection, this.velocity.x, offset.x);
  if (this.velocity.x <= 0)
    this.setFlippedX(true);
  if (this.velocity.x > 0)
    this.setFlippedX(false);

  this.setPosition(this.getPosition().x + this.velocity.x, this.getPosition().y + this.velocity.y);
}

}
```
線形補間の関数　よく使うので覚えておいてください。

```
});
//始点、終点、の間で 0～1.0の割合の位置を返す関数
function lerp(fStart, fEnd, fPercent) {
return fStart + ((fEnd - fStart) * fPercent);
}

```


## 6.　シングルタッチによるプレイヤの左右移動、ジャンプの処理

`playerLayer`に左ボタン、右ボタン、ジャンプボタンを実装する
後で、リスナーの中でどのボタンが押されたかを判定するために、setTag（番号）を
用いて、tag情報を設定する
```
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
```
Playerのクラスに、移動スピードやジャンプ中を表すフラグを用意する
```
this.xSpeed = 0;
this.ySpeed = 0;
this.jumpFlag = false;
```
さらに、update関数が実行するように実装
```
      this.scheduleUpdate();
   },
```
現在位置のxSpeed ,ySpeedで更新する
```
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
 ```
 //タッチリスナーの実装
  ```
 var listener = cc.EventListener.create({
    event: cc.EventListener.TOUCH_ONE_BY_ONE,
    // swallowTouches: true,

    onTouchBegan: function(touch, event) {
       var target = event.getCurrentTarget();
       var location = target.convertToNodeSpace(touch.getLocation());
       var spriteSize = target.getContentSize();
       var spriteRect = cc.rect(0, 0, spriteSize.width, spriteSize.height);

       if (cc.rectContainsPoint(spriteRect, location)) {
          console.log(target.getTag() + "Btnがタッチされました");

          //タッチしたスプライトが左ボタンだったら
          if (target.getTag()　 == 1) {
             player.xSpeed = -2.5;
             leftBtn.setOpacity(255);
             rightBtn.setOpacity(128);
          } else {
             //タッチしたスプライトが右ボタンだったら
             if (target.getTag()　 == 2) {
                player.xSpeed = 2.5;
                rightBtn.setOpacity(255);
                leftBtn.setOpacity(128);
             }
          }
          //タッチしたスプライトがジャンプボタンだったら
          if (target.getTag()　 == 3) {
            //ジャンプ中でなかったら上昇速度を設定
            if (player.jumpFlag == false && player.ySpeed == 0) player.ySpeed = 9;
             player.jumpFlag = true;//ジャンプ中を表すflagをon
             jumpBtn.setOpacity(255);
          }
       }
       return true;
    },
    //タッチを止めたときは、移動スピードを0にする
    onTouchEnded: function(touch, event) {
       player.jumpFlag = false;
       player.xSpeed = 0;
       leftBtn.setOpacity(128);
       rightBtn.setOpacity(128);
       jumpBtn.setOpacity(128);
    }

 })
  ```
###  7. 課題  アクションゲームシーンを作成せよ
kadai_assetsを解凍し、アクションゲームのシーンを実装せよ。
プレイヤ、各種モンスターの表示、UIを表示、ハート、コインを表示

＜シーン＞
滝が落ちる前に横たわる倒木をプレイヤーキャラクターが渡る

＜背景＞
background_back.png　　画面中央に配置する　
background_light_shafts.png　背景に薄くもやをかける
background_front.png　 画面の下方に配置する
curtain.png　左右（画面の端）に配置する
ui_panels.png  得点版
ui_gauge_fill.png　ハートゲージ（黄色）　必殺技ゲージ（緑）　消化分（茶色）

背景は画面より大きく、画面にフィットさせないで、プレイヤが移動したときに、スライド可能にする。


＜タイトルシーン＞
title.png　　タイトルロゴ
sparkle_frames.png　タイトルロゴをキラキラさせる

＜登場するモンスター＞
ゾンビ　4×2 8フレームアニメーション
緑色　スライム　４×４ 16フレームアニメーション
黄色　スライム　４×３　12フレームアニメーション
赤色　スライム　４×３　12フレームアニメーション
こうもり　2×2　4フレームアニメーション

＜登場するアイテム＞
ハート　茶色、シルバー、ゴールド　それぞれ8フレームアニメーション
コイン

＜プレイヤー＞
- 立ち止まっているプレイヤー"Idle"　4,5フレームのループ,ループ間隔30フレーム時間  

- 歩いてるプレイヤー"Walk"　0,1,2,3,4フレームのループ、ループ間隔60フレーム時間  
※Aキー　、dキー  

- 攻撃中のプレイヤー"Attack"　5,6,7フレーム,ループ間隔6フレーム,6フレーム時間で実行する  
※wキー  

- ジャンプしているプレイヤー"Jump"　8,9,10フレーム、ループしない,0.2秒で実行する  
※スペースキーもしくは上矢印キー  

- ジャンプ攻撃中のプレイヤー"JumpAttack" 11,12,13フレーム,ループしない,ループしない6フ
レーム時間で実行する  
※ジャンプ中にwキー押す  

- 落下中のプレイヤー"Fall"　9,10フレーム、ループしない　30フレーム時間で実行する  

<その他>
今回の課題では使用しないアイテムとして
必殺技　：ビール
プレイヤーが死んだときの画像効果：刀が回転してすこし飛んで落下する
プレイヤがモンスターを切ったときのエフェクト
プレイヤーが着地したときのエフェクト
