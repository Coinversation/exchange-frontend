import merge from 'lodash/merge'
//import registry from '../assets/generated/pm/registry.homestead.json'
//import registryKovan from '../assets/generated/pm/registry.kovan.json'
import homestead from '@/config/homestead.json'
import kovan from '@/config/kovan.json'
import rinkeby from '@/config/rinkeby.json'

const registry = {
    tokens: {
        "16KPHXYgRV8iixHAxj3ToJqymxu3wKvicvcM4giqB61hPXKB": {
            "address": "16KPHXYgRV8iixHAxj3ToJqymxu3wKvicvcM4giqB61hPXKB",
            "id": "usdc",
            "name": "USD Coin",
            "symbol": "USDC",
            "decimals": 10,
            "precision": 4,
            "color": "#828384",
            "hasIcon": false,
            "logoURL": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png"
          },
          "1ZB5xh2HWDDjQKKC99BL7ntkeLUADzWCmwc3GBqVXYQfh9X": {
            "address": "1ZB5xh2HWDDjQKKC99BL7ntkeLUADzWCmwc3GBqVXYQfh9X",
            "id": "dai",
            "name": "Dai Stablecoin",
            "symbol": "DAI",
            "decimals": 18,
            "precision": 3,
            "color": "#fab323",
            "hasIcon": false,
            "logoURL": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png"
          },
          "1ZqzwjuqDyzuSyV1X3RNXko4CuomRX5TgXcVP8F4oiCYFk5": {
            "address": "1ZqzwjuqDyzuSyV1X3RNXko4CuomRX5TgXcVP8F4oiCYFk5",
            "id": "snx",
            "name": "Synthetix Network Token",
            "symbol": "SNX",
            "decimals": 18,
            "precision": 4,
            "color": "#5eb8aa",
            "hasIcon": false,
            "logoURL": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png"
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
