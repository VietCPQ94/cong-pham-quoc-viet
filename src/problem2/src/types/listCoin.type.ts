export default interface TListCoin {
  data: Data;
  status: Status;
}

interface Status {
  timestamp: string;
  error_code: string;
  error_message: string;
  elapsed: string;
  credit_count: number;
}

interface Data {
  cryptoCurrencyList: CryptoCurrency[];
  totalCount: string;
}

export interface CryptoCurrency {
  id: number;
  name: string;
  symbol: string;
  quotes: Quote[];
}

interface Quote {
  name: string;
  price: number;
}

export type TCoinSimple = {
  id: number;
  name: string;
  price: number;
  value: number;
  symbol: string;
};
