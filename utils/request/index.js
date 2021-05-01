import Request from "./request.js"

// 需要修改baseUrl
// const baseUrl = process.env.NODE_ENV === "development"?
// 	"https://www.fastmock.site/mock/848517155615356f2cbfc0d935619ba9/axios": "http://localhost:8081/v1/api"

const baseUrl = process.env.NODE_ENV === "development" ? "http://localhost:3000" : "http://localhost:3000"
const config = {
  baseUrl: baseUrl
}

const reqInterceptor = async (options) => {
  // 做响应拦截，比如配置下url和header，刷新令牌
  _requestLog(options, "成功通过")
  // 返回false的话中断请求并且返回空对象
  return options
}

const resInterceptor = (response, conf = {}) => {
  // 做自己的响应拦截
  const statusCode = response.statusCode
  console.log('statusCode:', statusCode)
  if (statusCode >= 200 && statusCode < 300) { //成功状态
    _responseLog(response, conf, "response 200-299")
    return response.data
  } else if (statusCode === 500) {
    console.log("statusCode:500+", statusCode)
    uni.showToast({
      icon: "none",
      title: "服务器错误"
    });
    _responseLog(response, conf, "response 500")
    // 为了更好控制reject的内容，增加了一个控制字段  wakarReqToReject
    return {
      // 根据当前字段来判断是否reject
      wakarReqToReject: true,
      // 下面可以配置下其他的返回信息，方便统一处理reject的内容。比如返回具体的错误信息
      msg: "服务器错误",
      res: response
    }
  } else {
    _responseLog(response, conf, "response 300-499")
    // 为了更好控制reject的内容，增加了一个控制字段  wakarReqToReject
    return {
      // 根据当前字段来判断是否reject
      wakarReqToReject: true,
      // 下面可以配置下其他的返回信息，方便统一处理reject的内容。
      msg: "这是提示信息",
      res: response
    }
  }
}

const req = new Request(config, reqInterceptor, resInterceptor)

// 请求日志
function _requestLog(req, describe = null) {
  if (process.env.NODE_ENV === "development") {
    console.log("req地址:" + req.url)
    if (describe) {
      console.log("req描述:" + describe)
    }
    console.log("req详细:" + JSON.stringify(req))
  }
  // 根据需要这部分可以做服务端方面日志
}

// 响应日志
function _responseLog(res, conf = {}, describe = null) {
  let _statusCode = res.statusCode
  // if (process.env.NODE_ENV === "development") {
  // 	console.log("res地址:" + conf.url)
  // 	if (describe) {
  // 		console.log("res描述" + describe)
  // 	}
  // 	console.log("res结果:" + JSON.stringify(res))
  // }
  // 服务端日志
  if (_statusCode === 500) {
    // 
    console.log("服务端500进行处理")
  }
}
export default req
