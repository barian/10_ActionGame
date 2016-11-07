var TitleLayer = cc.Layer.extend({
    ctor: function() {
        this._super();

        var size = cc.director.getWinSize();
        /*
                var sprite = cc.Sprite.create(res.HelloWorld_png);
                sprite.setPosition(size.width / 2, size.height / 2);
                sprite.setScale(0.8);
                this.addChild(sprite, 0);
        */
        var background = cc.Sprite.create(res.background_back_png);
        background.setPosition(size.width/2,size.height/2);
        background.setScale(1.5,1.2);
        this.addChild(background);

        var title = cc.Sprite.create(res.title_png);
        title.setPosition(size.width / 2, size.height / 2);
        title.setScale(1);
        this.addChild(title);

        var btn_play = new playbtn();
        btn_play.setPosition(size.width / 2, size.height / 4);
        btn_play.setScale(1);
        this.addChild(btn_play);

        var  sparkle = new kirakira();
        sparkle.setPosition(size.width/3 ,size.height/5);
        sparkle.setScale(1);
        sparkle.setOpacity(128);
        this.addChild(sparkle);

    },
});

var kirakira = cc.Sprite.extend({
  ctor:function(){
    this._super();
    this.initWithFile(res.bat_frames);
    var kiraframe = [];
    //スプライトフレームを格納する配列
    var texture = cc.textureCache.addImage(res.kira_png);
    for (i = 0; i < 1; i++) {
      for (j = 0; j < 5; j++) {
        //スプライトフレームを作成
        var frame = new cc.SpriteFrame.createWithTexture(texture, cc.rect(64 * j, 64 * i, 64, 64));
        //スプライトフレームを配列に登録
        kiraframe.push(frame);
      }
    }
    //スプライトフレームの配列を連続再生するアニメーションの定義
    var animation = new cc.Animation(kiraframe, 0.2);
    //永久ループのアクションを定義
    kiraani = new cc.RepeatForever(new cc.animate(animation));
    this.runAction(kiraani);
  }
});
//タイトルボタンの拡張
var playbtn = cc.Sprite.extend({
    ctor:function() {
        this._super();
        this.initWithFile(res.btn_play_png);
        cc.eventManager.addListener(gameplay, this);
    }
});
var gameplay = cc.EventListener.create({
    event: cc.EventListener.TOUCH_ONE_BY_ONE,
    swallowTouches: true,
    onTouchBegan: function (touch, event) {
            var target = event.getCurrentTarget();
            var location = target.convertToNodeSpace(touch.getLocation());
            var targetSize = target.getContentSize();
            var targetRectangle = cc.rect(0, 0, targetSize.width, targetSize.height);
            if (cc.rectContainsPoint(targetRectangle, location)) {
              var gamescene = cc.TransitionFadeDown.create(0.5, new GameScene());
              cc.director.runScene(gamescene);
            }
    }
});
var TitleScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var titlelayer = new TitleLayer();
        this.addChild(titlelayer);
    }
});
