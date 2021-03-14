import { useState } from "react";
import { ChevronLeft } from "react-feather";
import { Redirect, useHistory } from "react-router-dom";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";

import AllocationBar from "../components/AllocationBar";
import { ROUTES } from "../constants/routes";
import useLaunchIndexFund, { useGasPrice, useLaunchState } from "../state/launch/hooks";
import {
  FooterWrapper,
  FormWrapper,
  PrimaryButton,
  Spinner,
  Title,
  Header,
  BackButton
} from "../theme";


const SummaryBox = styled.div<{disabled?: boolean}>`
  border: 1px solid #CDCDEA;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 3rem;
  opacity: ${props => props.disabled ? '0.6' : '1'};
  cursor: ${ props => props.disabled ? 'not-allowed' : 'pointer'};
`
const SummaryItem = styled.div`
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: .5rem;
`
const FooterButton = styled(PrimaryButton)`
  align-self: flex-end;
`
const FlexItem = styled.div`
  align-self: flex-end;
`
const Label = styled.div`
  font-size: 1rem;
  font-weight: 600;
`
const Info = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 1rem;
`
const GasInfo = styled(Info)`
  font-size: 1rem;
  margin-top: 0;
  margin-bottom: 0;
`
const GasPrice = styled.div`
  align-self: flex-start;
`

export default function LaunchIndexFundPage() {
  const { active } = useWeb3React()
  const { data } = useGasPrice()
  const launchState = useLaunchState()
  const [creationFee, setCreationFee] = useState<string>()
  const history = useHistory()
  const {
    handleInitialDeploy,
    handleTradeModule,
    handleBasicIssuanceModule,
    handleFeeModule,
    gasFee,
    contract,
    isActiveTrade,
    isActiveIssuance,
    isActiveFee
  } = useLaunchIndexFund()
  const getFee = async () => {
    setCreationFee(((data?.fast * await gasFee()) / 10).toLocaleString())
  }
  const [isLoading, setLoading] = useState(false)
  const [isLoadingDex, setLoadingDex] = useState(false)
  const [isLoadingFee, setLoadingFee] = useState(false)
  const [isLoadingIssuance, setLoadingIssuance] = useState(false)
  const [textState, setTextState] = useState({
    launch: 'Launch Index Fund',
    trading: 'Turn On',
    fee: 'Turn On',
    issuance: 'Turn On'
  })

  getFee()
  const launch = async () => {
    setLoading(true)
    const {receipt, address} = await handleInitialDeploy()
    setLoading(false)
    textState.launch = 'Launched'
    setTextState({...textState})
    history.push(`/index-fund/${address}`)
    console.log(receipt)
  }

  const initDex = async () => {
    setLoadingDex(true)
    const receipt = await handleTradeModule()
    setLoadingDex(false)
    textState.trading = 'On'
    setTextState({ ...textState })
    console.log(receipt)
  }
  const initFee = async () => {
    setLoadingFee(true)
    const receipt = await handleFeeModule()
    setLoadingFee(false)
    textState.fee = 'On'
    setTextState({...textState})
    console.log(receipt)
  }
  const initIssuance = async () => {
    setLoadingIssuance(true)
    const receipt = await handleBasicIssuanceModule()
    setLoadingIssuance(false)
    textState.issuance = 'On'
    setTextState({...textState})
    console.log(receipt)
  }

  return (
    <FormWrapper>
      {!active && <Redirect to={ROUTES.HOME} />}
      {contract ?
      <Header>
        <FlexItem>
            <Title>Index Fund | {launchState.name}:{launchState.symbol}:${launchState.price}</Title>
            <Info>{contract}</Info>
        </FlexItem>
      </Header>
      :
      <Header>
        <BackButton to={ROUTES.DEFINE}><ChevronLeft /> Create</BackButton>
        <FlexItem>
          <Title>Launch Your Fund</Title>
        </FlexItem>
      </Header>
      }
      <SummaryBox>
        <SummaryItem>Name: {launchState.name}</SummaryItem>
        <SummaryItem>Ticker Symbol: {launchState.symbol}</SummaryItem>
        <SummaryItem>Default Price: ${launchState.price}</SummaryItem>
        <AllocationBar></AllocationBar>
        <FooterWrapper>
          <GasPrice >
            <Label>Estimated Fee</Label>
            <GasInfo>{creationFee} GWEI</GasInfo>
          </GasPrice>
          <FooterButton onClick={launch} disabled={isLoading || contract !== undefined}>
            {isLoading ? <Spinner /> : textState.launch}
          </FooterButton>
        </FooterWrapper>
      </SummaryBox>
      <SummaryBox disabled={contract === undefined}>
        <Label>Platform Trading</Label>
        <Info>This will turn on the trading module for your index fund.  When trading you will be able to specify which trading platform (0x, Uniswap, etc..) you wish to use.</Info>
        <FooterWrapper>
          <div></div>
          <PrimaryButton onClick={initDex} disabled={isLoadingDex || isActiveTrade}>
            {isLoadingDex ? <Spinner /> : textState.trading}
          </PrimaryButton>
        </FooterWrapper>
      </SummaryBox>
      <SummaryBox disabled={contract === undefined}>
        <Label>Management Fee</Label>
        <Info>This will turn on your 1% management fee for your index fund.</Info>
        <FooterWrapper>
          <div></div>
          <PrimaryButton onClick={initFee} disabled={isLoadingFee || isActiveFee}>
            {isLoadingFee ? <Spinner /> : textState.fee}
          </PrimaryButton>
        </FooterWrapper>
      </SummaryBox>
      <SummaryBox disabled={contract === undefined}>
        <Label>Basic Issuance</Label>
        <Info>This will turn on issuance and redemption token functionality, as well as allow the manager the ability to mint and burn tokens.</Info>
        <FooterWrapper>
          <div></div>
          <PrimaryButton onClick={initIssuance} disabled={isLoadingIssuance || isActiveIssuance}>
            {isLoadingIssuance ? <Spinner /> : textState.issuance}
          </PrimaryButton>
        </FooterWrapper>
      </SummaryBox>
    </FormWrapper>
  )
}
