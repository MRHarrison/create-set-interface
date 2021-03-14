import { useEagerConnect } from '../../hooks/useWeb3'


export default function Web3ReactManager({ children }: { children: JSX.Element }) {
  useEagerConnect()
  return children
}
