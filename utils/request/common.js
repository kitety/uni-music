export async function requestConfig(ins, options, successHandler = null, failHandler = null, completeHandler = null) {
	// base
	ins.header = options.header || ins.header
	ins.baseUrl = options.baseUrl || ins.baseUrl
	// 配置base
	let config = {
		url: ins.baseUrl + options.url,
		header: ins.header
	}
	if (ins.requestInterceptor) {
		// 做请求拦截并且获取新的配置。我们仅做浅拷贝即可
		let _cg = null
		try {
			_cg = await ins.requestInterceptor(Object.assign({}, options, config))
		} catch (e) {
			//处理异常情况
			return false;
		}
		// 如果这个配置返回的是false或null的话就不需要去请求。
		if (!_cg || typeof _cg !== 'object') {
			return false
		}
		// 重置options
		Object.assign(options, _cg)
		// 重置base，我们在拦截器里修改url和header
		config.url = options.url
		config.header = options.header
	}
	const type = options.type || "request"
	// 细节配置，我们移除不需要的选项
	if (type === "request") {
		config["data"] = options.data || options.params || {}
		config["method"] = options.method || "GET"
		config["dataType"] = options.dataType || "json"
		config["responseType"] = options.responseType || "text"
	} else if (type == "upload") {
		config["filePath"] = options.filePath
		config["name"] = options.name
		config["method"] = options.method || "POST"
		config["formData"] = options.formData
		// 文件类型
		config["fileType"] = options.fileType || "image"
		// 删除下content-type内容，因为设置的话会把信息弄丢
		delete config.header["Content-Type"]
	}
	// download 不需要配置任何东西
	return config
}

function _isPromise(obj) {
	return obj && (typeof obj === "object" || typeof obj === "function") && typeof obj.then === "function"
}
