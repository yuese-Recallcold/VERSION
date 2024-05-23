import request from '@/utils/system/request'

export function accountadd(data: object) {
    return request({
      url: '/accountadd',
      method: 'post',
      // baseURL: '/mock',
      data
    })
  }



  export function getaccounts(data: object) {
    return request({
      url: '/accounts',
      method: 'post',
      // baseURL: '/mock',
      data
    })
  }

    export function updateaccounts(data: object) {
      return request({
        url: '/updateaccounts',
        method: 'post',
        // baseURL: '/mock',
        data
      })
  }


  export function updateaccounts_list(data: object) {
    return request({
      url: '/updateaccounts_list',
      method: 'post',
      // baseURL: '/mock',
      data
    })
}