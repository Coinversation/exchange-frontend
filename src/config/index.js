import merge from 'lodash/merge'
//import registry from '../assets/generated/pm/registry.homestead.json'
//import registryKovan from '../assets/generated/pm/registry.kovan.json'
import homestead from '@/config/homestead.json'
import kovan from '@/config/kovan.json'
import rinkeby from '@/config/rinkeby.json'

const registry = {
    tokens: {
        "VwuS8w4xNRJgyn2KLReJ62gWnawxUxZHTTDTFGnTczYhXRB": {
            "address": "VwuS8w4xNRJgyn2KLReJ62gWnawxUxZHTTDTFGnTczYhXRB",
            "id": "usdc",
            "name": "USD Coin",
            "symbol": "USDC",
            "decimals": 10,
            "precision": 4,
            "color": "#828384",
            'amounts':'',
            'weights':'',
            "hasIcon": false,
            "logoURL": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
          },
          "W5PyAfrvVXi4BcVEEuUrJmvQmcwHRyjbt2u31zePY7QR1gn": {
            "address": "W5PyAfrvVXi4BcVEEuUrJmvQmcwHRyjbt2u31zePY7QR1gn",
            "id": "dai",
            "name": "Dai Stablecoin",
            "symbol": "DAI",
            "decimals": 18,
            "precision": 3,
            "color": "#fab323",
            'amounts':'',
            'weights':'',
            "hasIcon": false,
            "logoURL": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png"
          },
          "Xpmf8aRNQbe1G6L29TUmhPmAkTJa3cEHFv5dU4VXNetpH1D": {
            "address": "Xpmf8aRNQbe1G6L29TUmhPmAkTJa3cEHFv5dU4VXNetpH1D",
            "id": "snx",
            "name": "Synthetix Network Token",
            "symbol": "SNX",
            "decimals": 18,
            "precision": 4,
            "color": "#5eb8aa",
            'amounts':'',
            'weights':'',
            "hasIcon": false,
            "logoURL": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F/logo.png"
          },
    },
    untrusted: [],
}

const configs = { homestead, kovan, rinkeby }
configs.homestead = merge(registry, configs.homestead)
configs.kovan = merge(registry, configs.kovan)
configs.rinkeby = merge(registry, configs.rinkeby)
const network = process.env.VUE_APP_NETWORK || 'homestead'
const config = configs[network]
config.env = process.env.VUE_APP_ENV || 'staging'

export default config
