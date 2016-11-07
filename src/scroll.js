var ScrollLayer = cc.Layer.extend({
    ctor : function () {
        this._super();
        layer = new CharaLayer();
layer.setContentSize(cc.size(800, 2000));
layer.init();

var size = cc.director.getWinSize();
this.scrollView = cc.ScrollView.create(size, layer);

//スクロールのバウンスを行う
this.scrollView.setBounceable(true);

//scrollViewの初期位置を設定
this.scrollView.setContentOffset(cc.p(0,-1400),true);
this.scrollView.ignoreAnchorPointForPosition(true);
this.scrollView.setDelegate(this);

//スクロールできる方向
//cc.SCROLLVIEW_DIRECTION_VERTICAL = 1;     //上下
this.scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);

//スクロールViewを追加
this.addChild(this.scrollView);
    },
    update:function(dt){
        this._super();
        //this.mapNode.setPosition(this.mapNodeX+=1,this.mapNodeY);
    },
    registerWithTouchDispatcher : function () {
    },
    onTouchBegan : function (touch, e) {
    },
    scrollViewDidScroll : function (view) {
        //cc.log('scrollViewDidScroll');
    },
    scrollViewDidZoom : function (view) {
        //cc.log('scrollViewDidZoom');
    }
});

ScrollLayer.create = function () {
    var sg = new ScrollLayer();
    if (sg && sg.init()) {
        return sg;
    }
    return null;
};

var scrollScene = cc.Scene.extend({
   onEnter: function() {
      this._super();

      winSize = cc.director.getWinSize();

      var scroll = new ScrollLayer();
      this.addChild(scroll);
   }
});
