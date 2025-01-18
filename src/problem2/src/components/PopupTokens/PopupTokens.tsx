import { useEffect, useState } from 'react';
import { getListCoin } from '../../services/coin.service';
import { CryptoCurrency } from '../../types/listCoin.type';
import './popupTokens.scss';
import sControl from '../../stores/storeControl';
import { useSearchParams } from 'react-router-dom';

export default function PopupTokens() {
    const isShow = sControl.use(n => n.pickCoinProcess.isShow)
    const [lsCoin, setLsCoin] = useState<CryptoCurrency[]>([]);
    const [param, setParam] = useSearchParams();
    const [filterName, setFilterName] = useState("");
    useEffect(() => {
        getListCoin().then(n => setLsCoin(n.data.cryptoCurrencyList))
    }, [])

    const backHandle = () => {
        sControl.set(n => n.value.pickCoinProcess.isShow = false)
    }

    const pickCoin = (id: number) => () => {

        sControl.set(n => {
            param.set(n.value.pickCoinProcess.type, id + "")
            setParam(param);

            n.value.pickCoinProcess.isShow = false;
        })
    }

    const handleChange = (name: string) => {
        setFilterName(name.toLocaleLowerCase());
    }

    return (
        <div className="popupTokens" style={{ visibility: isShow ? "visible" : "hidden" }}>
            <form>
                <div className='head'>
                    <p>Change Token</p><span onClick={backHandle}>✖</span>
                </div>
                <div className="group">
                    <input placeholder="Search by name of Token" onChange={(e) => handleChange(e.target.value)} />
                </div>
                <div className='listCoin'>
                    {
                        lsCoin.length === 0 ?
                            <div>Loading...</div>
                            :
                            lsCoin.filter(n => n.symbol.toLocaleLowerCase().includes(filterName))
                                .map((v) => {
                                    return <div onClick={pickCoin(v.id)} key={v.id}>
                                        <img src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${v.id}.png`} />
                                        <div>
                                            <p>{v.symbol}</p>
                                            <span>{v.name}</span>
                                        </div>
                                    </div>
                                })
                    }
                </div>
            </form>
        </div>
    )
}
