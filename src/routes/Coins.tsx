import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { useSetRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { fetchCoins } from "../api";
import { isDarkAtom } from "../atoms";

const Container = styled.div`
  padding: 30px 0px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 25px;
`;

const CoinsList = styled.ul``;

const Coin = styled.li`
  background-color: ${(props) => props.theme.cardBgColor};
  color: ${(props) => props.theme.textColor};
  border-radius: 15px;
  margin-bottom: 10px;
  a {
    display: flex;
    align-items: center;
    padding: 20px;
    transition: color 0.2s ease-in;
  }
  &:hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
  margin-bottom: 25px;
  font-weight: 600;
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.cardBgColor};
  color: ${(props) => props.theme.textColor};
  border-radius: 10px;
  &:hover {
    background-color: #c5c5c5;
  }
  outline: 0;
  border: 0;
  padding: 5px 10px 5px 10px;
`;

const Img = styled.img`
  width: 35px;
  height: 35px;
  margin-right: 20px;
`;

interface CoinInterface {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

function Coins() {
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const toggleDarkAtom = () => setDarkAtom((current) => !current);
  const { isLoading, data } = useQuery<CoinInterface[]>("allCoins", fetchCoins);
  const isDark = useRecoilValue(isDarkAtom);

  return (
    <Container>
      <Helmet>
        <title>Coin</title>
      </Helmet>
      <Header>
        <Title>Coin</Title>
        <Button onClick={toggleDarkAtom}>
          {" "}
          {isDark === true ? `Light Mode` : `Dark Mode`}
        </Button>
      </Header>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <CoinsList>
          {data?.slice(0, 100).map((coin) => (
            <Coin key={coin.id}>
              <Link
                to={{
                  pathname: `/${coin.id}`,
                  state: { name: coin.name },
                }}
              >
                <Img
                  src={`https://cryptoicon-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`}
                />
                {coin.name} &rarr;
              </Link>
            </Coin>
          ))}
        </CoinsList>
      )}
    </Container>
  );
}

export default Coins;
