import { injected } from "../connectors/NetworkConnector"
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from '@ethersproject/providers';
import { ControlRow, PrimaryButton } from "../theme";
import styled from "styled-components";

const ButtonWrapper = styled.div`
  margin-bottom: 2rem;
  height: 3rem;
`
const BigButton = styled(PrimaryButton)`
  text-transform: uppercase;
  font-size: 1rem;
  padding: .8rem 1rem;
`

export default function WalletButton() {
  const { account, activate, active } = useWeb3React<Web3Provider>()
  const onClick = () => {
    activate(injected)
  }

  return (
    <ButtonWrapper>
      { active ? <ControlRow>Welcome {account}</ControlRow> :
        <BigButton onClick={onClick}>
          Connect with MetaMask
        </BigButton>
      }
    </ButtonWrapper>
  )
}
