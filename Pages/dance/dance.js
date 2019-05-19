var varName, timerInterval,phtotInterval; //子线程
var ctx = wx.createCanvasContext('canvasArcCir'); //画圆圈的画布
var camCtx;//摄像机context
var scoreStrArr = ['unbelievable!','great~','amazing!','good!'];//鼓励内容
var app = getApp();

Page({
  onLoad: function (options) {
    var that = this;

    that.isStartRecord = false;
    that.videoContext = wx.createVideoContext('shortVideo');

    var newUrl = app.globalData.videoUrls[options.videourlIndex];
    that.videoNumber = newUrl.substring(55, 55+1);

    setTimeout((function callback() {
      that.setData({
        videoIndex: options.videourlIndex,
        videoUrl: app.globalData.videoUrls[options.videourlIndex]
      });
    }).bind(that), 2000);
    camCtx = wx.createCameraContext();
    that.audioCtx = wx.createAudioContext('myAudio');
  },
  onUnload: function(){
    clearInterval(timerInterval);
    clearInterval(varName);
  },
  data: {
    videoUrl: '',
    cameradirection: 'back',
    isClickCam: false,
    isClickRecord: false,
    isStartRecord:false,
    isClickClock: true,
    isClickFlash: false,
    timer:5,
    scoreStr:'',
    timerUrl:'../../imgs/5.png',
    audioUrls:[
      '../../audio/unbelievable.mp3',
      '../../audio/great.mp3',
      '../../audio/amazing.mp3',
      '../../audio/good.mp3'
    ],
    audioIndex:0,
    videoIndex:0,
    popAnimation:{}
  },
  onReady: function () {
    //创建并返回绘图上下文context对象。
    var cxt_arc = wx.createCanvasContext('canvasCircle');
    cxt_arc.setLineWidth(6);
    cxt_arc.setStrokeStyle('#eaeaea');
    cxt_arc.setLineCap('round');
    cxt_arc.beginPath();
    cxt_arc.arc(100, 100, 96, 0, 2 * Math.PI, false);
    cxt_arc.stroke();
    cxt_arc.draw();
  },
  /**
   * 点击拍照的事件
   */
  takePhoto(event) {
    if (!this.isStartRecord){
      this.isStartRecord = true;
      var that = this;
      if (this.data.isClickClock) {
        //需要倒计时5秒
        var timer = 5;
        var animation = function () {
          if (timer >= 1) {
            var newUrl = '../../imgs/' + timer + '.png';
            that.setData({
              isClickRecord: true,
              timerUrl: newUrl
            });
            timer--;
          } else {
            clearInterval(timerInterval);
            that.setData({
              isClickRecord: false
            });
            that.startRecord();
          }
        };
        timerInterval = setInterval(animation, 1000);
      } else {
        this.startRecord();
      }
    }
  },
  /**
   * 开始进行视频录制
   */
  startRecord() {
    var that = this;
    camCtx.startRecord({
      success: (res) => {
        that.drawCircle();
        that.videoContext.play();
        console.log('startRecord');
      }
    })
  },
  /**
   * 停止视频录制
   */
  stopRecord() {
    var that = this;
    wx.showLoading({
      title: '打分中，请稍候',
    });
    camCtx.stopRecord({
      success: (res) => {
        var videoUrl = res.tempVideoPath
        wx.uploadFile({
          url: 'http://47.93.231.86:80/addHistoryVideo',
          // 47.93.231.86:8000  阿里
          // 203.195.174.182:8000 腾讯云
          filePath: videoUrl,
          name: 'file',
          formData: {
            // 'benchmark': Number(that.data.videoIndex)+1,
            'benchmark': that.videoNumber,
            'score':100,
          },
          success: function (res) {
            console.log(res);
            if(res.statusCode==200){
              var resultJson = JSON.parse(res.data);
              var score = resultJson.score;
              var url1 = "http://47.93.231.86:80/"+resultJson.template_path;
              var url2 = "http://47.93.231.86:80/" +resultJson.image_path;
              var complement = resultJson.complement;
              var mark = '很不错';
              if (complement >= 80){
                mark = '很棒哦~';
              } else if (complement<=30){
                mark = '还要加油哦~';
              }
              wx.hideLoading();
              wx.redirectTo({
                url: '../result/result?videoUrl=' + videoUrl + "&score=" + score + "&resultUrl1=" + url1 + "&resultUrl2=" + url2 + "&videoIndex=" + that.videoNumber + "&resultComment=" + mark
              });
            }
          },
          complete: function (res) {
            console.log('complete:'+res);
          }
        });
      }
    })
  },
  /**
   * 绘制拍摄视频时间轴的圆圈
   */
  drawCircle: function () {
    var that = this;
    clearInterval(varName);
    function drawArc(s, e) {
      ctx.setFillStyle('white');
      ctx.clearRect(0, 0, 200, 200);
      ctx.draw();
      var x = 50, y = 50, radius = 40;
      ctx.setLineWidth(18);
      ctx.setStrokeStyle('#ffb945');
      ctx.setLineCap('round');
      ctx.beginPath();
      ctx.arc(x, y, radius, s, e, false);
      ctx.stroke()
      ctx.draw()
    }
    var step = 1, startAngle = 1.5 * Math.PI, endAngle = 0;
    var animation_interval = 100, n = 150;
    var animation = function () {
      if (step <= n) {
        endAngle = step * 2 * Math.PI / n + 1.5 * Math.PI;
        drawArc(startAngle, endAngle);
        step++;
        var popanimation = wx.createAnimation({duration: 1000,});
        popanimation.opacity(0).scale(3, 3).step();//修改透明度,放大
        var clearAni = wx.createAnimation({ duration: 1 });
        clearAni.opacity(1).scale(1, 1).step();//复位
        var tempIndex = Math.round(Math.random() * 3 + 0);//随机数
        if(step==10){
          //第1次出来动画
          that.setData({
            popAnimation: popanimation.export(),
            scoreStr:"Let's Go!"
          })  
        } else if (step == 39) {
          //第2次出来动画之前清空
          that.setData({ popAnimation: clearAni.export(), scoreStr:''});
        }else if (step == 40){
          //第2次出来动画
          that.setData({
            popAnimation: popanimation.export(),
            scoreStr: scoreStrArr[tempIndex],
            audioIndex: tempIndex
          }, function () { that.audioCtx.play() });
        } else if (step == 79) {
          //第3次出来动画之前清空
          that.setData({ popAnimation: clearAni.export(),  scoreStr:'' });
        }else if (step == 80) {
          //第3次出来动画
          that.setData({
            popAnimation: popanimation.export(),
            scoreStr: scoreStrArr[tempIndex],
            audioIndex: tempIndex
          }, function () { that.audioCtx.play() });
          
        } else if (step == 119) {
          //第3次出来动画之前清空
          that.setData({ popAnimation: clearAni.export(), scoreStr: '' });
        } else if (step == 120) {
          //第3次出来动画
          that.setData({
            popAnimation: popanimation.export(),
            scoreStr: scoreStrArr[tempIndex],
            audioIndex: tempIndex
          }, function () { that.audioCtx.play() });
        }
      } else {
        clearInterval(varName);
        clearInterval(phtotInterval);
        that.stopRecord();
      }
    };
    varName = setInterval(animation, animation_interval);
  },
  /**
   * 改变前后摄像头
   */
  changeCameraDirection: function(){
    if (this.data.cameradirection=='back'){
      this.setData({
        cameradirection: 'front',
        isClickCam: true
      });
    }else{
      this.setData({
        cameradirection: 'back',
        isClickCam: false
      });
    }
  },
  //打开关闭计时
  openClock: function(){
    if (this.data.isClickClock) {
      this.setData({
        isClickClock: false
      });
    } else {
      this.setData({
        isClickClock: true
      });
    }
  },
  //打开关闭闪光灯
  openFlash: function () {
    if (this.data.isClickFlash) {
      this.setData({
        isClickFlash: false
      });
    } else {
      this.setData({
        isClickFlash: true
      });
    }
  },
  //返回主页面
  backHomePage:function(){
    wx.reLaunch({
      url: '../home/home',
    })
  }
})