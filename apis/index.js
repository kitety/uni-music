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
