import { validatenull } from '@/lib/validate'
import axios from 'axios'
import qs from 'qs'
import store from '@/store'
import util from '@/lib/util'
import router from '@/router'
import { basicAlerts } from '@/plugin/hintAlert'

// 创建一个 axios 实例
const service = axios.create({
    baseURL: process.env.VUE_APP_DATABASEURL,
    withCredentials: false, // 跨域请求，允许保存cookie
    timeout: 100000, // 请求超时时间
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
})

// HTTPrequest拦截
service.interceptors.request.use(
    (config) => {
        const { auth } = store.state
        const commonData = {
            session_key: auth.currentUser ? auth.currentUser.SessionKey : '',
            session_id: auth.sessionID ? auth.sessionID : '',
            operator_id: auth.currentUser ? auth.currentUser.Operator.Id : '',
        }

        let joinedCommonDataStr = ''

        for (const prop in commonData) {
            joinedCommonDataStr += `&${prop}=${commonData[prop]}`
        }

        if (config.method === 'get') {
            if (config.url.indexOf('?') > -1) {
                config.url += joinedCommonDataStr
            } else {
                config.url += '?' + joinedCommonDataStr.substr(1)
            }

            return config
        }

        // console.log(config.data)
        // console.log(45, config.url)
        if (config.method === 'post' && config.url === '/login') {
            config.data = qs.stringify(Object.assign(config.data, commonData))
        } else {
            if (config.url.indexOf('?') > -1) {
                config.url += joinedCommonDataStr
            } else {
                config.url += '?' + joinedCommonDataStr.substr(1)
            }
            config.data = qs.stringify(config.data)
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)
// HTTPresponse拦截
service.interceptors.response.use(
    (data) => {
        let res = data
        if (res.status && res.status !== 'SUCCEED') {
            let errMsg = res.errorMessage
            if (!validatenull(errMsg)) {
                console.log(errMsg)
            }
        }
        if (res.status && res.status === 200 && res.data.ReturnCode === 90002) {
            let errMsg = res.data.ReturnMessage
            if (!validatenull(errMsg)) {
                // console.log(errMsg)
                // console.log(router)
                // router.replace({ name: 'signIn' })
                // basicAlerts(res.data.ReturnMessage)
                store.dispatch('auth/logOut')
            }
        }
        // TODO:
        if (res.status && res.status === 200 && res.data.ReturnCode === 30001) {
            // basicAlerts(res.data.ReturnMessage)
            return
        }
        if (res.status && res.status === 200 && res.data.ReturnCode !== 0) {
            basicAlerts(res.data.ReturnMessage)
        }

        return data
    },
    (error) => {
        let errMsg
        if (error && error.response) {
            if (
                error.response.data &&
                error.response.data.status &&
                error.response.data.status === 'FAILED'
            ) {
                errMsg = error.response.data.errorMessage
            }
            if (validatenull(errMsg)) {
                switch (error.response.status) {
                    case 400:
                        errMsg = 'Error request, check request parameters'
                        if (error.response.data.error_description) {
                            errMsg = error.response.data.error_description
                        }
                        break
                    case 401:
                        errMsg = 'The current operation has no permissions'
                        if (
                            error.response.data &&
                            error.response.data.error === 'invalid_token'
                        ) {
                            errMsg = 'Invalid Token'
                            util.cookies.remove('token')
                            util.cookies.remove('uuid')
                            util.removeToken()
                            router.push({
                                name: 'signIn',
                            })
                        }
                        break
                    case 403:
                        errMsg = 'The current operation has no permissions'
                        break
                    case 404:
                        errMsg = 'The resource was not found'
                        break
                    case 405:
                        errMsg = 'The request method is not allowed'
                        break
                    case 408:
                        errMsg = 'The request timeout'
                        break
                    case 478:
                        errMsg = 'Verification code error, please re-enter'
                        break
                    case 479:
                        errMsg = 'Demo environment, no permissions to operate'
                        break
                    case 500:
                        errMsg = 'Server side error'
                        break
                    case 501:
                        errMsg = 'Network not implemented'
                        break
                    case 502:
                        errMsg = 'Network Error'
                        break
                    case 503:
                        errMsg = 'Service unavailable'
                        break
                    case 504:
                        errMsg = 'Network timeout'
                        break
                    case 505:
                        errMsg =
                            'The HTTP version does not support this request'
                        break
                    default:
                        errMsg =
                            'Unknown system error, please feedback to administrator'
                        break
                }
            }
        }

        if (!validatenull(errMsg)) {
            error.message = errMsg
        }
        return Promise.reject(error)
    }
)
export default service
