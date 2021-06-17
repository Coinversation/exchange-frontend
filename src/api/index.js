import request from '@/plugin/axios'
// import md5 from 'js-md5'

/**
 * 登录
 */
export const signInByUsername = (username, password, session_id) => {
    return request({
        url: '/login',
        method: 'post',
        data: {
            username: username,
            password: password,
            session_id: session_id,
        },
    })
}

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
    return request({
        url: '/admin/user/info',
        method: 'get',
    })
}

/**
 * 退出登录
 * @param {请求token} accesstoken
 */
export const logout = (accesstoken) => {
    return request({
        url: '/auth/authentication/removeToken',
        method: 'post',
        params: { accesstoken },
    })
}

export const operatorList = (page, limit) => {
    return request({
        url: '/operator/list',
        method: 'get',
        params: {
            page: page,
            limit: limit,
        },
    })
}

export const getMenus = () => {
    return request({
        url: '/operator/menus',
        method: 'get',
    })
}

export const deleteOperator = (target_operator_id) => {
    return request({
        url: '/operator/delete',
        method: 'post',
        data: {
            target_operator_id: target_operator_id,
        },
    })
}

export const resetPwd = (target_operator_id) => {
    return request({
        url: '/operator/reset_pwd',
        method: 'post',
        data: {
            target_operator_id: target_operator_id,
        },
    })
}

export const updateMenus = (target_operator_id, menusStr) => {
    return request({
        url: '/operator/update_menus',
        method: 'post',
        data: {
            target_operator_id: target_operator_id,
            menus: menusStr,
        },
    })
}

export const updatePhone = (phone) => {
    return request({
        url: '/operator/update_phone',
        method: 'post',
        data: {
            phone: phone,
        },
    })
}

// TODO:  type  (0: signIn pwd ;1 :fund pwd;)
export const updatePwd = (pwdType, originalPwd, newPwd) => {
    return request({
        url: '/operator/update_pwd',
        method: 'post',
        data: {
            type: pwdType,
            old_pwd: originalPwd,
            new_pwd: newPwd,
        },
    })
}

export const queryInfo = () => {
    return request({
        url: '/operator/query',
        method: 'get',
    })
}

export const queryContact = (page, limit) => {
    return request({
        url: '/operator/query_contact',
        method: 'get',
        params: {
            page: page,
            limit: limit,
        },
    })
}

export const addContacts = (e) => {
    return request({
        url: '/operator/add_contacts',
        method: 'post',
        data: {
            contacts: e,
        },
    })
}

export const deleteContacts = (contact_id) => {
    return request({
        url: '/operator/delete_contact',
        method: 'post',
        data: {
            contact_id: contact_id,
        },
    })
}

export const listContacts = () => {
    return request({
        url: '/operator/list_contacts',
        method: 'get',
    })
}

// asset

export const fcList = (page, limit, flg) => {
    return request({
        url: '/asset/fc_list',
        method: 'get',
        params: {
            page: page,
            limit: limit,
            flg: flg,
        },
    })
}

export const prepareTransfer = (
    contact_id,
    token_id,
    amount,
    purpose,
    fund_pwd
) => {
    return request({
        url: '/asset/prepare_transfer',
        method: 'post',
        data: {
            contact_id: contact_id,
            token_id: token_id,
            amount: amount,
            purpose: purpose,
            fund_pwd: md5(fund_pwd),
        },
    })
}

export const stellarAmount = () => {
    return request({
        url: '/asset/stellar_amount',
        method: 'get',
    })
}

export const veloExchange = (amount, fund_pwd) => {
    return request({
        url: '/asset/velo_exchange',
        method: 'post',
        data: {
            amount: amount,
            fund_pwd: md5(fund_pwd),
        },
    })
}

