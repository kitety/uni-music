<template>
  <view class="content">
    <!-- 轮播图 -->
    <swiper class="swiper" :autoplay="true" :indicator-dots="true" indicator-active-color="#ff372b"
      indicator-color="rgba(255,255,255, .5)" duration="500" :circular="true">
      <swiper-item v-for="(item,index) in swiper" :key="index">
        <view class="item">
          <image :src="item.imageUrl" class="img"></image>
          <view class="tag">
            {{item.typeTitle}}
          </view>
        </view>
      </swiper-item>
    </swiper>
    <!-- 主入口搭建 -->
    <view class="main-bar flex-box">
      <view class="flex-item" v-for="(item,index) in contentBar" :key="index">
        <image :src="'/static/image/index/t_' + (index + 1) + '.png'" class="img"></image>
        <view>
          {{item.name}}
        </view>
        <!--  //每日推荐对应的日期,v-if="index == 0" 列表索引的第一个item才生效 -->
        <!-- <view v-if="index===0" class="date">{{curDate}}</view> -->
      </view>
    </view>
  </view>
</template>

<script>
  import {
    apiGetBanner
  } from '../../apis/index'
  export default {
    data() {
      return {
        swiper: [],
        loading: false,
        contentBar: [{
            name: "每日推荐"
          },
          {
            name: "歌单"
          },
          {
            name: "排行榜"
          },
          {
            name: "电台"
          },
          {
            name: "直播"
          }
        ]
      }
    },
    onLoad() {
      this.loading = true
      this.getBanners()
    },
    methods: {
      getBanners() {
        apiGetBanner().then(res => {
          this.swiper = res.banners
        })
      }
    }
  }
</script>

<style lang="scss">
  /* 宽度100% */
  .swiper .img {
    width: 750rpx;
  }

  /* 导航 */
  .main-bar {
    padding-bottom: 22rpx;
    text-align: center;
    line-height: 70rpx;
    color: #666;
    border-bottom: 1rpx solid #e6e6e6;
    margin-top: 14rpx;

    .img {
      display: block;
      width: 92rpx;
      height: 92rpx;
      margin: 0 auto;
    }
  }
</style>
