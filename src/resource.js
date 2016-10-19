var res = {
   player_sheet: "res/playerSheet_96x192.png",
   player_plist: "res/player.plist",
   player01_png: "res/player01_96x96.png",
   player02_png: "res/player02_96x96.png",
   ground_png: "res/ground_96x96.png",
   background_png: "res/background01.jpg",
   block_png: "res/block.png",
   bat_frames: "res/bat_frames.png",
   leftbutton_png: "res/leftbutton.png",
   rightbutton_png: "res/rightbutton.png",

};

var g_resources = [];
for (var i in res) {
   g_resources.push(res[i]);
}
