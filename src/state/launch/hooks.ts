import { useWeb3React } from '@web3-react/core'
import { BigNumber, Contract } from 'ethers'
import { useSelector } from 'react-redux'
import useSWR from 'swr'

import { TransactionResponse } from "@ethersproject/abstract-provider";
import { AppState } from '..'
import { useState } from 'react';

import SET_ABI from '../../constants/set-abi.json'
import ISSUANCE_ABI from '../../constants/basic-issuance-abi.json'
import STREAMING_ABI from '../../constants/streaming-fee-abi.json'
import TRADING_ABI from '../../constants/trading-abi.json'
import { Utils } from '../../constants/utils';
import { unitsBN } from '../../utils/common';
import { TokenValue } from './reducer';


interface FeeState {
  feeRecipient: string                  // Address to accrue fees to
  maxStreamingFeePercentage: BigNumber      // Max streaming fee manager commits to using (1% = 1e16, 100% = 1e18)
  streamingFeePercentage: BigNumber         // Percent of Set accruing to manager annually (1% = 1e16, 100% = 1e18)
  lastStreamingFeeTimestamp: BigNumber     // Timestamp last streaming fee was accrued
}


export function useLaunchState(): AppState['launch'] {
  return useSelector<AppState, AppState['launch']>(state => state.launch)
}

export const useGasPrice = () => {
  const fetcher = (url: string) => fetch(url).then(res => res.json())
  const { data, error } = useSWR(
    'https://ethgasstation.info/api/ethgasAPI.json?api-key=e78ab7cd416e7f8c10c819a6f6c01f8d500dfa968cb2f6812ecd1921b03a',
    fetcher
  )

  return {
    data,
    error
  }
}

export default function useLaunchIndexFund() {
  const [contract, setContract] = useState<string | undefined>()
  const [isActiveTrade, setActiveTrade] = useState<boolean>(false)
  const [isActiveIssuance, setActiveIssuance] = useState<boolean>(false)
  const [isActiveFee, setActiveFee] = useState<boolean>(false)
  const launchState = useLaunchState()
  const { library, active, account } = useWeb3React()
  const {
    REACT_APP_SET_ADDRESS,
    REACT_APP_BASIC_ISSUANCE_MODULE,
    REACT_APP_TRADE_MODULE,
    REACT_APP_STREAMING_FEE_MODULE
  } = process.env

  const handleInitialDeploy = async () => {
    const setProtocol = new Contract(REACT_APP_SET_ADDRESS as string, SET_ABI, library.getSigner())
    const tokens = launchState.tokens.map(t => t.value.address)
    const unitsRaw = await getInitialSetUnits()
    const setUnits = unitsRaw.map(unit => unit.toHexString())

    if (active) {
      console.log('Set Protocol Create Parameters:', JSON.stringify({
        tokens,
        setUnits,
        modules: [REACT_APP_BASIC_ISSUANCE_MODULE, REACT_APP_TRADE_MODULE, REACT_APP_STREAMING_FEE_MODULE],
        account,
        name: launchState.name,
        symbol: launchState.symbol
      }, null, 2));

      const response = await setProtocol.create(
        tokens,
        setUnits,
        [REACT_APP_BASIC_ISSUANCE_MODULE, REACT_APP_TRADE_MODULE, REACT_APP_STREAMING_FEE_MODULE],
        account,
        launchState.name,
        launchState.symbol
      )
      await response.wait()
      const receipt = await library.getTransactionReceipt(response.hash)

      const createdLogs = await setProtocol.queryFilter(setProtocol.filters.SetTokenCreated(), receipt.blockHash)
      const createdEvent = createdLogs.filter(l => l?.args?._manager === account)[0]
      const address: string = createdEvent?.args?._setToken

      setContract(address.replace('0x', ''))
      return { receipt, address }
    }
    return {}
  }

  const handleBasicIssuanceModule = async () => {
    const issuanceContract = new Contract(REACT_APP_BASIC_ISSUANCE_MODULE as string, ISSUANCE_ABI, library.getSigner())

    const res = await issuanceContract.initialize(contract, Utils.zeroAddress)
    await res.wait(1)
    setActiveIssuance(true)

    return library.getTransactionReceipt(res.hash)
  }

  const handleTradeModule = async () => {
    const tradeContract = new Contract(REACT_APP_TRADE_MODULE as string, TRADING_ABI, library.getSigner())
    const res = await tradeContract.initialize(contract) as TransactionResponse
    await res.wait(1)
    setActiveTrade(true)

    return library.getTransactionReceipt(res.hash)
  }

  const handleFeeModule = async () => {
    const feeContract = new Contract(REACT_APP_STREAMING_FEE_MODULE as string, STREAMING_ABI, library.getSigner())

    const res = await feeContract.initialize(contract, {
      feeRecipient: account,
      maxStreamingFeePercentage: BigNumber.from(1).mul(10).pow(16),
      streamingFeePercentage: BigNumber.from(1).mul(10).pow(16),
      lastStreamingFeeTimestamp: BigNumber.from(0)
    } as FeeState) as TransactionResponse
    await res.wait(1)
    setActiveFee(true)

    return library.getTransactionReceipt(res.hash)
  }

  const getInitialSetUnits = async (): Promise<BigNumber[]> => {
    const newUnits: BigNumber[] = [];
    const tokens = launchState.tokens
    const decimals = tokens.map(token => token.value?.decimals)
    const prices = await getTokenPrices(tokens.map(t => t.value?.symbol).join(','), tokens)
    const setPrices = tokens.map(t => unitsBN(Number(launchState?.price), t.value?.decimals))

    const tokenPrices = prices.map((p: number, idx: number) => unitsBN(p, decimals[idx]))
    const tokenAllocations = decimals.map(decimal => unitsBN(Number(launchState?.allocation) / 100, decimal))

    for (let i = 0; i < tokenAllocations.length; i++) {
      newUnits.push(setPrices[i].mul(tokenAllocations[i]).div(tokenPrices[i]));
    }

    return newUnits;
  }

  const gasFee = async () => {
    if (active) {
      const setProtocol = new Contract(REACT_APP_SET_ADDRESS as string, SET_ABI, library.getSigner())
      const tokens = launchState.tokens.map(t => t.value.address)
      const unitsRaw = await getInitialSetUnits()
      const setUnits = unitsRaw.map(unit => unit.toHexString())

      const response = await setProtocol.estimateGas.create(
        tokens,
        setUnits,
        [REACT_APP_BASIC_ISSUANCE_MODULE, REACT_APP_TRADE_MODULE, REACT_APP_STREAMING_FEE_MODULE],
        account,
        launchState.name,
        launchState.symbol
      )
      return response.toNumber()
    }
    return 0
  }

  const getTokenPrices = async (tickers: string, tokens: TokenValue[]) => {
    const response = await fetch(
      `https://api.covalenthq.com/v1/pricing/tickers/?tickers=${tickers}&key=ckey_60ca15e8ef88446587ddc869b97"`
    )
    const data = await response.json()
    const tickersArr = tickers.split(',')
    const prices: number[] = new Array(tickersArr.length).fill(1)

    tokens.forEach((token, idx) => {
      const ticker = token?.value?.address
      data.data.items.forEach((d: any) => {
          if (ticker === d.contract_address) {
            prices[idx] = d.quote_rate
          }
        }
      )
    })

    return prices
  }

  return {
    handleInitialDeploy,
    handleBasicIssuanceModule,
    handleTradeModule,
    handleFeeModule,
    gasFee,
    contract,
    setContract,
    isActiveTrade,
    isActiveIssuance,
    isActiveFee
  }
}
