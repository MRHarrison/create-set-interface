import { useWeb3React } from "@web3-react/core";
import { Redirect } from "react-router";
import styled from "styled-components";
import WalletButton from "../components/WalletButton";
import { ROUTES } from "../constants/routes";


const HomeWrapper = styled.div`
  width: 50rem;
`
const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50rem;
  margin-top: 20vh;
`
const MainTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: .5rem;
`
const Info = styled.p``

export default function HomePage() {
  const { active } = useWeb3React()

  return (
    <HomeWrapper>
      <MainWrapper>
        <MainTitle>Crypto Index Fund Creator</MainTitle>
        <Info>Please connect Metamask to the Kovan Test Network</Info>
        {active ? <Redirect to={ROUTES.DEFINE} /> : <WalletButton />}
      </MainWrapper>
    </HomeWrapper>
  )
}
