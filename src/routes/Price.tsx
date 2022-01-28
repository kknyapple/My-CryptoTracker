import { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Overview = styled.main`
  width: 100%;
  height: 50px;
  background-color: ${(props) => props.theme.cardBgColor};
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 15px;
  margin: 8px 0;
  padding: 25px;
`;

const Tag = styled.span`
  color: ${(props) => props.theme.textColor};
  font-size: 14px;
  font-weight: 600;
`;

const Text = styled.span<{ isPlus?: Boolean }>`
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => (props.isPlus ? "#ff3d3d" : "#0081fa")};
`;

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

interface PriceProps {
  coinId: string;
  tickersData?: PriceData;
}

function checkValue(value: number | undefined) {
  if (value) {
    return value > 0;
  }
}

function Price({ coinId, tickersData }: PriceProps) {
  const [data, setData] = useState<PriceData>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setData(tickersData);
    setLoading(false);
  }, [coinId, tickersData]);

  return (
    <Container>
      {loading ? (
        "Loading Price..."
      ) : (
        <>
          <Overview>
            <Tag> Change 15 Minutes:</Tag>
            <Text
              isPlus={checkValue(data?.quotes.USD.percent_change_15m) === true}
            >
              {data?.quotes.USD.percent_change_15m}%
            </Text>
          </Overview>

          <Overview>
            <Tag> Change 30 Minutes:</Tag>
            <Text
              isPlus={checkValue(data?.quotes.USD.percent_change_30m) === true}
            >
              {data?.quotes.USD.percent_change_30m}%
            </Text>
          </Overview>

          <Overview>
            <Tag> Change 1 hour:</Tag>
            <Text
              isPlus={checkValue(data?.quotes.USD.percent_change_1h) === true}
            >
              {data?.quotes.USD.percent_change_1h}%
            </Text>
          </Overview>

          <Overview>
            <Tag> Change 6 hours:</Tag>
            <Text
              isPlus={checkValue(data?.quotes.USD.percent_change_6h) === true}
            >
              {data?.quotes.USD.percent_change_6h}%
            </Text>
          </Overview>

          <Overview>
            <Tag> Change 12 hours:</Tag>
            <Text
              isPlus={checkValue(data?.quotes.USD.percent_change_12h) === true}
            >
              {data?.quotes.USD.percent_change_12h}%
            </Text>
          </Overview>

          <Overview>
            <Tag> Change 24 hours:</Tag>
            <Text
              isPlus={checkValue(data?.quotes.USD.percent_change_24h) === true}
            >
              {data?.quotes.USD.percent_change_24h}%
            </Text>
          </Overview>
        </>
      )}
    </Container>
  );
}

export default Price;
