import merge from 'lodash/merge'
//import registry from '../assets/generated/pm/registry.homestead.json'
//import registryKovan from '../assets/generated/pm/registry.kovan.json'
import homestead from '@/config/homestead.json'
import kovan from '@/config/kovan.json'
import rinkeby from '@/config/rinkeby.json'

const registry = {
    tokens: {
        "16mSvEhDyrMgMZr5MzzhrtkbHwLi6zUuMeTmwVwQMqyqQ2mg": {
            "address": "16mSvEhDyrMgMZr5MzzhrtkbHwLi6zUuMeTmwVwQMqyqQ2mg",
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
          "15oTkEAc85Nvk7ajTgy1F8etmhfcbsbL8SbxNKeozVQJa8jC": {
            "address": "15oTkEAc85Nvk7ajTgy1F8etmhfcbsbL8SbxNKeozVQJa8jC",
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
          "14cVdxPtrd1ZUrYkCMcKW2YfBbwCR4t27Yi5jg4iFFnYLttt": {
            "address": "14cVdxPtrd1ZUrYkCMcKW2YfBbwCR4t27Yi5jg4iFFnYLttt",
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

const configs = { homestead, kovan }
configs.homestead = merge(registry, configs.homestead)
configs.kovan = merge(registry, configs.kovan)
//configs.rinkeby = merge(registry, configs.rinkeby)
const network = process.env.VUE_APP_NETWORK || 'homestead'
console.log(network)
const config = configs[network]
console.log(kovan)
console.log(configs.kovan)
config.env = process.env.VUE_APP_ENV || 'staging'

export default config
