/***********************************************************


	仮面ライダーバルキリー変身クルクルゲーム
	#傾きセンサーを使ってのテストゲーム


***********************************************************/


//phina.js をグローバル領域に展開
phina.globalize();


var DEBUG_FLG = false;	//デバッグフラグ


/******************************************

	アセット関連

******************************************/
//画像登録
var ASSETS = {
	// 画像
	image: {
		'numbers': './images/numbers.jpg',	//クリアタイム数字画像
		'pkey': './images/pkey.png',	//プログライズキー
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


	TitleScene class


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
		this.backgroundColor = 'white';

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
			self.exit( "ready" );	//go to ReadyScene
		};


	}, //end init


	//更新処理
	update: function( app ) {


	}, //end update

});


/**********************************************************


	ReadyScene class


**********************************************************/
phina.define("ReadyScene", {

	// 継承
	superClass: 'DisplayScene',

	//初期化
	init: function() {

		// 親クラス初期化
		this.superInit();

		let self = this;	//参照用

		// 背景色
		this.backgroundColor = 'white';


		// スプライト
		this.sprite = Sprite('pkey').addChildTo( this );
		// 初期位置
		this.sprite.x = this.gridX.center();
		this.sprite.y = this.gridY.center() + 50;


		this.angle = Math.round( Math.random() * 360 );	//0~360の角度で
		this.sprite.rotation = this.angle;
		this.sprite.alpha = 0.5;	//一応透明度を下げておく


		//ラベル
		this.Label1 = Label( "この位置で止めてみせろ！" ).addChildTo( this ).setPosition( this.gridX.center(), 100 );
		this.alphaspLabel1 = -0.05;

		//ラベル透明処理
		this.Label1.update = function(){

			self.Label1.alpha += self.alphaspLabel1;
			if( self.Label1.alpha < 0.05 )  self.alphaspLabel1 *= -1;
			if( self.Label1.alpha > 0.95 )  self.alphaspLabel1 *= -1;
		};


		//始めるボタン
		this.sButton = Button({
			text : '始める',
			fill : '#3D9AC1',
			fontColor: '#ffffff',
			fontSize: 32,

		}).addChildTo( this ).setPosition( this.gridX.center(),this.gridY.center()+380 );

		
		//スタートボタンが押されたら?
		this.sButton.onpointstart = function() {

			self.exit( "main",{angle: self.angle} );	//go to MainScene
		};


	}, //end init


	//更新処理
	update: function( app ) {


	}, //end update


});//end readyScene



