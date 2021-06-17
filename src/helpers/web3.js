import { useApi } from './useApi'
import { ContractPromise } from '@polkadot/api-contract'
import { keyring } from '@polkadot/ui-keyring'
import store from '@/store'
import {
    web3Accounts,
    web3Enable,
    web3FromSource,
} from '@polkadot/extension-dapp'
import BN from 'bn.js'
import { settings } from '@polkadot/ui-settings'
const factoryAbi = require('@/abi/factory.json')
const tokenAbi = require('@/abi/pat_standard.json')
const poolAbi = require('@/abi/pool.json')

function isKeyringLoaded() {
    try {
        return !!keyring.keyring
    } catch {
        return false
    }
}
const getFromAcct = async () => {
    const {
        address,
        meta: { source, isInjected },
    } = currentPair
    let fromAcct

    // signer is from Polkadot-js browser extension
    if (isInjected) {
        const injected = await web3FromSource(source)
        fromAcct = address
        api.setSigner(injected.signer)
    } else {
        fromAcct = currentPair
    }

    return fromAcct
}

async function getInjectedAccounts(injectedPromise) {
    try {
        await injectedPromise

        const accounts = await web3Accounts()
        console.log('accounts : ' + accounts.length)
        return accounts.map(({ address, meta }, whenCreated) => ({
            address,
            meta: {
                ...meta,
                name: `${meta.name || 'unknown'} (${
                    meta.source === 'polkadot-js' ? 'extension' : meta.source
                })`,
                whenCreated,
            },
        }))
    } catch (error) {
        console.error('web3Enable', error)

        return []
    }
}
const api = useApi()
let currentPair
let tokenCal = 0

export async function createPool(accountId, factory, params) {
    store.commit('PAGE_LOADING', true)
    console.log(params)
    const tokenNum = params.token.length
    tokenCal=0
    await api.isReady
    let res = { isSuccess: 0, data: { poolAccount: '', tokenAccount: '' } }
    //const injectedPromise = await web3Enable('polkadot-js/apps');
    //let injectedAccounts=await getInjectedAccounts(injectedPromise);
    // isKeyringLoaded() || keyring.loadAll({
    //   genesisHash: api.genesisHash,
    //   isDevelopment:true,
    //   ss58Format:api.registry.chainSS58,
    //   type: 'sr25519'
    // }, injectedAccounts);
    //console.log('getPairs.length:'+keyring.getPairs().length)
    await web3Enable('polkadot-js/apps')
    let injectedAccounts = await web3Accounts()
    console.log(injectedAccounts)
    console.log(isKeyringLoaded())
    injectedAccounts = injectedAccounts.map(({ address, meta }) => ({
        address,
        meta: { ...meta, name: `${meta.name} (${meta.source})` },
    }))
    isKeyringLoaded() || keyring.loadAll({ isDevelopment: true }, injectedAccounts)
    const salt = new Date()
        .getTime()
        .toString()
        .substring(0, 9)
    const tokenEndowment = 20000n * 10000000000n
    const poolEndowment = 20000n * 10000000000n
    currentPair = keyring.getPair(accountId)
    // if (currentPair.isLocked){
    //   currentPair.unlock();
    // }
    const fromAcct = await getFromAcct()
    const { nonce } = await api.query.system.account(accountId)
    let currentNonce = new BN(nonce.toString())
    console.log(currentNonce)
    let contract = new ContractPromise(api, factoryAbi, factory)
    await contract.tx
        .newPool(
            { value: 0, gasLimit: -1 },
            salt,
            tokenEndowment,
            poolEndowment
        )
        .signAndSend(fromAcct, { nonce: currentNonce }, (result) => {
            if (result.status.isInBlock) {
                res.data.blockHash = result.status.asInBlock.toHex()
                console.log(res.data.blockHash)
                result.events
                    .filter(({ event: { section } }) => section === 'system')
                    .forEach(({ event: { method, data } }) => {
                        if (method === 'ExtrinsicFailed') {
                            res.isSuccess = 0
                        } else if (method === 'ExtrinsicSuccess') {
                            res.isSuccess = 1
                        } else if (
                            method === 'NewAccount' &&
                            res.data.tokenAccount == ''
                        ) {
                            res.data.tokenAccount = data[0].toString()
                        } else if (method === 'NewAccount') {
                            res.data.poolAccount = data[0].toString()
                            store.commit('POOL_ACCOUNT', res.data.poolAccount)
                        }
                    })
                console.log(res)
                currentNonce = currentNonce.add(new BN(1))
                setSwapFee(
                    res.data.poolAccount,
                    parseFloat(params.swapFee) * 100000,
                    currentNonce
                )
                params.token.forEach(({ address, amounts, weights }) => {
                    currentNonce = currentNonce.add(new BN(1))
                    let amount = new BN(amounts * Math.pow(10, 10))
                    let tempNonce = currentNonce
                    console.log(address)
                    console.log(amount.toNumber())
                    unlock(
                        address,
                        res.data.poolAccount,
                        amount,
                        weights,
                        tempNonce,
                        params.token.length
                    )
                })
                if (tokenCal == tokenNum) {
                    finalize(
                        res.data.poolAccount,
                        currentNonce.add(new BN(1 + params.token.length))
                    )
                }
                return res
            } else if (result.isError) {
                res.isSuccess = 0
                console.log(res)
                return res
            } else if (result.status.isFinalized) {
                
            }
        })
}

