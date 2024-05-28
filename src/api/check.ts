import request from '@/utils/system/request'

export function add(data: object) {
    return request({
      url: '/check_add',
      method: 'post',
      // baseURL: '/mock',
      data
    })
  }

  export function update(data: object) {
    return request({
      url: '/check_update',
      method: 'post',
      // baseURL: '/mock',
      data
    })
  }

  export function getData(data: object) {
    return request({
      url: '/get_check_list',
      method: 'post',
      // baseURL: '/mock',
      data
    })
  }

  export function getDataTwo(data: object) {
    return request({
      url: '/get_check_list_two',
      method: 'post',
      // baseURL: '/mock',
      data
    })
  }
  export function del(data: object) {
    return request({
      url: '/check_del',
      method: 'post',
      // baseURL: '/mock',
      data
    })
  }
  export function uploadexcel(data: object) {
    return request({
      url: '/upload',
      method: 'post',
      // baseURL: '/mock',
      data
    })
  }