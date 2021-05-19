import { useApi } from './useApi';
import { ContractPromise } from '@polkadot/api-contract';
import { keyring } from '@polkadot/ui-keyring';
const factoryAbi =require('./abi/factory.json') ;
const tokenAbi =require('./abi/pat_standard.json') ;
const poolAbi =require('./abi/pool.json') ;

export function createPool(accountId,contractAddress, messageAbi, params) {
    const api= useApi();
    const res={isSuccess:0,data:{poolAccount:"",tokenAccount:""}}
    const currentPair = keyring.getPair(accountId);
    const contract = new ContractPromise(api, factoryAbi, contractAddress);
    await contract.exec(messageAbi,{value:0, gasLimit:-1},params).signAndSend(currentPair,(result)=>{
        if (result.status.isFinalized || result.status.isInBlock) {
            res.data.blockHash=result.status.asInBlock.toHex();
            result.events
              .filter(({ event: { section } }) => section === 'system')
              .forEach(({ event: { method,data } }) => {
                if (method === 'ExtrinsicFailed') {
                    res.isSuccess=0;
                } else if (method === 'ExtrinsicSuccess') {
                  res.isSuccess=1;
                }
                else if (method === 'NewAccount'&&res.data.tokenAccount==""){
                    res.data.tokenAccount=data[0].toString()
                }else if (method === 'NewAccount'){
                    res.data.poolAccount=data[0].toString() 
                }
              });
          } else if (result.isError) {
            res.isSuccess=0;
          }
    });
    return res;
}

export function unlock(accountId,tokenAddress,spenderAddress, messageAbi,balance) {
    const api= useApi();
    let res=false;
    const currentPair = keyring.getPair(accountId);
    const contract = new ContractPromise(api, tokenAbi, tokenAddress);
    await contract.exec(messageAbi,{value:0, gasLimit:-1},spenderAddress,balance).signAndSend(currentPair,(result)=>{
        if (result.status.isFinalized || result.status.isInBlock) {
            result.events
              .filter(({ event: { section } }) => section === 'system')
              .forEach(({ event: { method } }) => {
                if (method === 'ExtrinsicFailed') {
                    res=false;
                } else if (method === 'ExtrinsicSuccess') {
                    res=true;
                }
              });
          } else if (result.isError) {
            res=false;
          }
    });
    return res;
}

export function setPublicSwap(accountId,contractAddress) {
    const api= useApi();
    let res=false;
    const currentPair = keyring.getPair(accountId);
    const contract = new ContractPromise(api, poolAbi, contractAddress);
    await contract.setPublicSwap({value:0, gasLimit:-1},true).signAndSend(currentPair,(result)=>{
        if (result.status.isFinalized || result.status.isInBlock) {
            result.events
              .filter(({ event: { section } }) => section === 'system')
              .forEach(({ event: { method } }) => {
                if (method === 'ExtrinsicFailed') {
                    res=false;
                } else if (method === 'ExtrinsicSuccess') {
                    res=true;
                }
              });
          } else if (result.isError) {
            res=false;
          }
    });
    return res;
}


export function setSwapFee(accountId,contractAddress,fee) {
    const api= useApi();
    let res=false;
    const currentPair = keyring.getPair(accountId);
    const contract = new ContractPromise(api, poolAbi, contractAddress);
    await contract.setSwapFee({value:0, gasLimit:-1},fee).signAndSend(currentPair,(result)=>{
        if (result.status.isFinalized || result.status.isInBlock) {
            result.events
              .filter(({ event: { section } }) => section === 'system')
              .forEach(({ event: { method } }) => {
                if (method === 'ExtrinsicFailed') {
                    res=false;
                } else if (method === 'ExtrinsicSuccess') {
                    res=true;
                }
              });
          } else if (result.isError) {
            res=false;
          }
    });
    return res;
}

export function bind(accountId,contractAddress,tokenAddress,denorm,balance) {
    const api= useApi();
    let res=false;
    const currentPair = keyring.getPair(accountId);
    const contract = new ContractPromise(api, poolAbi, contractAddress);
    await contract.bind({value:0, gasLimit:-1},tokenAddress,balance,denorm).signAndSend(currentPair,(result)=>{
        if (result.status.isFinalized || result.status.isInBlock) {
            result.events
              .filter(({ event: { section } }) => section === 'system')
              .forEach(({ event: { method } }) => {
                if (method === 'ExtrinsicFailed') {
                    res=false;
                } else if (method === 'ExtrinsicSuccess') {
                    res=true;
                }
              });
          } else if (result.isError) {
            res=false;
          }
    });
    return res;
}

export function finalize(accountId,contractAddress) {
    const api= useApi();
    let res=false;
    const currentPair = keyring.getPair(accountId);
    const contract = new ContractPromise(api, poolAbi, contractAddress);
    await contract.finalize({value:0, gasLimit:-1}).signAndSend(currentPair,(result)=>{
        if (result.status.isFinalized || result.status.isInBlock) {
            result.events
              .filter(({ event: { section } }) => section === 'system')
              .forEach(({ event: { method } }) => {
                if (method === 'ExtrinsicFailed') {
                    res=false;
                } else if (method === 'ExtrinsicSuccess') {
                    res=true;
                }
              });
          } else if (result.isError) {
            res=false;
          }
    });
    return res;
}

export function joinPool(accountId,contractAddress,poolAmountOut,tokenList) {
    const api= useApi();
    let res=false;
    const currentPair = keyring.getPair(accountId);
    const contract = new ContractPromise(api, poolAbi, contractAddress);
    await contract.joinPool({value:0, gasLimit:-1},poolAmountOut,tokenList).signAndSend(currentPair,(result)=>{
        if (result.status.isFinalized || result.status.isInBlock) {
            result.events
              .filter(({ event: { section } }) => section === 'system')
              .forEach(({ event: { method } }) => {
                if (method === 'ExtrinsicFailed') {
                    res=false;
                } else if (method === 'ExtrinsicSuccess') {
                    res=true;
                }
              });
          } else if (result.isError) {
            res=false;
          }
    });
    return res;
}

export function exitPool(accountId,contractAddress,poolAmountOut,tokenList) {
    const api= useApi();
    let res=false;
    const currentPair = keyring.getPair(accountId);
    const contract = new ContractPromise(api, poolAbi, contractAddress);
    await contract.joinPool({value:0, gasLimit:-1},poolAmountOut,tokenList).signAndSend(currentPair,(result)=>{
        if (result.status.isFinalized || result.status.isInBlock) {
            result.events
              .filter(({ event: { section } }) => section === 'system')
              .forEach(({ event: { method } }) => {
                if (method === 'ExtrinsicFailed') {
                    res=false;
                } else if (method === 'ExtrinsicSuccess') {
                    res=true;
                }
              });
          } else if (result.isError) {
            res=false;
          }
    });
    return res;
}