export async function unlock(
    tokenAddress,
    spenderAddress,
    balance,
    weights,
    nonce,
    tokenLength
) {
    console.log('unlock nonce:' + nonce)
    let fromAcct = await getFromAcct()
    let contract = new ContractPromise(api, tokenAbi, tokenAddress)
    await contract.tx['iPat,approve'](
        { value: 0, gasLimit: -1 },
        spenderAddress,
        balance
    ).signAndSend(fromAcct, { nonce }, (result) => {
        if (result.status.isInBlock) {
            console.log(result.status.asInBlock.toHex())
            result.events
                .filter(({ event: { section } }) => section === 'system')
                .forEach(({ event: { method } }) => {
                    if (method === 'ExtrinsicFailed') {
                        console.log(tokenAddress + ' unlock is fail')
                    } else if (method === 'ExtrinsicSuccess') {
                        console.log(tokenAddress + ' unlock is success')
                        bind(
                            spenderAddress,
                            tokenAddress,
                            weights,
                            balance,
                            nonce.add(new BN(tokenLength))
                        )
                    }
                })
        } else if (result.isError) {
            console.log(tokenAddress + ' unlock is error')
        }
    })
}

export async function bind(
    contractAddress,
    tokenAddress,
    weights,
    balance,
    nonce
) {
    console.log('bind nonce:' + nonce)
    let fromAcct = await getFromAcct()
    let denorm = new BN(weights + '0000000000')
    let contract = new ContractPromise(api, poolAbi, contractAddress)
    await contract.tx['bind'](
        { value: 0, gasLimit: -1 },
        tokenAddress,
        balance,
        denorm
    ).signAndSend(fromAcct, { nonce }, (result) => {
        if (result.status.isInBlock) {
            result.events
                .filter(({ event: { section } }) => section === 'system')
                .forEach(({ event: { method } }) => {
                    if (method === 'ExtrinsicFailed') {
                        console.log(tokenAddress + ' bind is fail')
                    } else if (method === 'ExtrinsicSuccess') {
                        console.log(tokenAddress + ' bind is success')
                        tokenCal++
                        console.log(tokenCal)
                    }
                })
        } else if (result.isError) {
            console.log(tokenAddress + ' bind is error')
        }
    })
}

export async function setSwapFee(contractAddress, fee, nonce) {
    console.log('setSwapFee nonce:' + nonce)
    let fromAcct = await getFromAcct()
    let contract = new ContractPromise(api, poolAbi, contractAddress)
    await contract.tx['setSwapFee'](
        { value: 0, gasLimit: -1 },
        fee
    ).signAndSend(fromAcct, { nonce }, (result) => {
        if (result.status.isInBlock) {
            console.log(result.status.asInBlock.toHex())
            result.events
                .filter(({ event: { section } }) => section === 'system')
                .forEach(({ event: { method } }) => {
                    if (method === 'ExtrinsicFailed') {
                        console.log(contractAddress + ' setSwapFee is fail')
                    } else if (method === 'ExtrinsicSuccess') {
                        console.log(contractAddress + ' setSwapFee is success')
                    }
                })
        } else if (result.isError) {
            console.log(contractAddress + ' setSwapFee is error')
        }
    })
}

