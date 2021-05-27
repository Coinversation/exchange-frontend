import { useApi } from './useApi';
import { ContractPromise } from '@polkadot/api-contract';
import { keyring } from '@polkadot/ui-keyring';
import { web3Accounts, web3Enable,web3FromSource } from '@polkadot/extension-dapp';
import BN from 'bn.js';
import { settings } from '@polkadot/ui-settings';
const factoryAbi =require('@/abi/factory.json') ;
const tokenAbi =require('@/abi/pat_standard.json') ;
const poolAbi =require('@/abi/pool.json') ;

function isKeyringLoaded () {
  try {
    return !!keyring.keyring;
  } catch {
    return false;
  }
}
const getFromAcct = async () => {
  const {
    address,
    meta: { source, isInjected }
  } = currentPair;
  let fromAcct;

  // signer is from Polkadot-js browser extension
  if (isInjected) {
    const injected = await web3FromSource(source);
    fromAcct = address;
    api.setSigner(injected.signer);
  } else {
    fromAcct = currentPair;
  }

  return fromAcct;
};

async function getInjectedAccounts (injectedPromise){
  try {
    await injectedPromise;

    const accounts = await web3Accounts();
    console.log("accounts : "+accounts.length)
    return accounts.map(({ address, meta }, whenCreated) => ({
      address,
      meta: {
        ...meta,
        name: `${meta.name || 'unknown'} (${meta.source === 'polkadot-js' ? 'extension' : meta.source})`,
        whenCreated
      }
    }));
  } catch (error) {
    console.error('web3Enable', error);

    return [];
  }
}
const api= useApi();
let currentPair;
export async function createPool(accountId,factory,params) {
    await api.isReady;
    console.log(params);
    let res={isSuccess:0,data:{poolAccount:"",tokenAccount:""}}
    //const injectedPromise = await web3Enable('polkadot-js/apps');
    //let injectedAccounts=await getInjectedAccounts(injectedPromise);
    // isKeyringLoaded() || keyring.loadAll({
    //   genesisHash: api.genesisHash,
    //   isDevelopment:true,
    //   ss58Format:api.registry.chainSS58,
    //   type: 'sr25519'
    // }, injectedAccounts);
    //console.log('getPairs.length:'+keyring.getPairs().length)
    await web3Enable('polkadot-js/apps');
    let injectedAccounts = await web3Accounts();
    console.log(injectedAccounts)
    console.log(isKeyringLoaded())
    injectedAccounts = injectedAccounts.map(({ address, meta }) =>
        ({ address, meta: { ...meta, name: `${meta.name} (${meta.source})` } }));
    keyring.loadAll({ isDevelopment: true }, injectedAccounts);
    const salt = new Date().getTime().toString().substring(0,9);
    const tokenEndowment=3100000n * 1000000000000n;
    const poolEndowment=3200000n * 1000000000000n;
    currentPair= keyring.getPair(accountId);
    // if (currentPair.isLocked){
    //   currentPair.unlock();
    // }
    const fromAcct = await getFromAcct();
    const { nonce } = await api.query.system.account(accountId);
    let currentNonce = new BN(nonce.toString());
    console.log(currentNonce);
    let contract = new ContractPromise(api, factoryAbi, factory);
    await contract.tx.newPool({value:0, gasLimit:-1},salt,tokenEndowment,poolEndowment).signAndSend(fromAcct,{nonce:currentNonce},(result)=>{
        if (result.status.isInBlock) {
            res.data.blockHash=result.status.asInBlock.toHex();
            console.log(res.data.blockHash);
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
              console.log(res);
              return res;
          } else if (result.isError) {
            res.isSuccess=0;
            console.log(res);
            return res;
          } else if (result.status.isFinalized) {
            currentNonce = currentNonce.add(new BN(1))
            setSwapFee(res.data.poolAccount,parseFloat(params.swapFee)*100000,currentNonce)
            currentNonce = currentNonce.add(new BN(1));
            params.token.forEach(({address,amounts,weights})=>{
              let amount=new BN(amounts)
              let tempNonce=currentNonce;
              console.log(res.data.poolAccount)
              console.log(amount.toNumber())
              unlock(address,res.data.poolAccount,amounts,tempNonce)
              currentNonce = currentNonce.add(new BN(1))
            })
          }
          
          
    });
    
}

export async function unlock(tokenAddress,spenderAddress,balance,nonce) {
  let fromAcct = await getFromAcct();
    let contract = new ContractPromise(api, tokenAbi, tokenAddress);
    await contract.tx['iPat,approve']({value:0, gasLimit:-1},spenderAddress,balance).signAndSend(fromAcct,{nonce},(result)=>{
        if (result.status.isInBlock) {
            console.log(result.status.asInBlock.toHex())
            result.events
              .filter(({ event: { section } }) => section === 'system')
              .forEach(({ event: { method } }) => {
                if (method === 'ExtrinsicFailed') {
                  console.log(tokenAddress+" unlock is fail");
                } else if (method === 'ExtrinsicSuccess') {
                  console.log(tokenAddress+" unlock is success");
                }
              });
          } else if (result.isError) {
            console.log(tokenAddress+" unlock is error");
          }
    });
}

export async function setPublicSwap(contractAddress) {
    let res=false;
    let contract = new ContractPromise(api, poolAbi, contractAddress);
    await contract.tx['setPublicSwap']({value:0, gasLimit:-1},true).signAndSend(currentPair,(result)=>{
        if (result.status.isInBlock) {
            console.log(result.status.asInBlock.toHex())
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


export async function setSwapFee(contractAddress,fee,nonce) {
  let fromAcct = await getFromAcct();
    let contract = new ContractPromise(api, poolAbi, contractAddress);
    await contract.tx["setSwapFee"]({value:0, gasLimit:-1},fee).signAndSend(fromAcct,{nonce},(result)=>{
        if (result.status.isInBlock) {
          console.log(result.status.asInBlock.toHex())
            result.events
              .filter(({ event: { section } }) => section === 'system')
              .forEach(({ event: { method } }) => {
                if (method === 'ExtrinsicFailed') {
                  console.log(contractAddress+" setSwapFee is fail");
                } else if (method === 'ExtrinsicSuccess') {
                  console.log(contractAddress+" setSwapFee is success");
                }
              });
          } else if (result.isError) {
            console.log(contractAddress+" setSwapFee is error");
          }
    });
}

export async function bind(contractAddress,tokenAddress,denorm,balance) {
    let res=false;
    let contract = new ContractPromise(api, poolAbi, contractAddress);
    await contract.tx["bind"]({value:0, gasLimit:-1},tokenAddress,balance,denorm).signAndSend(currentPair,(result)=>{
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

export async function finalize(contractAddress) {
    let res=false;
    let contract = new ContractPromise(api, poolAbi, contractAddress);
    await contract.tx['finalize']({value:0, gasLimit:-1}).signAndSend(currentPair,(result)=>{
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

export async function joinPool(contractAddress,poolAmountOut,tokenList) {
    let res=false;
    let contract = new ContractPromise(api, poolAbi, contractAddress);
    await contract.tx['joinPool']({value:0, gasLimit:-1},poolAmountOut,tokenList).signAndSend(currentPair,(result)=>{
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

export async function exitPool(contractAddress,poolAmountOut,tokenList) {
    let res=false;
    let contract = new ContractPromise(api, poolAbi, contractAddress);
    await contract.tx['exitPool']({value:0, gasLimit:-1},poolAmountOut,tokenList).signAndSend(currentPair,(result)=>{
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





