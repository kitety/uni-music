import {
  requestConfig
} from "./common.js";
// 小小提示：全局或者自定义中的success/fail/complete统一在这里处理请求中的success/fail/complete事件
//并不意味着200-300端口号是成功的，服务端400在uni请求中也是成功的
export default class Request {
  constructor(config = {}, reqInterceptor = null, resInterceptor = null, successHandler = null, failHandler = null,
    completeHandler = null) {
    // base
    this.baseUrl = config.baseUrl
    this.header = config.header || {
      "Content-Type": "application/json;charset=UTF-8"
    }
    // 全局success/fail/complete的返回函数，在这里也可以做个响应拦截
    this.success = successHandler
    this.fail = failHandler
    this.complete = completeHandler
    // 进行拦截
    this.requestInterceptor = reqInterceptor
    this.responseInterceptor = resInterceptor
  }
  // type类型:request/upload/download
  // success/fail/complete方法在全局调用之后不在覆盖全局
  async request(options, successHandler = null, failHandler = null, completeHandler = null) {
    const task = options.task || false
    const type = options.type || "request"
    // 删除task属性
    let config = null
    try {
      config = await requestConfig(this, options, successHandler, failHandler, completeHandler)
    } catch (e) {
      // 捕获错误
      return Promise.reject(e)
    }
    if (!config || typeof config != "object") {
      // 如果我们不拒绝空白对象的话，将会成功解决掉
      return Promise.reject({})
    }
    const that = this
    if (task) {
      config["success"] = (response) => {
        if (that.responseInterceptor) {
          that.responseInterceptor(response, config)
        }
        that.success && that.success(response)
        successHandler && successHandler(response)
      }
      config["fail"] = (response) => {
        that.fail && that.fail(response)
        failHandler && failHandler(response)
      }
      config["complete"] = (response) => {
        that.complete && that.complete(response)
        completeHandler && completeHandler(response)
      }
      if (type === "request") {
        return uni.request(config)
      } else if (type === "upload") {
        return uni.uploadFile(config)
      } else {
        return uni.downloadFile(config)
      }
      return
    }
    return new Promise((resolve, reject) => {
      config["success"] = (response) => {
        let _res = null
        if (that.responseInterceptor) {
          _res = that.responseInterceptor(response, config)
        }
        that.success && that.success(response)
        successHandler && successHandler(response)
        // 根据 wakaryReqToReject 来判断我们选择reject或resolve下去
        if (_res.wakaryReqToReject) {
          delete _res.wakaryReqToReject
          reject(_res)
        } else {
          resolve(_res)
        }
      }
      config["fail"] = (error) => {
        that.fail && that.fail(error)
        failHandler && failHandler(error)
        // 它会返回失败错误，可以修改成你自己想要的样子
        reject(error)
      }
      config["complete"] = (response) => {
        that.complete && that.complete(response)
        completeHandler && completeHandler(response)
      }
      if (type === "request") {
        uni.request(config)
      } else if (type === "upload") {
        uni.uploadFile(config)
      } else {
        uni.downloadFile(config)
      }
    })
  }
}
