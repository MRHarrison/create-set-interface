import { createStore, Store } from 'redux'
import { addToken, removeToken, setAllocation, setFormData } from './actions'
import reducer, { LaunchState } from './reducer'

describe('launch reducer', () => {
  let store: Store<LaunchState>

  beforeEach(() => {
    store = createStore(reducer, {
      name: '',
      symbol: '',
      price: 100,
      tokens: [{value: { "address": "0xe41d2489571d322189246dafa5ebde1f4699f498", "name": "0x", "logo_url": "https://assets.coingecko.com/coins/images/863/small/0x.png", "symbol": "ZRX", "decimals": 18 }}],
      allocation: 100
    })
  })

  describe('setAllocation', () => {
    it('changes allocation', () => {
      store.dispatch(
        setAllocation(50)
      )

      expect(store.getState()).toEqual({
        name: '',
        symbol: '',
        price: 100,
        tokens: [{ value: { "address": "0xe41d2489571d322189246dafa5ebde1f4699f498", "name": "0x", "logo_url": "https://assets.coingecko.com/coins/images/863/small/0x.png", "symbol": "ZRX", "decimals": 18 } }],
        allocation: 50
      })
    })
  })

  describe('setFormData', () => {
    it('sets the form data', () => {
      store.dispatch(
        setFormData({
          name: 'Test Fund',
          symbol: 'TFF',
          price: 100,
          tokens: [{ value: { "address": "0xe41d2489571d322189246dafa5ebde1f4699f498", "name": "0x", "logo_url": "https://assets.coingecko.com/coins/images/863/small/0x.png", "symbol": "ZRX", "decimals": 18 } }],
        })
      )

      expect(store.getState()).toEqual({
        name: 'Test Fund',
        symbol: 'TFF',
        price: 100,
        tokens: [{ value: { "address": "0xe41d2489571d322189246dafa5ebde1f4699f498", "name": "0x", "logo_url": "https://assets.coingecko.com/coins/images/863/small/0x.png", "symbol": "ZRX", "decimals": 18 } }],
        allocation: 100
      })
    })
  })
  describe('removeToken', () => {
    it('removes a token', () => {
      store.dispatch(
        removeToken('0xe41d2489571d322189246dafa5ebde1f4699f498')
      )

      expect(store.getState()).toEqual({
        name: '',
        symbol: '',
        price: 100,
        tokens: [],
        allocation: 100
      })
    })
  })
  describe('addToken', () => {
    it('adds a token', () => {
      store.dispatch(
        addToken({ "address": "0x80fb784b7ed66730e8b1dbd9820afd29931aab03", "name": "Aave  OLD ", "symbol": "LEND", "decimals": 18, "logo_url": "https://logos.covalenthq.com/tokens/0x80fb784b7ed66730e8b1dbd9820afd29931aab03.png" })
      )

      expect(store.getState()).toEqual({
        name: '',
        symbol: '',
        price: 100,
        tokens: [
          { value: { "address": "0xe41d2489571d322189246dafa5ebde1f4699f498", "name": "0x", "logo_url": "https://assets.coingecko.com/coins/images/863/small/0x.png", "symbol": "ZRX", "decimals": 18 } },
          { value: { "address": "0x80fb784b7ed66730e8b1dbd9820afd29931aab03", "name": "Aave  OLD ", "symbol": "LEND", "decimals": 18, "logo_url": "https://logos.covalenthq.com/tokens/0x80fb784b7ed66730e8b1dbd9820afd29931aab03.png" }}
        ],
        allocation: 100
      })
    })
  })
})