/**********************************************************


	MainScene class


**********************************************************/
phina.define("MainScene", {

	// 継承
	superClass: 'DisplayScene',

	//初期化
	init: function( param ) {

		// 親クラス初期化
		this.superInit( param );

		// 背景色
		this.backgroundColor = 'white';

		// スプライト画像作成
		this.sprite = Sprite('pkey').addChildTo( this );
		// 初期位置
		this.sprite.x = this.gridX.center();
		this.sprite.y = this.gridY.center();
		this.sprite.rotation = 0;	//角度を0度にしておく


		let self = this;	//thisを参照しておく


		this.rotFlg = 0;	//回転フラグ
		this.checkFlg = 0;	//判定フラグ
		this.startZ  = null;	//回転を止めた時のZ軸
		this.clearTimes = 0;	//連続で変身成功した回数
		this.correctAng = param.angle;	//正解の角度
		

		//ラベル
		this.clearLabel = Label( "変身成功！" ).addChildTo( this ).setPosition(this.gridX.center(), this.gridY.center()+240 );
		this.notClearLabel = Label( "変身失敗..." ).addChildTo( this ).setPosition(this.gridX.center(), this.gridY.center()+240 );
		this.clearLabel.hide();
		this.notClearLabel.hide();	//ラベルを隠す
		this.notClearLabel.setScale( 5.0,5.0 );	//拡大しておく


		this.clearTimesLabel = Label( "変身成功:" ).addChildTo( this ).setPosition(this.gridX.center(), this.gridY.center()+270 );	//変身成功回数ラベル
		this.clearTimesLabel.hide();


		//ボタン
		this.replayButton = Button({
			text : 'もう1回',
			fill : '#3D9AC1',
			fontColor: '#ffffff',
			fontSize: 30,

		}).addChildTo( this ).setPosition( this.gridX.center(),this.gridY.center()+300 );
		this.replayButton.hide();

		//もしボタンが押されたら?
		this.replayButton.onclick = function(){

			self.checkFlg = 0;
			self.sprite.rotation = 0;
		};
		

		//リスタートボタン
		this.restartButton = Button({
			text : 'もう一度プレイする',
			fill : '#3D9AC1',
			fontColor: '#ffffff',
			fontSize: 25,
			width: 250,

		}).addChildTo( this ).setPosition( this.gridX.center(),this.gridY.center()+300 );
		this.restartButton.hide();

		//もしリスタートボタンが押されたら?
		this.restartButton.onclick = function(){

			self.checkFlg = 0;
			self.clearTimes = 0;
			self.sprite.rotation = 0;
		};


		//画面をクリックしたら
		this.onpointstart = function( e ){
		};


		//デバッグ処理
		if( DEBUG_FLG )
		{
			//値をラベルで一応表示
			this.accelRotate = 0;
			this.accelRotateLabel = Label( this.accelRotate ).addChildTo( this ).setPosition(this.gridX.center(), this.gridY.center() );
			this.accelOrientation = 0;
			this.accelOrientationLabel = Label( "alpha:"+this.accelOrientation ).addChildTo( this ).setPosition(this.gridX.center(), this.gridY.center()+40 );
			this.accelOrientationBeta = 0;
			this.accelOrientationBetaLabel = Label( "beta:"+this.accelOrientationBeta ).addChildTo( this ).setPosition(this.gridX.center(), this.gridY.center()+80 );
			this.accelOrientationGamma = 0;
			this.accelOrientationGammaLabel = Label( "gamma:"+this.accelOrientationGamma ).addChildTo( this ).setPosition(this.gridX.center(), this.gridY.center()+120 );
			this.accelGravityLabelX = Label().addChildTo( this ).setPosition(this.gridX.center(), this.gridY.center()+150 );
			this.accelGravityLabelY = Label().addChildTo( this ).setPosition(this.gridX.center(), this.gridY.center()+180 );
			this.accelGravityLabelZ = Label().addChildTo( this ).setPosition(this.gridX.center(), this.gridY.center()+210 );
		}


	}, //end init


	//更新処理
	update: function( app ) {
	
		let accel = app.accelerometer;	//傾きセンサー取得

		let rot  = accel.rotation;
		let ori  = accel.orientation;	//alphaでz軸
		let grav = accel.gravity;	//重力加速度



		//回転スタートチェック
		if( this.checkFlg == 0 )
		{
			if( ori.alpha >= 65 && ori.alpha <= 140 )
			{
				this.rotFlg = 1;
				this.startZ = ori.alpha;
			}
			if( ori.alpha >= 220 && ori.alpha <= 280 )
			{
				this.rotFlg = 2;
				this.startZ = ori.alpha;
			}
		}

		//回転中..
		if( this.rotFlg === 1 )
		{
			this.sprite.rotation -= 20;
			if( this.sprite.rotation <= -360 ) this.sprite.rotation += 360;

		}
		if( this.rotFlg === 2 )
		{
			this.sprite.rotation += 20;
			if( this.sprite.rotation >= 360 ) this.sprite.rotation -= 360;
		}
		

		//回転止める
		if( this.rotFlg != 0 )
		{
			let check = Math.abs( this.startZ - ori.alpha );	//差をチェック
			if( check >= 20 )
			{
				this.rotFlg   = 0;
				this.checkFlg = 1;
			}
		}

		//判定フラグ
		if( this.checkFlg == 1 )
		{
			//もし成功したら？
			if( this.sprite.rotation === this.correctAng )	//正解の角度のピッタリ合ったら
			{
				if( this.checkFlg == 1 )
				{
					this.clearLabel.show();

					this.clearTimes ++;	//クリア回数をプラス
					this.clearTimesLabel.text = "変身成功回数:"+this.clearTimes;
					this.clearTimesLabel.show();

					this.replayButton.show();
				}
			}
			//もし失敗したら？
			else
			{
				if( this.checkFlg == 1 )
				{
					this.checkFlg = 2;	//何回もアニメーションするのを防ぐため

					this.notClearLabel.show();
					this.notClearLabel.tweener.scaleTo( 1.0, 500 ).play();

					this.restartButton.show();
				}

			}
		}

		if( this.checkFlg == 0 )
		{
			this.clearLabel.hide();
			this.notClearLabel.hide();

			this.replayButton.hide();
			this.restartButton.hide();

			this.clearTimesLabel.hide();

		}



		//デバッグラベル更新
		if( DEBUG_FLG )
		{
			this.accelOrientationLabel.text = "alpha:"+ ori.alpha;
			this.accelOrientationBetaLabel.text = "beta:"+ ori.beta;
			this.accelOrientationGammaLabel.text = "gamma:"+ ori.gamma;
			this.accelGravityLabelX.text ="x:"+grav.x;
			this.accelGravityLabelY.text ="y:"+grav.y;
			this.accelGravityLabelZ.text ="z:"+grav.z;
		}


	}, //end update


});//end MainScene



/**********************************************************


	phina.main
	*メイン処理


**********************************************************/
phina.main( function() {


	// アプリケーションを生成
	var app = GameApp({

		// MainScene から開始
		startLabel: 'title',

		// アセット読み込み
		assets: ASSETS,

		//独自scene
		scenes: [
		   {
			className: 'TitleScene',
			label: 'title',
		   },

		   {
			className: 'MainScene',
			label: 'main',
		   },

		   {
			className: 'ReadyScene',
			label: 'ready',
		   },

		]

	});

	
	// 実行
	app.run();
});

