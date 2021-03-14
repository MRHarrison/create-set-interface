import { renderHook, act } from '@testing-library/react-hooks'
import store from '..';
import useLaunchIndexFund, { useGasPrice, useLaunchState } from './hooks'
import { Provider } from 'react-redux'

describe('launch hooks', () => {
  // @ts-ignore
  const wrapper = ({ children }) => (
    <Provider store={store}>{ children }</Provider>
  );
  test('launch state', () => {
    const { result } = renderHook(() => useLaunchState(), {wrapper})
    expect(result.current).toEqual({
      name: '',
      symbol: '',
      tokens: [{ value: { name: 'Select Asset' } }],
      allocation: 100
    })
  })

  test('gasPrice', () => {
    const { result } = renderHook(() => useGasPrice(), { wrapper })
    expect(result.current).toEqual({
      data: undefined,
      error: undefined
    })
  })

  test('useLaunchIndexFund', () => {
    const { result } = renderHook(() => useLaunchIndexFund(), { wrapper })
    const keys = Object.keys(result.current).sort((a, b) => a.localeCompare(b))
    expect(keys).toEqual([
      'contract',
      'gasFee',
      'handleBasicIssuanceModule',
      'handleFeeModule',
      'handleInitialDeploy',
      'handleTradeModule',
      'isActiveFee',
      'isActiveIssuance',
      'isActiveTrade',
      'setContract',
    ])
  })
})
