import { createReducer } from "@reduxjs/toolkit";
import { addToken, removeToken, replaceToken, setAllocation, setFormData } from "./actions";


export interface Token {
  name: string
  address?: string,
  symbol?: string;
  decimals?: number;
  logo_url?: string;
}
export interface TokenValue {
  value: Token
}
export interface LaunchState {
  name: string
  symbol: string
  price?: number
  tokens: TokenValue[]
  deployAddress?: string
  allocation?: number
}

const initialState: LaunchState = {
  name: '',
  symbol: '',
  tokens: [{ value: { name: 'Select Asset' } }],
  allocation: 100
}

export default createReducer<LaunchState>(initialState, (builder) => {
  builder
    .addCase(setAllocation, (state, { payload }) => {
      return {
        ...state,
        allocation: payload
      }
    })
    .addCase(setFormData, (state, { payload }) => {
      return {
        ...state,
        ...payload
      }
    })
    .addCase(removeToken, (state, { payload }) => {
      const tokens = state.tokens.filter(token => token?.value?.address !== payload)

      return {
        ...state,
        tokens: tokens,
        allocation: (100 / (tokens.length || 1))
      }
    })
    .addCase(replaceToken, (state, { payload : {token, idx}}) => {
      const tokens = state.tokens.map((tkn, i) => i === idx ? {value: token} : tkn)

      return {
        ...state,
        tokens: [...tokens]
      }
    })
    .addCase(addToken, (state, { payload }) => {
      const token = {value: payload}
      let tokens = []
      if (state.tokens.length === 1 && state.tokens[0]?.value.name === 'Select Asset') {
        tokens = [token]
      } else {
        tokens = [...state.tokens, token]
      }

      return {
        ...state,
        tokens: tokens
      }
    })
})
