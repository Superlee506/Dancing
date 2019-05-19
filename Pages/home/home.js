var app = getApp()

Page({
  // 触摸开始时间
  touchStartTime: 0,
  // 触摸结束时间
  touchEndTime: 0,
  // 最后一次单击事件点击发生时间
  lastTapTime: 0,
  data: {
    // tab切换  
    currentTab: 0,
    showView: false, //隐藏显示speedview,
    showCardIndex:0,
    showCardBoolArr: [false,true,true],
    hideBoarding:false,
    videoUrls:app.globalData.videoUrls,
    boardingUrls:[
      "../../imgs/onboarding0.png",
      "../../imgs/onboarding1.png",
      "../../imgs/onboarding2.png",
      "../../imgs/onboarding3.png",
    ],
    boardingUrlIndex:0,
    hideLike:true,
    popAnimation:{}
  },
  onLoad: function (options) {
    var that = this;
    this.videoArr = [];
    this.data.showCardBoolArr = [];
    this.showCardId = 'videoCard_0';
    for (let videoCount = 0; videoCount < app.globalData.videoUrls.length; videoCount++) {
      var videoContext = wx.createVideoContext('shortVideo_' + videoCount);
      this.videoArr.push(videoContext);
      this.data.showCardBoolArr.push(true);
    }
    this.data.showCardBoolArr[this.data.showCardIndex] = false;
    this.videoArr[this.data.showCardIndex].play();

    showView: (options.showView == "true" ? true : false);

    if(!app.globalData.isFirstLaunch){
      that.setData({
        boardingUrlIndex:2,
        hideBoarding: true
      });
    }
    app.globalData.isFirstLaunch = false;
  },
  onChangeShowState:function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  /**
   * 切换视频
   */
  changeVideo: function (e) {
    var currentVideoId = Number(e.detail.current);
    // console.log(currentVideoId);
    for (let videoCount = 0; videoCount < this.videoArr.length; videoCount++){
      this.videoArr[videoCount].pause();
    }
    this.videoArr[currentVideoId].play();
  },
  /**
   * pk按钮按下的事件
   */
  pkBtnEvent: function(e) {
    var that = this;
    that.data.boardingUrlIndex = 3;
    that.setData({
      hideBoarding: false,
      boardingUrlIndex: that.data.boardingUrlIndex,
    });
  },
  /**
   * 取消pk按钮事件
   */
  cancelPK: function(e){
    var that = this;
    that.data.boardingUrlIndex = 2;
    that.setData({
      hideBoarding: true,
      showView:true,
      boardingUrlIndex: that.data.boardingUrlIndex,
    });
  },
  /**
   * 确认pk按钮事件，跳转到dance页面
   */
  confirmPK: function(e){
    var that = this;
    var videourl = app.globalData.videoUrls[that.data.showCardIndex];
    that.data.boardingUrlIndex = 2;
    that.setData({
      hideBoarding: true,
      boardingUrlIndex: that.data.boardingUrlIndex,
    });
    wx.redirectTo({
      url: '../dance/dance?videourlIndex=' + that.data.showCardIndex
    })
  },
  /**
   * 打开/关闭速度切换面板的按钮事件
   */
  changeSpeedBtnEvent: function (e) {
    var that = this;
    that.setData({
      showView: (!that.data.showView),
    })
  },
  /**
   * 改变视频播放速度
   */
  changeSpeed: function (e) {
    var speedId = Number(e.currentTarget.dataset.speedid);
    console.log(speedId);
    this.videoArr[this.data.showCardIndex].playbackRate(speedId); 
  },
  shareBtnEvent: function (e) {
    // 这是分享的函数
  },
  /**
   * 切换到下一个视频
   */
  nextBtnEvent: function (e) {
    var currentVideoId = Number(e.currentTarget.id);
    this.videoArr[currentVideoId].pause();
    this.data.showCardIndex = currentVideoId + 1;
    if (this.data.showCardIndex >= app.globalData.videoUrls.length) {
      this.data.showCardIndex = 0;
    }
    for (let videoCount = 0; videoCount < this.data.showCardBoolArr.length; videoCount++) {
      this.data.showCardBoolArr[videoCount] = true;
    }
    this.data.showCardBoolArr[this.data.showCardIndex] = false;
    var that = this;
    that.setData({
      showCardIndex: that.data.showCardIndex,
      showCardBoolArr: that.data.showCardBoolArr
    });
    this.videoArr[this.data.showCardIndex].play();
  },
  /**
   * 更换蒙版按钮
   */
  changeBoardingEvent:function(e){
    var that = this;
    if (that.data.boardingUrlIndex<3){
      that.data.boardingUrlIndex++;
      if (that.data.boardingUrlIndex == 3) {
        that.setData({
          hideBoarding: !(that.data.hideBoarding),
        });
      } else {
        that.setData({
          boardingUrlIndex: that.data.boardingUrlIndex,
        });
      }
    }
  },
  /**
   * 双击事件
   */
  doubleTap: function (e) {
    console.log('doubleTap');
    var that = this
    // 控制点击事件在350ms内触发，加这层判断是为了防止长按时会触发点击事件
    if (that.touchEndTime - that.touchStartTime < 350) {
      // 当前点击的时间
      var currentTime = e.timeStamp
      var lastTapTime = that.lastTapTime
      // 更新最后一次点击时间
      that.lastTapTime = currentTime
      // 如果两次点击时间在300毫秒内，则认为是双击事件
      if (currentTime - lastTapTime < 300) {
        console.log('dbclick');
        if (app.globalData.likeArr.indexOf(this.data.showCardIndex)==-1){
          app.globalData.likeArr.push(this.data.showCardIndex);
        }
        // 成功触发双击事件时，将视频index放到喜欢数组里面
        var popanimation = wx.createAnimation({ duration: 1000, });
        popanimation.opacity(0).scale(3, 3).step();//修改透明度,放大
        var clearAni = wx.createAnimation({ duration: 1 });
        clearAni.opacity(1).scale(1, 1).step();//复位
        var reset = function () {
          console.log('reset');
          that.setData({
            hideLike: true,
            popAnimation: clearAni.export(),
          });
        }
        var pop = function(){
          that.setData({
            hideLike: false,
            popAnimation: popanimation.export(),
          });
        }
        reset();
        setTimeout(pop, 100);
        setTimeout(reset, 2000);
      }
    }
  },
  /// 按钮触摸开始触发的事件
  touchStart: function (e) {
    this.touchStartTime = e.timeStamp
  },
  /// 按钮触摸结束触发的事件
  touchEnd: function (e) {
    this.touchEndTime = e.timeStamp
  },
}) 