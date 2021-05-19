
import { useApi } from './useApi';
import { getSpecTypes } from '@polkadot/types-known';
import { formatBalance, isNumber } from '@polkadot/util';
import { TypeRegistry } from '@polkadot/types/create';
// import { addressDefaults } from '@polkadot/util-crypto/address/defaults';

const registry = new TypeRegistry();
const DEFAULT_DECIMALS = registry.createType('u32', 12);
const DEFAULT_SS58 = registry.createType('u32', 0);
const DEFAULT_AUX = ['Aux1', 'Aux2', 'Aux3', 'Aux4', 'Aux5', 'Aux6', 'Aux7', 'Aux8', 'Aux9'];


async function createInfo (api) {
  await api.isReady;
  return {
    chain: api.rpc.system.chain(),
    genesisHash: api.genesisHash.toHex(),
    //metaCalls: Buffer.from(api.runtimeMetadata.asCallsOnly.toU8a()).toString('base64'),
    specVersion: api.runtimeVersion.specVersion.toNumber(),
    ss58Format: isNumber(api.registry.chainSS58) ? api.registry.chainSS58 : DEFAULT_SS58.toNumber(),
    tokenDecimals: (api.registry.chainDecimals || [DEFAULT_DECIMALS.toNumber()])[0],
    tokenSymbol: (api.registry.chainTokens || formatBalance.getDefaults().unit)[0],
    //types: getSpecTypes(api.registry, systemChain, api.runtimeVersion.specName, api.runtimeVersion.specVersion)
  };
}

export default async function useChainInfo (){
  const api= useApi();
  return createInfo(api);
}
