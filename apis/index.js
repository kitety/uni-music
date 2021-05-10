import request from '../utils/request/index'
// 获取轮播图数据
export function apiGetBanner(data) {
  return request.request({
    url: "/banner",
    method: "GET",
    data,
    authType: "None",
  });
}

// 获取推荐歌单
export function apiGetRecommendSongs(data) {
  return request.request({
    url: "/personalized",
    method: "GET",
    data,
    authType: "None",
  });
}

// 获取新碟
export function apiGetTopAlbum(data) {
	return request.request({
		url: '/album/newest',
		method: 'GET',
		data,
		authType: 'None'
	})
}

export function apiGetRelatedVideo(data) {
	return request.request({
		url: '/related/allvideo',
		method: 'GET',
		data,
		authType: 'None'
	})
}
