/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable multiline-comment-style */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { useWallet } from '@solana/wallet-adapter-react';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Col, Image, Row } from 'antd';
import { GlobeIcon, LogoEnouvo } from '../../assets/svgs';

interface NFT {
  image?: string;
  name: string;
  symbol?: string;
  description?: string;
}

const tokensInWallet: any = [];

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Certificate() {
  const { publicKey } = useWallet();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const address = useMemo(() => publicKey?.toBase58(), [publicKey]);
  const query = useQuery();

  const getMyBalance = useCallback(
    async (address: string) => {
      if (!publicKey) return;
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      const accounts = await connection.getParsedProgramAccounts(new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), {
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
      });
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
      const currentImages: NFT[] = [];

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
              if (responseJson.image)
                currentImages.push({
                  description: responseJson.description,
                  image: responseJson.image,
                  name: responseJson.name,
                  symbol: responseJson.symbol,
                });

              setNfts(currentImages);
            });

        return tokenmeta.data.data.uri;
        // await UpdateTheUI();
      });

      return;
    },
    [publicKey]
  );

  useEffect(() => {
    if (address) getMyBalance(address);
  }, [getMyBalance, address]);

  const certificate = nfts.find((item) => item.symbol === query.get('symbol'));

  return (
    <div className='p-24 text-lg text-white'>
      <h1 className='text-5xl font-medium text-white'>{certificate?.name} Certificate</h1>
      <Row>
        <Col span={12}>
          <p className='text-lg font-light text-[#858584]'>Minted on Dec 10, 2022</p>
          <p className='text-xl font-medium text-[#858584]'>Created By</p>
          <div className='flex flex-row space-x-2'>
            <LogoEnouvo />
            <p className='text-xl font-semibold'>Enouvo Group</p>
          </div>
          <p className='text-xl font-medium text-[#858584]'>Description</p>
          <p>The Orbitians</p>
          <p>This is Enouvo Coffee's certificate. We provide high quality coffee, food and open co-working space</p>
          <p>{certificate?.description}</p>
        </Col>
        <Col span={12}>
          <Image
            height={300}
            preview={false}
            src={certificate?.image ?? 'https://nft-web.s3-ap-northeast-1.amazonaws.com/hLcLXra3vCRf2pdnRKUe3A.jpg'}
            width={300}
          />
        </Col>
      </Row>
      <p className='text-xl font-medium text-[#858584]'>Details</p>
      <div className='flex flex-row space-x-2'>
        <GlobeIcon />
        <p>View on Solscan</p>
      </div>
      <div className='flex flex-row space-x-2'>
        <GlobeIcon />
        <p>Explore Solana</p>
      </div>
      <p className='text-xl font-medium text-[#858584]'>Tag</p>
      <div className='flex flex-row space-x-3'>
        <div className='rounded-full bg-gray-700 py-3 px-6 uppercase'>NFT</div>
        <div className='rounded-full bg-gray-700 py-3 px-6 uppercase'>Certificate</div>
      </div>
    </div>
  );
}
