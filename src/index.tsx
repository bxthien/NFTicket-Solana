import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { Coin98WalletAdapter, PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { initializeApp } from 'firebase/app';
import SwiperCore, { Autoplay, Pagination } from 'swiper';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
import { BrowserRouter } from 'react-router-dom';
import 'antd/dist/antd.css';
import ReactDOM from 'react-dom/client';
import { Route, Routes } from 'react-router-dom';
import './configs/theme/index.css';
import './index.css';
import Home from './pages/index';
import reportWebVitals from './reportWebVitals';
import configs from './configs/index';
import '@solana/wallet-adapter-react-ui/styles.css';

import { getDatabase } from 'firebase/database';
import Layout from './shared/layouts/index';
import NftsManagement from './pages/nfts-management';
import Certificate from './pages/certificate/index';
import Dashboard from './pages/dashboard/index';

const {
  rpc: { endpoint },
} = configs;

const firebaseConfig = {
  apiKey: 'AIzaSyDVHVc_1jGWMaR63pwl9c_dNX6HwIXt_PU',
  appId: '1:249923585060:web:077ea527f7f27702e704b1',
  authDomain: 'food-safety-enouvo.firebaseapp.com',
  databaseURL: 'https://food-safety-enouvo-default-rtdb.firebaseio.com',
  measurementId: 'G-HKYF02WVHX',
  messagingSenderId: '249923585060',
  projectId: 'food-safety-enouvo',
  storageBucket: 'food-safety-enouvo.appspot.com',
};

const app = initializeApp(firebaseConfig);
SwiperCore.use([Autoplay, Pagination]);

getDatabase(app);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <ConnectionProvider endpoint={endpoint}>
    <WalletProvider autoConnect wallets={[new PhantomWalletAdapter(), new Coin98WalletAdapter()]}>
      <WalletModalProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route index element={<Home />} path='/' />
              <Route index element={<Certificate />} path='/certificate' />
              <Route index element={<Dashboard />} path='/dashboard' />
              <Route index element={<NftsManagement />} path='/nfts-management' />
            </Routes>
          </Layout>
        </BrowserRouter>
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
