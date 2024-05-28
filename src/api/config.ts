import request from '@/utils/system/request'

// 获取分类数据
export function getConfigName(data: object) {
    return request({
      url: '/getConfigName',
      method: 'post',
    //   baseURL: '/mock',
      data
    })
  }
  export function getversionName(data: object) {
    return request({
      url: '/getversionName',
      method: 'post',
    //   baseURL: '/mock',
      data
    })
  }
  // 获取数据api
export function getData(data: object) {
    return request({
      url: '/get_config_list',
      method: 'post',
      // baseURL: '/mock',
      data
    })
  }

  export function add(data: object) {
    return request({
      url: '/config_list_add',
      method: 'post',
      // baseURL: '/mock',
      data
    })
  }
  export function update(data: object) {
    return request({
      url: '/get_config_list1',
      method: 'post',
      // baseURL: '/mock',
      data
    })
  }

  export function del(data: object) {
    return request({
      url: '/config_list_del',
      method: 'post',
      // baseURL: '/mock',
      data
    })
  }