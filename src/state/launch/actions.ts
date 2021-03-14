import { createAction } from "@reduxjs/toolkit";
import { Token, TokenValue } from "./reducer";

export const setAllocation = createAction<number | undefined >('launch/setAllocation')
export const setFormData = createAction<{ name: string, symbol: string, tokens: TokenValue[], price: number }>('launch/setFormData')
export const removeToken = createAction<string | undefined>('launch/removeToken')
export const addToken = createAction<Token>('launch/addToken')
export const replaceToken = createAction<{token: Token, idx: number}>('launch/replaceToken')
