import { useQuery } from "react-query";
import { Helmet } from "react-helmet";
import {
  Switch,
  Route,
  useLocation,
  useRouteMatch,
  useParams,
} from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import { isDarkAtom } from "../atoms";
import Chart from "./Chart";
import Price from "./Price";

const Title = styled.h1`
  font-size: 36px;
  color: ${(props) => props.theme.accentColor};
  margin-bottom: 15px;
  font-weight: 600;
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Container = styled.div`
  padding: 10px 20px;
  max-width: 480px;
  margin: 0 auto;
`;
const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
`;

const Overview = styled.main`
  width: 100%;
  height: 80px;
  background-color: ${(props) => props.theme.cardBgColor};
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 15px;
  margin: 30px 0;
  padding: 20px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
`;

const Description = styled.p`
  line-height: 20px;
  color: ${(props) => props.theme.textColor};
`;

const InfoTitle = styled.span`
  font-size: 12px;
`;

const InfoValue = styled.span`
  font-size: 20px;
  font-weight: 700;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: ${(props) => props.theme.cardBgColor};
  border-radius: 10px;
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    padding: 7px 0px;
    display: block;
  }
`;

const BackBtn = styled.div`
  display: flex;
  font-weight: 900;
  &:hover {
    color: ${(props) => props.theme.accentColor};
  }
`;

const ChangeModeBtn = styled.button`
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

interface RouteParams {
  coinId: string;
}

interface RouteState {
  name: string;
}

interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

interface PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

function Coin() {
  const { coinId } = useParams<RouteParams>();
  const { state } = useLocation<RouteState>();

  const priceMatch = useRouteMatch("/:coinId/price");
  const chartMatch = useRouteMatch("/:coinId/chart");
  const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(
    ["info", coinId],
    () => fetchCoinInfo(coinId)
  );
  const { isLoading: tickersLoading, data: tickersData } = useQuery<PriceData>(
    ["tickers", coinId],
    () => fetchCoinTickers(coinId)
  );
  const loading = infoLoading || tickersLoading;

  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const toggleDarkAtom = () => setDarkAtom((current) => !current);
  const isDark = useRecoilValue(isDarkAtom);

  return (
    <Container>
      <Helmet>
        <title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </title>
      </Helmet>
      <Header>
        <BackBtn>
          <Link to="/"> &larr; Go Back</Link>
        </BackBtn>
        <Title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </Title>
        <ChangeModeBtn onClick={toggleDarkAtom}>
          {isDark === true ? `Light Mode` : `Dark Mode`}
        </ChangeModeBtn>
      </Header>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Overview>
            <Info>
              <InfoTitle>Rank:</InfoTitle>
              <InfoValue>{infoData?.rank}</InfoValue>
            </Info>
            <Info>
              <InfoTitle>Symbol:</InfoTitle>
              <InfoValue>{infoData?.symbol}</InfoValue>
            </Info>
            <Info>
              <InfoTitle>Price:</InfoTitle>
              <InfoValue>
                $ {tickersData?.quotes.USD.price.toFixed(3)}
              </InfoValue>
            </Info>
          </Overview>
          <Description>{infoData?.description}</Description>
          <Overview>
            <Info>
              <InfoTitle>Total Supply:</InfoTitle>
              <InfoValue>{tickersData?.total_supply}</InfoValue>
            </Info>
            <Info>
              <InfoTitle>Main supply:</InfoTitle>
              <InfoValue>{tickersData?.max_supply}</InfoValue>
            </Info>
          </Overview>
          <Tabs>
            <Tab isActive={priceMatch !== null}>
              <Link to={`/${coinId}/price`}>Price</Link>
            </Tab>
            <Tab isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>Chart</Link>
            </Tab>
          </Tabs>
          <Switch>
            <Route path={`/:coinId/price`}>
              <Price coinId={coinId} tickersData={tickersData} />
            </Route>
            <Route path={`/:coinId/chart`}>
              <Chart coinId={coinId} />
            </Route>
          </Switch>
        </>
      )}
    </Container>
  );
}

export default Coin;
