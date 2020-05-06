/***********************************************************


	仮面ライダーバルキリー変身クルクルゲーム
	#傾きセンサーを使ってのテストゲーム


***********************************************************/


//phina.js をグローバル領域に展開
phina.globalize();


var DEBUG_FLG = true;	//デバッグフラグ
var FONT_FAMILY = "'游明朝','YuMincho','Hiragino Mincho ProN W3','ヒラギノ明朝 ProN W3','Hiragino Mincho ProN','HG明朝E','ＭＳ Ｐ明朝','ＭＳ 明朝','serif'"

var checkAccel = false;	//傾きセンサーを許可ボタンを押したか？(ios13~)


/******************************************

	アセット関連

******************************************/
//画像登録
var ASSETS = {
	// 画像
	image: {
		'pkey': './images/pkey.png',	//プログライズキー
		'yua': './images/yua_1.png',	//刃
		'repkeyL': './images/readypkey_left.png',	//準備プログライズキー
		'repkeyR': './images/readypkey_right.png',	//準備プログライズキー
		'titleyua': './images/title_yua.png',		//タイトル画面刃シルエット
		'titletext': './images/titletext.png',		//タイトル画面テキスト
	},
	sound: {
		'se1': './se/rotation.mp3',	//回転時
		'se2': './se/stop.mp3',		//止める時
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

	checkAccel = true;

	//DOM button form 処理
	let b = document.getElementById("button");
	b.style.display = "none";

	alert("傾きセンサー使えます。");


}//end function request_permission()


//リザルト刃セリフデータ
const yuaTextData = [

	{
		text: "..驚きだ..私より上手いんじゃないか..？",
	},
	{
		text: "上手くなってきたな。凄いぞ。",
	},
	{
		text: "練習の成果が出てきているな。",
	},
	{
		text: "少しは出来るようになったんじゃないか。",
	},
	{
		text: "まだまだ練習が必要だな。",
	},
	{
		text: "もう少し練習した方がいいぞ。",
	},
	{
		text: "ふっ..まだまだだな。",
	},
	{
		text: "..不破のような変身はダメだからな。",
	},

];



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
		
		this.score = 0;

		// 背景色
		this.backgroundColor = 'white';

		/*
		刃シルエット
		*/
		this.yua = Sprite('titleyua').addChildTo( this );
		// 初期位置
		this.yua.x = this.gridX.center() - 800;
		this.yua.y = this.gridY.center() - 40;


		/*
		テキストスプライト
		*/
		this.textSprite = Sprite('titletext').addChildTo( this );
		// 初期位置
		this.textSprite.x = this.gridX.center() + 800;
		this.textSprite.y = this.gridY.center() - 40;


		//スタートボタン
		this.sButton = Button({
			text : 'START',
			fill : '#fff52a',
			fontColor: '#000000',
			fontSize: 32,
			fontFamily: FONT_FAMILY,

		}).addChildTo( this ).setPosition( this.gridX.center(),this.gridY.center() + 320 );
		this.sButton.hide();	//隠す

		
		//スタートボタンが押されたら?
		this.sButton.onpointstart = function() {

			//ボタンがクリックされたら？
			self.exit( "ready",{score: self.score} );	//go to ReadyScene
		};

		//傾きセンサーを許可を促すラベル
		this.label = Label( "ボタンを押して傾きセンサーを許可してください。" ).addChildTo( this ).setPosition( this.gridX.center(),this.gridY.center() - 50 );
		this.label.fontSize = 24


	}, //end init


	//更新処理
	update: function( app ) {

		if( checkAccel )
		{
			this.sButton.show();	//表示
			this.label.hide();

			//アニメーション
			this.yua.tweener.to({
				x: this.gridX.center() + 126,

			},800,"swing").play();

			//アニメーション
			this.textSprite.tweener.to({
				x: this.gridX.center() - 126,

			},800,"swing").play();

		}

	}, //end update

});


