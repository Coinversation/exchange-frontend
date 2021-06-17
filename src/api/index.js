import request from '@/plugin/axios'
// import md5 from 'js-md5'

export const create = (data) => {
    return request({
        url: '/api/v1/pool/create',
        method: 'post',
        data: data,
    })
}

export const poolList = () => {
    return request({
        url: '/api/v1/pool/poollist',
        method: 'get',
    })
}

export const createPoolToken = (data, poolID) => {
    return request({
        url: '/api/v1/pool/createPoolToken',
        method: 'post',
        data: {
            tokens: data,
            poolID: poolID,
        },
    })
}
