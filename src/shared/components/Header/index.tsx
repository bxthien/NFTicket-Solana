import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Image } from 'antd';
import { Link } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import logo from '../../../assets/images/logo.png';

export default function Header() {
  const [balance, setBalance] = useState(0);
  const { publicKey, wallet } = useWallet();
  const { connection } = useConnection();

  const address = useMemo(() => publicKey?.toBase58(), [publicKey]);

  const getMyBalance = useCallback(async () => {
    if (!publicKey) return setBalance(0);
    // Read on-chain balance
    const lamports = await connection.getBalance(publicKey);
    return setBalance(lamports);
  }, [connection, publicKey]);

  useEffect(() => {
    getMyBalance();
  }, [getMyBalance]);

  return (
    <div className='flex h-24 w-full items-center justify-center border-b-2 border-[#858584] bg-[#2B2B2B]'>
      <div className='container mx-auto flex h-full w-full  items-center justify-between'>
        <Link className='flex items-center gap-3' to='/'>
          <Image preview={false} src={logo} style={{ width: 50 }} />
          <div className='text-bold text-2xl font-bold text-white'>Enouverse</div>
        </Link>
        <div className='flex items-center gap-14'>
          <div className='flex gap-14'>
            <div className='cursor-pointer text-base text-white'>Certificate NFT</div>
            <div className='cursor-pointer text-base text-white'>About Us</div>
            <Link className='cursor-pointer text-base text-white' to={`/nfts-management`}>
              NFTs management
            </Link>
          </div>

          <div className='flex h-[60px] w-52 cursor-pointer items-center justify-center rounded-3xl bg-[#A259FF]'>
            {/* <Image preview={false} src={user} /> */}
            <WalletMultiButton>
              {wallet ? (
                <div className='my-4'>
                  <div className='mt-[4px]'>{`${address?.slice(0, 4)}..${address?.slice(-4)}`}</div>
                  <div className='mt-[-20px] w-36'>{balance / 10 ** 9} SOL</div>
                </div>
              ) : (
                <div> Connect a wallet</div>
              )}
            </WalletMultiButton>
          </div>
        </div>
      </div>
    </div>
  );
}