/**********************************************************


	ReadyScene class


**********************************************************/
phina.define("ReadyScene", {

	// 継承
	superClass: 'DisplayScene',

	//初期化
	init: function( param ) {

		// 親クラス初期化
		this.superInit( param );

		let self = this;	//参照用

		// 背景色
		this.backgroundColor = 'white';

		this.flame = 0;

		this.angle = Math.round( Math.random() * 360 );	//0~360の角度を取得
		this.score = param.score;	//スコアを取得

		// スプライト
		this.sprite = Sprite('pkey').addChildTo( this );
		// 初期位置
		this.sprite.x = this.gridX.center();
		this.sprite.y = this.gridY.center() + 50;

		this.sprite.rotation = this.angle;
		this.sprite.alpha = 0.5;	//一応透明度を下げておく
		this.sprite.hide();	//隠す


		/**
		プログライズキーの演出スプライト左
		**/
		let rad = Math.degToRad( this.angle + 180 );	//repkeyL用ラジアン

		this.repkeyL = Sprite('repkeyL').addChildTo( this );
		// 初期位置
		this.repkeyL.x = this.gridX.center();
		this.repkeyL.y = this.gridY.center() + 50;
		this.repkeyL.rotation = this.angle;

		//どこまで移動するか？
		let moveDis = ( this.sprite.width / 2 ) - 110;	//移動距離(ちょっと調節

		this.leftMaxX = this.repkeyL.x + ( Math.cos( rad ) * moveDis );
		this.leftMaxY = this.repkeyL.y + ( Math.sin( rad ) * moveDis );

		this.repkeyL.tweener.moveTo( this.leftMaxX,this.leftMaxY,600 ).play();	//アニメーション


		/**
		プログライズキーの演出スプライト右
		**/
		rad = Math.degToRad( this.angle );	//repkeyR用ラジアン

		this.repkeyR = Sprite('repkeyR').addChildTo( this );
		// 初期位置
		this.repkeyR.x = this.gridX.center();
		this.repkeyR.y = this.gridY.center() + 50;
		this.repkeyR.rotation = this.angle;

		//どこまで移動するか？
		this.rightMaxX = this.repkeyR.x + ( Math.cos( rad ) * moveDis );
		this.rightMaxY = this.repkeyR.y + ( Math.sin( rad ) * moveDis );

		this.repkeyR.tweener.moveTo( this.rightMaxX,this.rightMaxY,600 ).play();	//アニメーション


		//ラベル
		this.Label1 = Label( "この位置で止めてみせろ！" ).addChildTo( this ).setPosition( this.gridX.center(), 100 );
		this.Label1.fontFamily = FONT_FAMILY;

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
			fill : '#fff52a',
			fontColor: '#000000',
			fontSize: 32,
			fontFamily: FONT_FAMILY,

		}).addChildTo( this ).setPosition( this.gridX.center(),this.gridY.center()+380 );
		this.sButton.hide();	//隠す
		
		//スタートボタンが押されたら?
		this.sButton.onpointstart = function() {

			self.exit( "main",{angle: self.angle,score: self.score} );	//go to MainScene
		};


	}, //end init


	//更新処理
	update: function( app ) {
		
		this.flame += app.deltaTime;	//経過時間

		if( this.flame >= 700 )
		{
			this.sprite.show();	//プログライズキー表示
			this.sButton.show();	//ボタン表示
		}

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

		/*
		this.checkFlg用定数
		*/
		this.WAIT  = 0;
		this.CHECK = 1;
		this.GOTOSCENE = 2;

		this.rotFlg   = 0;	//回転フラグ
		this.checkFlg = this.WAIT;	//判定フラグ
		this.startZ   = null;	//回転を止めた時のZ軸
		this.clearTimes = param.score;	//連続で変身成功した回数
		this.correctAng = param.angle;	//正解の角度
		this.toResultTime = 0;
		this.correctFlg = false;	//正解したか？
		

		//ラベル
		this.notClearLabelGroup = DisplayElement().addChildTo( this );	//"変身失敗"ラベルグループ作成
		this.ClearLabelGroup = DisplayElement().addChildTo( this );	//"変身成功!"ラベルグループ作成

		this.setTexttoGroup( this,this.notClearLabelGroup,"変身失敗" );	//"変身失敗"ラベル登録
		this.setTexttoGroup( this,this.ClearLabelGroup,"変身成功！" );	//"変身成功!"ラベル登録


console.log( this.notClearLabelGroup.children.length );

		/*
		this.clearLabel = Label( "変身成功！" ).addChildTo( this ).setPosition( this.gridX.center(), this.gridY.center()+240 );
		this.notClearLabel = Label( "変身失敗..." ).addChildTo( this ).setPosition( this.gridX.center(), this.gridY.center()+240 );
		this.clearLabel.hide();
		this.notClearLabel.hide();	//ラベルを隠す
		this.notClearLabel.setScale( 5.0,5.0 );	//拡大しておく
		*/

		//変身成功回数ラベル
		this.clearTimesLabel = Label( "変身成功:" ).addChildTo( this ).setPosition( this.gridX.center(), this.gridY.center() - 380 );	//変身成功回数ラベル
		this.clearTimesLabel.hide();


		//ボタン
		this.replayButton = Button({
			text : 'もう1回',
			fill : '#3D9AC1',
			fontColor: '#ffffff',
			fontSize: 30,

		}).addChildTo( this ).setPosition( this.gridX.center(),this.gridY.center()+300 );
		this.replayButton.hide();	//隠す

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
		this.restartButton.hide();	//隠す

		//もしリスタートボタンが押されたら?
		this.restartButton.onclick = function(){

			self.checkFlg = 0;
			//self.notClearLabel.setScale( 5.0,5.0 );	//拡大しておく
			self.clearTimes = 0;
			self.sprite.rotation = 0;
		};


		//画面をクリックしたら
		this.onpointstart = function( e ){

			//デバッグ用
			if( DEBUG_FLG )
			{
				//self.exit("result",{score: self.clearTimes} );
				if( self.rotFlg != 0 )
				{
					self.sprite.rotation = self.correctAng;
					self.rotFlg = 0;
					self.checkFlg = 1;
				}

				if( self.checkFlg == 0 )
				{
					self.rotFlg = 1;
				}

			}
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
			this.toTimeLabel = Label().addChildTo( this ).setPosition(this.gridX.center(), this.gridY.center()+240 );
		}


	}, //end init


	//更新処理
	update: function( app ) {

		//傾きセンサー関連
		let accel = app.accelerometer;	//傾きセンサー取得

		let rot  = accel.rotation;
		let ori  = accel.orientation;	//alphaでz軸
		let grav = accel.gravity;	//重力加速度



		//回転スタートチェック
		if( this.checkFlg == this.WAIT )
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
			SoundManager.play('se1');

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
				this.checkFlg = this.CHECK;
			}
		}

		//判定フラグ
		if( this.checkFlg == this.CHECK )
		{
			//もし成功したら？
			if( Math.abs( this.sprite.rotation ) === this.correctAng )	//正解の角度のピッタリ合ったら
			{
				if( this.checkFlg == this.CHECK )
				{
					this.correctFlg = true;	//正解フラグON
					this.checkFlg = this.GOTOSCENE;	//何回もアニメーションするのを防ぐため

					//this.clearLabel.show();

					/**
					"変身成功!"ラベルアニメーション開始
					**/
					let wait  = 0;
					let plusX = 0;
					let plusY = 0;
					let fontSize = 36;
					let self = this;	//参照用
					let len = this.ClearLabelGroup.children.length;
					let baseX = self.gridX.center() - (( fontSize / 2 ) * ( len - 1 ));	//スタート位置

					this.ClearLabelGroup.children.each( function( label,i ) {
						
						label.show();

						label.tweener.wait( wait )
								.to({
							x: baseX + plusX,
							y: label.y,
							scaleX: 1.0,
							scaleY: 1.0,

						},200,"swing").play();

						wait  += 50;
						plusX += fontSize + 10;
					});


					this.clearTimes ++;	//クリア回数をプラス
					this.clearTimesLabel.text = "変身成功回数:"+this.clearTimes;
					this.clearTimesLabel.show();

					//this.replayButton.show();
				}
			}
			//もし失敗したら？
			else
			{
				if( this.checkFlg == this.CHECK )
				{
					this.checkFlg = this.GOTOSCENE;	//何回もアニメーションするのを防ぐため

					/*
					this.notClearLabel.show();
					this.notClearLabel.tweener.scaleTo( 1.0, 500 ).play();
					*/

					/**
					"変身失敗"ラベルアニメーション開始
					**/
					let wait  = 0;
					let plusX = 0;
					let plusY = 0;
					let fontSize = 36;
					let self = this;	//参照用
					let len = this.notClearLabelGroup.children.length;
					let baseX = self.gridX.center() - (( fontSize / 2 ) * ( len - 1 ));	//スタート位置

					this.notClearLabelGroup.children.each( function( label,i ) {
						
						label.show();

						label.tweener.wait( wait )
								.to({
							x: baseX + plusX,
							y: label.y,
							scaleX: 1.0,
							scaleY: 1.0,

						},200,"swing").play();

						wait  += 50;
						plusX += fontSize + 10;
					});

					//this.restartButton.show();	//リスタートボタン表示
				}

			}
		}

		if( this.checkFlg == this.GOTOSCENE )
		{
			this.toResultTime += app.deltaTime; //リザルトシーンまでの経過時間を計測
		}

		if( this.toResultTime >= 3000 )
		{
			if( this.correctFlg )
			{
				this.exit( "ready",{score: this.clearTimes} );	//go to ReadyScene
			}
			else
			{
				this.exit( "result",{score: this.clearTimes} );	//go to ResultScene
			}
		}
		

		if( this.checkFlg == this.WAIT )
		{
			/*
			this.clearLabel.hide();
			this.notClearLabel.hide();
			*/

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
			this.toTimeLabel.text = "角度:" + Math.abs( this.sprite.rotation );
		}


	}, //end update

	/**

	テキストをラベルグループにセットする
	  *_this:参照外れのためthisを引数に
	  *group:セットするグループ変数

	**/
	setTexttoGroup: function( _this,group,text ){
		
		let len = text.length;

		let label = 0;

		( len ).times( function( i ){
			
			label = Label( text[i] ).addChildTo( group ).setPosition( _this.gridX.center() - 200, _this.gridY.center() + 350 );	//ラベルを一文字ずつ登録
			label.fontSize = 36;	//フォントサイズ
			label.stroke = "#fff52a";
			label.fontFamily = FONT_FAMILY;
			label.setScale( 8.0,8.0 );
			label.hide();
		});


	}, //end setTexttoGroup



});//end MainScene



