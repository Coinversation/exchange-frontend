import { useApi } from './useApi';
import { ContractPromise } from '@polkadot/api-contract';
import { keyring } from '@polkadot/ui-keyring';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
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
const injectedPromise =  web3Enable('polkadot-js/apps');
async function getInjectedAccounts (injectedPromise){
  try {
    await injectedPromise;

    const accounts = await web3Accounts();

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
export async function createPool(accountId,contractAddress, messageAbi, params) {
    let api= useApi();
    await api.isReady;
    let res={isSuccess:0,data:{poolAccount:"",tokenAccount:""}}
    // keyring.loadAll({
    //   genesisHash: api.genesisHash,
    //   isDevelopment:true,
    //   ss58Format:0,
    //   store:new MemoryStore() ,
    //   type:  'ed25519'
    // });
    
    
   
    let injectedAccounts=await getInjectedAccounts(injectedPromise);
    console.log(isKeyringLoaded());
    isKeyringLoaded() || keyring.loadAll({
      genesisHash: api.genesisHash,
      isDevelopment:true,
      ss58Format:api.registry.chainSS58,
      type: 'sr25519'
    }, injectedAccounts);
    
    const salt = 1621240222;
    const tokenEndowment=3100000n * 1000000000000n;
    const poolEndowment=3200000n * 1000000000000n;
    console.log("aaa");
    const currentPair = keyring.getPair(accountId);
    if (currentPair.isLocked){
      currentPair.unlock();
    }
    console.log("1212");
    let contract = new ContractPromise(api, factoryAbi, contractAddress);
    await contract.tx.newPool({value:0, gasLimit:-1},salt,tokenEndowment,poolEndowment).signAndSend(currentPair,(result)=>{
        if (result.status.isFinalized || result.status.isInBlock) {
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
          } else if (result.isError) {
            res.isSuccess=0;
          }
    });
    console.log(res);
    return res;
}

export async function unlock(accountId,tokenAddress,spenderAddress, messageAbi,balance) {
    let api= useApi();
    let res=false;
    const currentPair = keyring.getPair(accountId);
    let contract = new ContractPromise(api, tokenAbi, tokenAddress);
    await contract.tx[messageAbi]({value:0, gasLimit:-1},spenderAddress,balance).signAndSend(currentPair,(result)=>{
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

export async function setPublicSwap(accountId,contractAddress) {
    let api= useApi();
    let res=false;
    const currentPair = keyring.getPair(accountId);
    let contract = new ContractPromise(api, poolAbi, contractAddress);
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


export async function setSwapFee(accountId,contractAddress,fee) {
    let api= useApi();
    let res=false;
    const currentPair = keyring.getPair(accountId);
    let contract = new ContractPromise(api, poolAbi, contractAddress);
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

export async function bind(accountId,contractAddress,tokenAddress,denorm,balance) {
    let api= useApi();
    let res=false;
    const currentPair = keyring.getPair(accountId);
    let contract = new ContractPromise(api, poolAbi, contractAddress);
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

export async function finalize(accountId,contractAddress) {
    let api= useApi();
    let res=false;
    const currentPair = keyring.getPair(accountId);
    let contract = new ContractPromise(api, poolAbi, contractAddress);
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

export async function joinPool(accountId,contractAddress,poolAmountOut,tokenList) {
    let api= useApi();
    let res=false;
    const currentPair = keyring.getPair(accountId);
    let contract = new ContractPromise(api, poolAbi, contractAddress);
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

export async function exitPool(accountId,contractAddress,poolAmountOut,tokenList) {
    let api= useApi();
    let res=false;
    const currentPair = keyring.getPair(accountId);
    let contract = new ContractPromise(api, poolAbi, contractAddress);
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





