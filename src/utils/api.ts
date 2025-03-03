import request from './request'

// api请求设置
export const testProxy = () => {
  return request({
    url: 'https://api.ipify.org',
    method: 'get',
    params: { format: 'json' }
  })
}