export async function finalize(contractAddress, nonce) {
    console.log('finalize nonce:' + nonce)
    let fromAcct = await getFromAcct()
    let contract = new ContractPromise(api, poolAbi, contractAddress)
    await contract.tx['finalize']({ value: 0, gasLimit: -1 }).signAndSend(
        fromAcct,
        { nonce },
        (result) => {
            if (result.status.isInBlock) {
                result.events
                    .filter(({ event: { section } }) => section === 'system')
                    .forEach(({ event: { method } }) => {
                        if (method === 'ExtrinsicFailed') {
                            console.log(contractAddress + ' finalize is fail')
                        } else if (method === 'ExtrinsicSuccess') {
                            console.log(
                                contractAddress + ' finalize is success'
                            )
                            store.commit('PAGE_LOADING', false)
                            // getPoolAddress()
                        }
                    })
            } else if (result.isError) {
                console.log(contractAddress + ' finalize is error')
            }
        }
    )
}

export async function getPoolDetails(poolAddress,account) {
    let result={};
    result.poolID=poolAddress;
    result.accountID=account;
    result.finalize=await getPoolMessage(poolAddress,account,'finalize',[]);
    result.controllerID=await getPoolMessage(poolAddress,account,'getController',[]);
    result.swapFee=await getPoolMessage(poolAddress,account,'getSwapFee',[]);
    result.cptAmount=await getPoolMessage(poolAddress,account,'balanceOf',[]);
    result.denormal=await getPoolMessage(poolAddress,account,'getTotalDenormalizedWeight',[account]);
    result.tokenNums=await getPoolMessage(poolAddress,account,'getNumTokens',[]);
    return result;
}

export async function getPoolMessage(poolAddress,account,message,params){
    let contract = new ContractPromise(api, poolAbi, poolAddress);
    let { result,output } = await contract.query[message](account,{ value: 0, gasLimit: -1 },...params);
    if (result.isOk){
        return output.toHuman();
    }
    else{
        return result.asErr;
    }
}

export async function joinPool(contractAddress, poolAmountOut, tokenList) {
    let fromAcct = await getFromAcct()
    let contract = new ContractPromise(api, poolAbi, contractAddress)
    await contract.tx['joinPool'](
        { value: 0, gasLimit: -1 },
        poolAmountOut,
        tokenList
    ).signAndSend(fromAcct, (result) => {
        if (result.status.isFinalized || result.status.isInBlock) {
            result.events
                .filter(({ event: { section } }) => section === 'system')
                .forEach(({ event: { method } }) => {
                    if (method === 'ExtrinsicFailed') {
                        console.log(contractAddress + ' joinPool is fail')
                    } else if (method === 'ExtrinsicSuccess') {
                        console.log(contractAddress + ' joinPool is success')
                    }
                })
        } else if (result.isError) {
            console.log(contractAddress + ' joinPool is error')
        }
    })
}

export async function exitPool(contractAddress, poolAmountOut, tokenList) {
    let fromAcct = await getFromAcct()
    let contract = new ContractPromise(api, poolAbi, contractAddress)
    await contract.tx['exitPool'](
        { value: 0, gasLimit: -1 },
        poolAmountOut,
        tokenList
    ).signAndSend(fromAcct, (result) => {
        if (result.status.isFinalized || result.status.isInBlock) {
            result.events
                .filter(({ event: { section } }) => section === 'system')
                .forEach(({ event: { method } }) => {
                    if (method === 'ExtrinsicFailed') {
                        console.log(contractAddress + ' exitPool is fail')
                    } else if (method === 'ExtrinsicSuccess') {
                        console.log(contractAddress + ' exitPool is success')
                    }
                })
        } else if (result.isError) {
            console.log(contractAddress + ' exitPool is error')
        }
    })
}
