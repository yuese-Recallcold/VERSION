import request from '@/utils/system/request'

// 获取数据api
export function getData(data: object) {
  return request({
    url: '/tasks',
    method: 'post',
    // baseURL: '/mock',
    data
  })
}

// 获取分类数据
export function getCategory(data: object) {
  return request({
    url: '/table/category',
    method: 'post',
    baseURL: '/mock',
    data
  })
}
export function get_config() {
  return request({
    url: '/get_config',
    method: 'get',
    // baseURL: '/mock',
  })
}
// 获取树组织数据
export function getTree(data: object) {
  return request({
    url: '/table/tree',
    method: 'post',
    baseURL: '/mock',
    data
  })
}

// 新增
export function add(data: object) {
  return request({
    url: '/task/add',
    method: 'post',
    // baseURL: '/mock',
    data
  })
}

// 编辑
export function update(data: object) {
  return request({
    url: '/table/update',
    method: 'post',
    baseURL: '/mock',
    data
  })
}

// 关闭
export function close(data: object) {
  return request({
    url: '/task/close',
    method: 'post',
    // baseURL: '/mock',
    data
  })
}