/**********************************************************


	ResultScene class


**********************************************************/
phina.define("ResultScene", {

	// 継承
	superClass: 'DisplayScene',

	//初期化
	init: function( param ) {

		// 親クラス初期化
		this.superInit( param );

		let self = this;	//参照用

		// 背景色
		this.backgroundColor = 'white';


		//刃スプライト
		this.sprite = Sprite('yua').addChildTo( this );
		// 初期位置
		this.sprite.x = this.gridX.center() + 800;
		this.sprite.y = this.gridY.center();
		this.sprite.rotation = 0;
		this.sprite.setScale( 2.0,2.0 );	//拡大


		//ラベル
		this.resultLabel = Label( "あなたの記録は..." ).addChildTo( this ).setPosition( this.gridX.center() + 400, this.gridY.center() - 380 );
		this.resultLabel.fontFamily = FONT_FAMILY;

		this.scoreLabel  = Label().addChildTo( this ).setPosition( this.gridX.center() + 400, this.gridY.center() - 300 );
		this.scoreLabel.text = param.score+"回。";
		this.scoreLabel.fontFamily = FONT_FAMILY;

		this.yaibaTextLabel  = Label().addChildTo( this ).setPosition( this.gridX.center() - 800, this.gridY.center() + 258 );
		this.yaibaTextLabel.text = this.determiningText( param.score );	//刃テキスト決定
		this.yaibaTextLabel.fontFamily = FONT_FAMILY;


		this.bFlame = 0;	//ボタンを表示するまでの経過時間
		//ボタン
		this.restartButton = Button({
			text : 'もう1回',
			fill : '#fff52a',
			fontColor: '#000000',
			fontSize: 32,
			fontFamily: FONT_FAMILY,

		}).addChildTo( this ).setPosition( this.gridX.center()-140,this.gridY.center()+380 );

		this.restartButton.hide();	//隠す


		//ボタンが押されたら?
		this.restartButton.onpointstart = function() {
			self.exit( "ready" ,{score: 0} );
		};


		/***
		shareボタン関連
		***/
		this.twButton = Button({
				text : 'シェアする',
				strokeWidth : 0,
				fill: '#fff52a',
				fontColor: '#000000',
				fontFamily: FONT_FAMILY,

				}).addChildTo( this ).setPosition( this.gridX.center() + 140,this.gridY.center()+380 );

		this.twButton.hide();	//隠す


		//shareするデータ
		var params = {
			  hashtags: ["phina","仮面ライダーゼロワン","仮面ライダーバルキリー","刃唯阿","nitiasa","indiegame"],	//ハッシュタグ
			  url: phina.global.location && phina.global.location.href,
		};
		
		var shareText = this.yaibaTextLabel.text;
		
		//shareボタン処理
		this.twButton.onclick = function(){

			var text = 'あなたの記録は..{0}{1}'.format( self.scoreLabel.text,shareText );
		        var url = phina.social.Twitter.createURL({
		          text: text,
		          hashtags: params.hashtags,
		          url: params.url,

		        });
		        window.open( url, 'share window', 'width=480, height=320' );
		};



		//アニメーション
		this.resultLabel.tweener.to({
			x: this.gridX.center(),

		},500 ).play();

		this.scoreLabel.tweener.wait( 500 )
				       .to({
			x: this.gridX.center(),

		},500 ).play();

		//刃スプライト
		this.sprite.tweener.wait( 1200 )
				   .to({
			x: this.gridX.center(),
			y: this.gridY.center(),

		},800,"swing").play();

		this.yaibaTextLabel.tweener.wait( 1200 )
				       .to({
			x: this.gridX.center(),

		},800,"swing").play();


	}, //end init


	//更新処理
	update: function( app ) {

		this.bFlame += app.deltaTime;	//経過時間

		if( this.bFlame >= 1200 )
		{
			this.twButton.show();
			this.restartButton.show();
		}


		//デバッグ用
		if( DEBUG_FLG )
		{
			let p = app.pointer;
			console.log( "x:"+p.x+"y:"+p.y );
		}

	}, //end update


	/***

	刃テキストを決める
	   *times:クリア回数
	
	***/
	determiningText: function( times ){

		let t = times;
		let index = 0;

		if( times >= 10 )
		{
			index = 0;
		}
		else if( times >= 7 && times < 10 )
		{
			index = 1;
		}
		else if( times >= 5 && times < 7 )
		{
			index = 2;
		}
		else if( times >= 3 && times < 5 )
		{
			index = 3;
		}
		else if( times >= 1 && times < 3 )
		{
			index = 4;
		}
		else
		{
			let rand = Math.round( Math.random() * 2 );	//0~2での乱数
			index = 5 + rand;
		}


		return yuaTextData[index].text;
	},


});//end ResultScene



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

		   {
			className: 'ResultScene',
			label: 'result',
		   },

		]

	});

	
	// 実行
	app.run();
});

