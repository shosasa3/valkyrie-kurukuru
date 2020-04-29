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
			self.exit( "main" );	//go to MainScene
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


		this.rotFlg = false;	//回転フラグ
		this.checkFlg = false;	//判定フラグ
		this.stopZ  = null;	//回転を止めた時のZ軸
		

		//画面をクリックしたら
		this.onpointstart = function( e ){
		};

		//値をラベルで一応表示
		this.accelRotate = 0;
		this.accelRotateLabel = Label( this.accelRotate ).addChildTo( this ).setPosition(this.gridX.center(), this.gridY.center() );
		this.accelOrientation = 0;
		this.accelOrientationLabel = Label( "alpha:"+this.accelOrientation ).addChildTo( this ).setPosition(this.gridX.center(), this.gridY.center()+40 );
		this.accelOrientationBeta = 0;
		this.accelOrientationBetaLabel = Label( "beta:"+this.accelOrientationBeta ).addChildTo( this ).setPosition(this.gridX.center(), this.gridY.center()+80 );
		this.accelOrientationGamma = 0;
		this.accelOrientationGammaLabel = Label( "gamma:"+this.accelOrientationGamma ).addChildTo( this ).setPosition(this.gridX.center(), this.gridY.center()+120 );


		//@check ラベル
		this.testClearLabel = Label( "クリアしました。" ).addChildTo( this ).setPosition(this.gridX.center(), this.gridY.center()+240 );
		this.testNotClearLabel = Label( "失敗です" ).addChildTo( this ).setPosition(this.gridX.center(), this.gridY.center()+240 );
		this.testClearLabel.hide();
		this.testNotClearLabel.hide();


	}, //end init


	//更新処理
	update: function( app ) {
	
		let accel = app.accelerometer;	//傾きセンサー取得

		let rot  = accel.rotation;
		let ori  = accel.orientation;	//alphaでz軸

		this.accelOrientation = ori.alpha;
		this.accelOrientationBeta = ori.beta;
		this.accelOrientationGamma = ori.gamma;
		

		//回転スタート
		if( this.checkFlg == false )
		{
			if( ori.alpha >= 100 && ori.alpha <=120 )
			{
				this.rotFlg = true;
				this.stopZ = ori.alpha;
			}
			if( ori.alpha >= 240 && ori.alpha <=280 )
			{
				this.rotFlg = true;
				this.stopZ = ori.alpha;
			}
		}

		//回転開始
		if( this.rotFlg )
		{
			this.sprite.rotation += 12;
		}

		//回転止める
		if( this.rotFlg )
		{
			let check = Math.abs( this.stopZ - ori.alpha );
			if( check >= 35 )
			{
				this.rotFlg = false;
				this.checkFlg = true;
			}
		}

		//判定フラグ
		if( this.checkFlg )
		{
			if( this.sprite.rotation === 0 )
			{
				this.testClearLabel.show();
			}
			else
			{
				this.testNotClearLabel.show();
			}
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

