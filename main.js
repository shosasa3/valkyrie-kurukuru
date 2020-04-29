/***********************************************************


	仮面ライダーバルキリー変身クルクルゲーム
	#傾きセンサーを使ってのテストゲーム


***********************************************************/


//phina.js をグローバル領域に展開
phina.globalize();


/******************************************

	アセット関連

******************************************/
//画像登録
var ASSETS = {
	// 画像
	image: {
		'numbers': './images/numbers.jpg',	//クリアタイム数字画像
	},
};


//傾きセンサーを許可するための処理(ios13~)
function request_permission()
{

	 if (
		 DeviceMotionEvent &&
		 DeviceMotionEvent.requestPermission &&
		 typeof DeviceMotionEvent.requestPermission === 'function'
	 ) {
	 	DeviceMotionEvent.requestPermission();
	 }
	 if (
		 DeviceOrientationEvent &&
		 DeviceOrientationEvent.requestPermission &&
		 typeof DeviceOrientationEvent.requestPermission === 'function'
	 ) {
	 	DeviceOrientationEvent.requestPermission();
	 }

	let b = document.getElementById("button");
	b.style.display = "none";

	alert("傾きセンサー使えます。");


}//end function request_permission()


/**********************************************************

	@TitleScene class

**********************************************************/
phina.define("TitleScene", {

	// 継承
	superClass: 'DisplayScene',

	//初期化
	init: function() {

		// 親クラス初期化
		this.superInit();

		let self = this;

		// 背景色
		this.backgroundColor = 'skyblue';

		//スタートボタン
		this.sButton = Button({
			text : 'START',
			fill : '#3D9AC1',
			fontColor: '#ffffff',
			fontSize: 30,

		}).addChildTo( this ).setPosition( this.gridX.center(),this.gridY.center()+300 );

		
		//スタートボタンが押されたら?
		this.sButton.onpointstart = function() {

			//ボタンがクリックされたら？
			self.exit();	//go to MainScene
		};


	}, //end init


	//更新処理
	update: function( app ) {


	}, //end update

});



/**********************************************************

	@MainScene class

**********************************************************/
phina.define("MainScene", {

	// 継承
	superClass: 'DisplayScene',

	//初期化
	init: function( app ) {

		// 親クラス初期化
		this.superInit();

		// 背景色
		this.backgroundColor = 'skyblue';

		// スプライト画像作成
		this.sprite = Sprite('numbers').addChildTo( this );
		// 初期位置
		this.sprite.x = this.gridX.center();
		this.sprite.y = this.gridY.center();

		this.zStart = null;
		this.rotFlg = false;


		//画面をクリックしたら
		this.onpointstart = function( e ){
		};

		//値をラベルで一応表示
		this.accelRotate = 0;
		this.accelRotateLabel = Label( this.accelRotate ).addChildTo( this ).setPosition(this.gridX.center(), this.gridY.center() );
		this.accelOrientation = 0;
		this.accelOrientationLabel = Label( this.accelOrientation ).addChildTo( this ).setPosition(this.gridX.center(), this.gridY.center()+40 );


	}, //end init


	//更新処理
	update: function( app ) {
	
		let accel = app.accelerometer;	//傾きセンサー取得

		let rot  = accel.rotation;
		let ori  = accel.orientation;	//alphaでz軸

		if( this.zStart == null ) this.zStart = ori.alpha;
		
		this.accelRotateLabel.text = this.rotFlg;
		this.accelOrientationLabel.text = ori.alpha;

		let check = Math.abs( this.zStart - ori.alpha );
		if( check >= 30 ) this.rotFlg = true;

		if( this.rotFlg )
		{
			this.sprite.rotation += 12;
		}
		

	}, //end update

});


/**********************************************************

	@Main
	メイン処理

**********************************************************/
phina.main( function() {


	// アプリケーションを生成
	var app = GameApp({

		// MainScene から開始
		startLabel: 'title',

		// アセット読み込み
		assets: ASSETS,
	});

	
	// 実行
	app.run();
});

