import { FormEvent } from "react"
import { useState } from "react"
import { ChevronDown, X } from "react-feather"
import { useDispatch } from "react-redux"
import styled from "styled-components"

import tokenList from '../../constants/token-list.json'
import { addToken, removeToken, replaceToken } from "../../state/launch/actions"
import { useLaunchState } from "../../state/launch/hooks"
import { Token } from "../../state/launch/reducer"
import { IconButton, LogoImg } from "../../theme"

const TokenManager = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
  height: 59px;
`

const TokenSelectWrapper = styled.div`
  width: 100%;
`
const TokenSelectButton = styled.div`
  border: 1px solid #CDCDEA;
  padding: 1rem;
  border-radius: 30px;
  cursor: pointer;
  width: 20rem;
  margin-left: .5rem;
`
const Bold = styled.span`
  font-weight: 600;
`
const IconRight = styled(ChevronDown)`
  float: right;
`
const TokenList = styled.div`
  position: absolute;
  z-index: 99;
  margin-top: -3.8rem;
  margin-left: .5rem;
  width: 20rem;
  height: 30rem;
  overflow-y: scroll;
  background: #fff;
  border-top: 1px solid #ccc;
  border-right: 1px solid #ccc;
  border-left: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  border-radius: 30px;
`
const TokenItem = styled.div`
  padding: 1rem;
  cursor: pointer;

  &:hover {
    background: #eee;
  }
`
export const Allocation = styled.div`
  width: 8rem;
  text-align: right;
  height: 2rem;
  margin: 0 .5rem;
  font-weight: 600;
  font-size: 1.2rem;
`

type Props = {
  add: Function,
  remove: Function,
  idx: number,
  address?: string,
  onChange: any,
  fields: any
}

export function TokenSelect({ add, remove, idx, address, onChange, fields }: Props) {
  const launchState = useLaunchState()
  const [selectedToken, setSelectedToken] = useState<Token | null | undefined>(launchState.tokens[idx]?.value || {name: 'Select Asset'})
  const [opened, setOpened] = useState(true)
  const dispatch = useDispatch()
  // @ts-ignore
  const usedTokens = new Set(launchState.tokens.flatMap(t => t.value?.address))

  const openList = () => {
    setOpened(false)
  }

  const tokenSelect = (event: FormEvent<HTMLDivElement>) => {
    const div = event.target as HTMLDivElement
    const selAddress = div.dataset.address
    const token = tokenList.tokens.filter(t => t.address === selAddress)[0] as Token
    setSelectedToken(token)
    setOpened(true)
    if (selectedToken?.name === 'Select Asset') {
      dispatch(addToken(token))
    } else {
      dispatch(replaceToken({token: token, idx: idx}))
    }
    onChange(token)
  }

  const removeSelect = (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault()
    dispatch(removeToken(selectedToken?.address))
    remove(idx)
  }

  return (
    <>
      <TokenManager>
        <IconButton onClick={removeSelect}><X size={16} color="#444"/></IconButton>
        <TokenSelectWrapper>
          <TokenSelectButton onClick={openList}>
            {selectedToken?.address ?
              <>
              <LogoImg src={selectedToken?.logo_url} loading="lazy" width="25" height="25" />
              <Bold>{selectedToken?.symbol}</Bold>
              </>
            : selectedToken?.name
            }
            <IconRight />
          </TokenSelectButton>
          {!opened && <TokenList onClick={tokenSelect}>
            {tokenList['tokens'].filter(token => !usedTokens.has(token.address)).map(token => {
              return (
                <TokenItem key={token.address} data-address={token.address}>
                  <LogoImg src={token.logo_url} loading="lazy" width="25" height="25" />
                  {token.name} - {token.symbol}
                </TokenItem>
              )
            })}
          </TokenList>}
        </TokenSelectWrapper>
        <Allocation>{launchState?.allocation?.toFixed(1)}%</Allocation>
      </TokenManager>
    </>
  )
}
