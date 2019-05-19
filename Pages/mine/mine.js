/**
 * 个人页面js
 */
var app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    headerUrl: "../../imgs/mine/cover.png",
    videos: [],
    currentTab: 1
  },
  
  // 切换到我的收藏
  changeTab1: function () {
    console.log("xxx");
    this.setData({
      currentTab: 1
    })
  },

  // 切换到我的斗舞
  changeTab2: function () {
    this.setData({
      currentTab: 2
    })
  },
  // 查看具体视频
  watchVideo: function (ev) {
    console.log(ev.currentTarget.dataset)
    wx.navigateTo({
      url: "/Pages/video/video?video="+ev.currentTarget.dataset.video
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var videos = [];
    var allVideos = app.globalData.videoUrls;
    console.log(app.globalData.likeArr);
    app.globalData.likeArr.forEach(function (index) {
      console.log(index);
      videos.push(allVideos[index]);
    })
    console.log(videos);
    this.setData({
      videos: videos
    })
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