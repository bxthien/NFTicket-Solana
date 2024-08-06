/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable multiline-comment-style */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { useWallet } from '@solana/wallet-adapter-react';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { Image } from 'antd';
import { Link } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import avatar from '../../../assets/images/avatar.png';

interface NFT {
  background_color: string;
  description: string;
  edition: string;
  external_url: string;
  image: string;
  name: string;
  seller_fee_basis_points: number;
  symbol: string;
}

const tokensInWallet: any = [];

export default function Nfts() {
  const { publicKey } = useWallet();
  const [nfts, setNfts] = useState<NFT[]>([]);

  const address = useMemo(() => publicKey?.toBase58(), [publicKey]);

  const getMyBalance = useCallback(
    async (address: string) => {
      if (!publicKey) return;
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      const accounts = await connection.getParsedProgramAccounts(
        new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), // new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
        {
          filters: [
            {
              dataSize: 165, // number of bytes
            },
            {
              memcmp: {
                // number of bytes
                bytes: address,
                offset: 32, // base58 encoded string
              },
            },
          ],
        }
      );
      accounts.forEach((account) => {
        // account.account.data;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const amountI = account.account.data.parsed.info.tokenAmount.uiAmount;
        // @ts-ignore
        const mint_s = account.account.data.parsed.info.mint;

        if (amountI == 1) {
          const objT: any = {};
          objT.mint = mint_s;
          objT.amount = amountI;
          tokensInWallet.push(objT);
        }
      });

      await tokensInWallet?.forEach(async (element: any) => {
        const mintPubkey = new PublicKey(element.mint);
        // @ts-ignore
        const tokenmetaPubkey = await Metadata.getPDA(mintPubkey);
        // @ts-ignore
        const tokenmeta: any = await Metadata.load(connection, tokenmetaPubkey);

        if (tokenmeta.data.data.uri)
          fetch(tokenmeta.data.data.uri)
            .then((response) => response.json())
            .then((responseJson) => {
              setNfts((prev) => [...prev, responseJson]);
            });

        return tokenmeta.data.data.uri;
      });

      return;
    },
    [publicKey]
  );

  useEffect(() => {
    if (address) getMyBalance(address);
  }, [getMyBalance, address]);

  return (
    <div className='mt-40'>
      <div className='text-2xl text-white'>Your NFT Certificates Dashboard</div>
      <div className='mt-2 text-sm text-white'>View the Certificates you have created recently</div>

      <Swiper className='mt-10 w-full' pagination={false} slidesPerView={'auto'}>
        <div>
          {nfts.map((item, index) => (
            <SwiperSlide className='transition-in-out-common mr-[120px] w-[236px] max-w-[236px] cursor-pointer' key={index}>
              <Link to={`/certificate/?symbol=${item.symbol}`}>
                <Image
                  className='bg-black object-fill'
                  height={330}
                  preview={false}
                  src={item.image}
                  width={330}
                  style={{ objectFit: 'cover' }}
                />
                <div className='mt-2 text-base text-white'>{item.name}</div>
                <div className='mt-2 flex items-center gap-3 text-white '>
                  <Image preview={false} src={avatar} />
                  <div className='text-sm text-white'>{item.description}</div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
      {/* </div> */}
    </div>
  );
}
