import styled from "styled-components"
import { useLaunchState } from "../state/launch/hooks"
import { LogoImg } from "../theme"


const AllocationWrapper = styled.div`
  margin: 1.5rem 0 .5rem;
  height: 2.5rem;
  display: flex;
  width: 100%;
`
const AllocationItemWrapper = styled.div<{ width: string }>`
  width: ${props => props.width};
`
const LogosWrapper = styled.div`
  width: 25px;
  height: 25px;
  margin-bottom: .3rem;
`
const AllocationItem = styled.div<{backgroundColor: string }>`
  background-color: ${props => props.backgroundColor};
  height: 1rem;
  width: 100%;
`
const AllocationText = styled.div`
  float: left;
  margin-left: .2rem;
  font-size: .5rem;
  opacity: .8;
  color: white;
  line-height: 1.9;
  font-weight: 700;
`

export default function AllocationBar() {
  const launchState = useLaunchState()
  const colors = ['#006AE3', '#00D395', '#01D1FF', '#FDDA02', '#8C8C8C']
  const itemWidth = launchState?.allocation?.toFixed(1) + '%'

  return (
    <>
      <AllocationWrapper>
        {launchState.tokens.map((token, i) => {
          return (
            <AllocationItemWrapper width={itemWidth} key={colors[i]}>

              <LogosWrapper>
                <LogoImg key={token?.value?.logo_url} src={token?.value?.logo_url} width="25" height="25" />
              </LogosWrapper>
              <AllocationItem backgroundColor={colors[i]}><AllocationText>{itemWidth}</AllocationText></AllocationItem>
            </AllocationItemWrapper>
          )
        })}
      </AllocationWrapper>
    </>
  )
}
