
import styled from 'styled-components';
import './App.css';
import Routes from './Routes';

const MainWrapper = styled.div`
  display: flex;
  justify-content: center;
`

function App() {
  return (
    <MainWrapper>
      <Routes />
    </MainWrapper>
  );
}

export default App;
