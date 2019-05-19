/**
 * 斗舞结构页面js
 */

Page({

  /**
   * 页面的初始数据
   */
  data: {
    vedio:"",
    score: 100,
    currentScore: 0,
    resultComment: "“节奏感还不够强哦！”",
    shareBtnUrl: "../../imgs/result/share.png",
    replayBtnUrl: "../../imgs/result/replay.png",
    pickUrl:"../../imgs/result/pick.png",
    maskUrl: "../../imgs/result/mask.png",
    resultUrl1:"",
    resultUrl2: "",
    isShowMask: true,
    isShowCanvas: false,
    videoIndex: 0,
  },

  // 回放视频
  playBack: function() {
    this.videoContext.seek(0);
    this.hideMask();
  },

  // 隐藏遮罩
  hideMask: function(){
    this.setData({
      isShowMask: false
    })
  },

  // 分享
  share: function() {
    var that = this;
    this.setData({
      isShowCanvas: true
    },function(){
      that.draw();
    })
  },

  // 返回到斗舞页面
  back: function () {
    wx.redirectTo({
      url: '../dance/dance?videourlIndex=' + this.data.videoIndex
    })
  },

  // 隐藏canvas
  hideCanvas: function(){
    this.setData({
      isShowCanvas: false
    })
  },

  // 回到主页
  pick: function () {
    wx.reLaunch({
      url: '../home/home',
    })
  },

  // 显示分数动画
  numberAnimate: function(){
    var that = this;
    var speed = 3;
    var t = setTimeout(function(){
      that.setData({
        currentScore: that.data.currentScore+1
      },function(){
        var currentScore = that.data.currentScore;
        speed += 2;
        if (currentScore < that.data.score){
          that.numberAnimate();
        }else{
          // that.draw();
        }
      })
    }, speed)
  },

  // 绘制截屏
  draw: function (callback) {
    var file1 = "";
    var file2 = "";
    var downloadCount = 2;
    var that = this;
    var drawCanvas = function () {
      const ctx = wx.createCanvasContext('myCanvas')
      ctx.drawImage(file1, 0, 0, 425, 625)
      ctx.drawImage("../../imgs/result/mask.png", 0, 0, 425, 625)
      ctx.drawImage(file2, 225, 250, 98, 162)
      ctx.drawImage(file1, 105, 250, 98, 162)
      ctx.drawImage("../../imgs/result/QRcode.jpeg", 165, 525, 90, 90)
      ctx.setFontSize(78)
      ctx.setFillStyle("#ffb945");
      ctx.fillText(`${that.data.score}`, 175, 187)
      ctx.setFontSize(20)
      ctx.fillText(that.data.resultComment, 122, 460)
      ctx.draw(false, function () {
        that.saveImg(that.hideCanvas)
      })
    }
    wx.downloadFile({
      url: that.data.resultUrl1,
      success(res) {
        file1 = res.tempFilePath;
        downloadCount--;
        if (downloadCount === 0) {
          drawCanvas();
        }
      }
    })
    wx.downloadFile({
      url: that.data.resultUrl2,
      success(res) {
        file2 = res.tempFilePath;
        downloadCount--;
        if (downloadCount === 0) {
          drawCanvas();
        }
      }
    })
  },

  // 保存图片到本地
  saveImg: function(callback){
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 425,
      height: 625,
      destWidth: 425,
      destHeight: 625,
      canvasId: 'myCanvas',
      fileType: "jpg",
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function(res){
            console.log(res);
            wx.showModal({
              title: '保存成功',
              content: '',
              success: function (res) {
                callback();
                if (res.confirm) {
                  console.log('用户点击确定')
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      score: options.score,
      resultUrl1: options.resultUrl1,
      resultUrl2: options.resultUrl2,
      vedio: options.videoUrl,
      videoIndex: options.videoIndex,
      resultComment: options.resultComment,
    },function(){
      that.numberAnimate();
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})