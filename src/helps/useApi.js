import { ApiPromise, WsProvider } from '@polkadot/api'
import config from '@/config'
const plasmDefinitions = require('@plasm/types/interfaces/definitions');

function useApi () {
    // Construct
    const wsProvider = new WsProvider(config.polkadotUrl)
    const types = Object.values(plasmDefinitions).reduce((res, { types }) => ({ ...res, ...types }), {
        SmartContract: {
          _enum: {
            Wasm: 'AccountId',
            Evm: 'H160'
          }
        },    
      });
    // Create the instance
    return new ApiPromise({ provider: wsProvider ,
        types: {
            ...types,
            // aliases that don't do well as part of interfaces
            'voting::VoteType': 'VoteType',
            'voting::TallyType': 'TallyType',
            // chain-specific overrides
            Address: 'GenericAddress',
            Keys: 'SessionKeys4',
            StakingLedger: 'StakingLedgerTo223',
            Votes: 'VotesTo230',
            ReferendumInfo: 'ReferendumInfoTo239',
        },
        // override duplicate type name
        typesAlias: { voting: { Tally: 'VotingTally' } },});
  }

  export {useApi}