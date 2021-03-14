import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'
import { RefreshCcw } from 'react-feather'

export const FooterWrapper = styled.div`
  display: flex;
  margin-top: 2rem;
  padding-top: 1rem;
  justify-content: space-between;
  align-items: end;
  width: 100%;
  border-top: 1px solid #CDCDEA;
`
export const FormFooterWrapper = styled(FooterWrapper)`
  border-top: none;
`
export const FormWrapper = styled.div`
  width: 38rem;
  padding: 2rem;
  margin-top: 1rem;
`
export const Header = styled.div`
  display: flex;
  flex-direction: column;
  height: 7rem;
`
export const Title = styled.h2`
  text-align: right;
  margin-bottom: .1rem;
`
export const FormRow = styled.div`
  display: flex;
  justify-content: center;
`
export const ControlRow = styled.div`
  display: block;
  margin-bottom: 1.2rem;
`
export const Label = styled.label`
  font-weight: 600;
  width: 100%;
  padding: 0 .2rem;
`
export const BackButton = styled(Link)`
  align-self: flex-start;
  margin-bottom: -3.5rem;
  padding: .3rem .7rem;
  color: #666;
  text-decoration: none;
  border: 1px solid #CDCDEA;
  border-radius: 10px;
  font-size: .8rem;
`
export const Input = styled.input`
  width: 100%;
  margin-top: .2rem;
  height: 2.5rem;
  font-size: .9rem;
  line-height: 1.5rem;
  padding: .4rem .8rem .3rem;
  border-radius: 8px;
  border: 1px solid #CDCDEA;
`
export const Button = styled.button`
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #CDCDEA;
  font-size: 1rem;
  cursor: pointer;
`
export const PrimaryButton = styled(Button)`
  background-color: #000;
  color: #fff;
  min-height: 2.7rem;
  min-width: 15rem;
  font-weight: 600;
  font-size: 1rem;
  padding: .5rem;
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`
export const LinkButton = styled(Link)`
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #CDCDEA;
  font-size: 1rem;
  padding: 1rem 2rem;
  text-decoration: none;
  min-height: 3rem;
  margin-top: 2rem;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
`
export const IconButton = styled(Button)`
  width: 45px;
  height: 2.2rem;
  margin: 0.5rem;
  font-size: 1rem;
  border-radius: 3px;
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`
export const LogoImg = styled.img`
  width: 25px;
  height: 25px;
  margin-right: 10px;
`
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(-360deg);
  }
`
export const Spinner = styled(RefreshCcw)`
  animation: ${rotate} 1.5s linear infinite;
`
