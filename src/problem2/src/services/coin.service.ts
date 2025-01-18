import TListCoin, { CryptoCurrency } from "../types/listCoin.type";

const proxyUrl = (url: string) => `https://cors.nglearns.dev/?url=${url}`;

export const getListCoin = (() => {
  let coin: TListCoin;
  return async () => {
    if (!coin) {
      coin = await fetch(
        proxyUrl(
          "https://api.coinmarketcap.com/data-api/v3/cryptocurrency/listing?start=1&limit=100&sortBy=rank&sortType=desc&convert=USD&cryptoType=all&tagType=all&audited=false&aux=ath"
        )
      ).then((res) => res.json());
    }

    return coin;
  };
})();

export const getCoin = async (...ids: string[]) => {
  const res = await fetch(
    proxyUrl(
      `https://api.coinmarketcap.com/data-api/v3/cryptocurrency/quote/latest?id=${ids.join(
        ","
      )}`
    )
  ).then((res) => res.json());

  const data: CryptoCurrency[] = res.data;

  return data;
};