export const prepareMint = (data) => {
    return request({
        url: '/asset/prepare_mint1',
        method: 'post',
        data: {
            pegged_value: data.pegged_amount,
            pegged_currency: data.pegged_currency,
            fiat_currency: data.fiat_currency,
            purpose: data.purpose,
            fund_pwd: md5(data.fundPwd),
        },
    })
}

export const approveMint = (mint_id, approve_type, fund_pwd) => {
    // approve_type  A||F
    return request({
        url: '/asset/approve_mint1',
        method: 'post',
        data: {
            mint_id: mint_id,
            approve_type: approve_type,
            fund_pwd: md5(fund_pwd),
        },
    })
}

export const listMint = () => {
    return request({
        url: '/asset/list_mint',
        method: 'get',
    })
}

export const listTransfer = () => {
    return request({
        url: '/asset/list_transfer',
        method: 'get',
    })
}

export const approveTransfer = (transfer_id, approve_type, fund_pwd) => {
    // approve_type  A||F
    return request({
        url: '/asset/approve_transfer',
        method: 'post',
        data: {
            transfer_id: transfer_id,
            approve_type: approve_type,
            fund_pwd: md5(fund_pwd),
        },
    })
}

export const transferHistory = (page, limit) => {
    return request({
        url: '/asset/transfer_history',
        method: 'get',
        params: {
            page: page,
            limit: limit,
        },
    })
}

export const bindAddress = (bind_type, private_key) => {
    return request({
        url: '/asset/bind_address',
        method: 'post',
        data: {
            bind_type: bind_type,
            private_key: private_key,
            // public_key: public_key,
        },
    })
}

export const mintInfo = (page, limit) => {
    return request({
        url: '/asset/mint_info',
        method: 'get',
        params: {
            page: page,
            limit: limit,
        },
    })
}

export const address = () => {
    return request({
        url: '/asset/address',
        method: 'get',
    })
}

export const rate = (target) => {
    return request({
        url: '/common/rate',
        method: 'get',
        params: {
            base: 'USD',
            target: target,
        },
    })
}

export const tokenDetails = (token_id) => {
    return request({
        url: '/asset/token_details',
        method: 'get',
        params: {
            token_id: token_id,
        },
    })
}

export const redeem = (token_id, amount, fund_pwd) => {
    return request({
        url: '/asset/redeem',
        method: 'post',
        data: {
            token_id: token_id,
            amount: amount,
            fund_pwd: md5(fund_pwd),
        },
    })
}

export const stellarRecords = (page, limit) => {
    return request({
        url: '/asset/stellar_records',
        method: 'get',
        params: {
            page: page,
            limit: limit,
        },
    })
}

export const tokenRecords = (token_id, page, limit) => {
    return request({
        url: '/asset/token_records',
        method: 'get',
        params: {
            token_id: token_id,
            page: page,
            limit: limit,
        },
    })
}

export const operatorNotify = (limit) => {
    return request({
        url: '/operator/notify',
        method: 'get',
        params: {
            // token_id: token_id,
            // page: page,
            limit: limit,
        },
    })
}

export const assetProportion = () => {
    return request({
        url: '/asset/proportion',
        method: 'get',
    })
}

export const assetToken = (name) => {
    return request({
        url: '/asset/token',
        method: 'get',
        params: {
            name: name,
        },
    })
}

export const matrixportBalance = () => {
    return request({
        url: '/asset/matrixport_balance',
        method: 'get',
    })
}

export const matrixportStaking = (fund_pwd) => {
    return request({
        url: '/asset/matrixport_staking',
        method: 'post',
        data: {
            fund_pwd: md5(fund_pwd),
        },
    })
}

export const currency = () => {
    return request({
        url: '/asset/currency',
        method: 'get',
    })
}

export const create = () => {
    return request({
        url: '/api/v1/pool/create',
        method: 'post',
        data: {
            poolID: '',
            controllerID: '',
            tokenNums: '',
            swapFee: '',
            finalize: '',
            cptAmount: '',
            denormal: '',
        },
    })
}
