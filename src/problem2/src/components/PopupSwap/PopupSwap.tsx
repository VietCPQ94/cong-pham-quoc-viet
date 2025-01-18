import { useEffect, useState } from 'react';
import './popupSwap.scss';
import sControl from '../../stores/storeControl';
import { getCoin } from '../../services/coin.service';
import { roundToDecimal } from '../../utils/numberConverter';
import { useSearchParams } from 'react-router-dom';
import { TCoinSimple } from '../../types/listCoin.type';

export default function PopupSwap() {
    const [isProcessing, setIsProcessing] = useState(true);
    const [coinFrom, setCoinFrom] = useState<TCoinSimple>();
    const [coinTo, setCoinTo] = useState<TCoinSimple>();
    const pickCoinProcess = sControl.use(n => n.pickCoinProcess);
    const [param, setParam] = useSearchParams();
    const [err, setErr] = useState({
        from: "",
        to: ""
    });

    useEffect(() => {
        setIsProcessing(true);
        const from = param.get("from");
        const to = param.get("to");

        if (!from || !to) {
            param.set("from", "7186")
            param.set("to", "1839")
            setParam(param);
            return;
        }

        getCoin(from, to).then(data => {
            setCoinFrom({
                id: data[0].id,
                name: data[0].name,
                symbol: data[0].symbol,
                price: data[0].quotes[0].price,
                value: 0
            })

            const toIndex = from === to ? 0 : 1;

            setCoinTo({
                id: data[toIndex].id,
                name: data[toIndex].name,
                symbol: data[toIndex].symbol,
                price: data[toIndex].quotes[0].price,
                value: 0
            })
            setIsProcessing(false);
        })
    }, [param, setParam])

    const changeCoin = (type: "from" | "to") => () => {
        sControl.set(n => {
            n.value.pickCoinProcess = {
                isShow: true,
                type
            }
        })
    }

    if (isProcessing || !coinFrom || !coinTo) {
        return <div className="popupSwap">
            <h1>Loading....</h1>
        </div>
    }

    const handleValueChange = (type: "from" | "to", value: string) => {
        if (Number(value) < 0) {
            setErr(p => ({
                ...p,
                [type]: "Amount token must greater than 0"
            }));
            return;
        }

        setErr(p => ({
            ...p,
            [type]: ""
        }));
        const from = { ...coinFrom };
        const to = { ...coinTo };

        if (type === "from") {
            from.value = Number(value);
            to.value = roundToDecimal(from.price * Number(value) / to.price, 10);
        }
        else {
            to.value = Number(value);
            from.value = roundToDecimal(to.price * Number(value) / from.price, 10);
        }

        setCoinFrom(from)
        setCoinTo(to)
    }

    const fakeSubmit = () => {
        // This step need to confirm with wallet's contract which I can't fake it :)
        // I think we still need an alert in this step to make sure that this process was done.
        alert(`Swap successfull! You have ${coinTo.value} ${coinTo.symbol}`)

        const from = { ...coinFrom };
        const to = { ...coinTo };

        from.value = 0;
        to.value = 0;

        setCoinFrom(from)
        setCoinTo(to)
    }

    return (
        <div className="popupSwap" style={{ visibility: pickCoinProcess.isShow && !isProcessing ? "hidden" : "visible" }} >
            <form>
                <h1>Swap</h1>
                <div className="group">
                    <label>From</label>
                    <div>
                        <div onClick={changeCoin("from")}>
                            <img src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${coinFrom.id}.png`} />
                            <span>{coinFrom.name}</span>
                        </div>
                        <input type='number' placeholder="0,00" value={coinFrom.value === 0 ? "" : coinFrom.value} onChange={e => handleValueChange("from", e.target.value)} />
                        <span>~ {roundToDecimal(coinFrom.price, 2)} USD</span>
                    </div>
                    <span className='err'>{err.from}</span>
                </div>
                <div className='line'></div>
                <div className="group">
                    <label>To</label>
                    <div>
                        <div onClick={changeCoin("to")}>
                            <img src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${coinTo.id}.png`} />
                            <span>{coinTo.name}</span>
                        </div>
                        <input type='number' placeholder="0,00" value={coinTo.value === 0 ? "" : coinTo.value} onChange={e => handleValueChange("to", e.target.value)} />
                        <span>~ {roundToDecimal(coinTo.price, 2)} USD</span>
                    </div>
                    <span className='err'>{err.to}</span>
                </div>
                <button type='button' onClick={fakeSubmit} disabled={coinTo.value === 0}>Submit</button>
            </form>
        </ div >
    )
}
