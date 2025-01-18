import { useLayoutEffect } from 'react';
import './App.scss';
// import PopupSwap from './components/PopupSwap';
import PopupSwap from './components/PopupSwap';
import PopupTokens from './components/PopupTokens';
import { getListCoin } from './services/coin.service';

export default function App() {
  useLayoutEffect(() => {
    getListCoin()
  }, [])
  return (
    <div className="app">
      <div className="app_bg-1"></div>
      <div className="app_bg-2"></div>
      <div className='app_snow'>❄️</div>
      <div className='app_snow'>❄️</div>
      <div className='app_snow'>❄️</div>
      <div className='app_snow'>❄️</div>
      <div className='app_snow'>❄️</div>
      <div className='app_snow'>❄️</div>
      <div className='app_snow'>❄️</div>
      <div className='app_snow'>❄️</div>
      <div className='app_snow'>❄️</div>
      <div className='app_snow'>❄️</div>
      <PopupSwap />
      <PopupTokens />
    </div>
  )
}
