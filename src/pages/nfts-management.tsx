/* eslint-disable multiline-comment-style */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/naming-convention */
import { FileTextOutlined } from '@ant-design/icons';
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import { Button, Image, Table, Tag, notification } from 'antd';
import { Program } from '@project-serum/anchor';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { child, get, getDatabase, ref, update } from 'firebase/database';
import type { IPFSHTTPClient } from 'ipfs-http-client';
import { create } from 'ipfs-http-client';
import { useEffect, useMemo, useState } from 'react';
import * as anchor from '@project-serum/anchor';
import idl_mint from '../mint_nft.json';

interface Nft {
  createTime: number;
  description: string;
  id: string;
  image: string;
  symbol: string;
  title: string;
  wallet: string;
  status?: string;
  docs: { docs1: string; doc2: string; docs3: string };
}

const projectId = '2IcFd9q8opGynfMEI2l9Zj6y4lh';
const projectSecret = '7eed3b6d8ab65155aefa60ea4e90051b';
const authorization = `Basic ${btoa(`${projectId}:${projectSecret}`)}`;

export const handleGetStatusColor = (status: string) => {
  switch (status) {
    case 'rejected':
      return '#FC424A';
    case 'approved':
      return '#00D25B';

    default:
      return '#FFAB00';
  }
};

export default function NFTsManagement() {
  const dbRef = ref(getDatabase());
  const [nfts, setNfts] = useState<Nft[]>([]);
  const { publicKey } = useWallet();
  const address = useMemo(() => publicKey?.toBase58(), [publicKey]);
  const wallet = useAnchorWallet();
  const [loading, setLoading] = useState(false);
  const [selectedNft, setSelectedNft] = useState('');
  const [count, setCount] = useState(0);

  function getProvider() {
    if (!wallet) {
      return null;
    }
    // const network = "http://127.0.0.1:8899";
    // const connection = new Connection(network, "processed");
    const connection = new Connection(clusterApiUrl('devnet'), 'processed');
    // const network = "http://127.0.0.1:8899";
    // const connection = new Connection(network, "processed");

    const provider = new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());

    return provider;
  }

  let ipfs: IPFSHTTPClient | undefined;
  try {
    ipfs = create({
      headers: {
        authorization,
      },
      url: 'https://ipfs.infura.io:5001/api/v0',
    });
  } catch (error) {
    console.error('IPFS error ', error);
    ipfs = undefined;
  }

  const handleUploadIpfs = async (nft: Nft) => {
    setSelectedNft(nft.id);
    setLoading(true);
    // upload files
    const data = {
      attributes: [
        {
          trait_type: 'Food Safety NFT Certificate',
          value: 'Custom',
        },
      ],
      colecction: {
        family: 'Certificate',
        name: 'NFT Certificate Food Satefy',
      },
      description: nft.description,
      external_url: '',
      image: nft.image,
      name: nft.title,

      properties: {
        category: 'certificate',
        creator: [
          {
            address: nft.wallet, //user address
            share: 50,
          },
          {
            address: 'cxTyJs97SPE3JkvERrnDurjysMrC1QBwwe6rXHxenmn', //admin address
            share: 50,
          },
        ],
        files: [
          {
            doc: Object.values(nft.docs ?? {}).filter((item) => item),
            image: nft.image,
          },
        ],
        maxSupply: 0,
      },
      seller_fee_basis_points: 1,
      symbol: nft.symbol,
    };
    const result = await (ipfs as IPFSHTTPClient).add(JSON.stringify(data));

    handleMintNft(`https://nft-food-safety.infura-ipfs.io/ipfs/${result.path}`, nft);

    //
  };

  const handleMintNft = async (file: string, nft: Nft) => {
    const testNftTitle = Buffer.from('Enouvo', 'utf-8');
    const testNftSymbol = Buffer.from('Enouvo', 'utf-8');
    const testNftUri = Buffer.from(file, 'utf-8');

    // Token metadata program ID
    const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
    const provider = getProvider();
    if (!provider) {
      return;
    }
    const mintKeypair: anchor.web3.Keypair = anchor.web3.Keypair.generate();
    const tokenAddress = await anchor.utils.token.associatedAddress({
      mint: mintKeypair.publicKey,
      owner: provider.wallet.publicKey,
    });
    console.log(`Address: ${provider.wallet.publicKey}`);
    console.log(`New token: ${mintKeypair.publicKey}`);
    // metadata adrress
    const metadataAddress = (
      await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mintKeypair.publicKey.toBuffer()],
        TOKEN_METADATA_PROGRAM_ID
      )
    )[0];
    console.log('Metadata initialized');
    const masterEditionAddress = (
      await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mintKeypair.publicKey.toBuffer(), Buffer.from('edition')],
        TOKEN_METADATA_PROGRAM_ID
      )
    )[0];
    console.log('Master edition metadata initialized');
    const a = JSON.stringify(idl_mint);
    const b = JSON.parse(a);
    const program = new Program(b, idl_mint.metadata.address, provider);
    console.log('program', idl_mint.metadata.address);
    try {
      // @ts-ignore
      await program.methods
        .mint(testNftTitle, testNftSymbol, testNftUri)
        .accounts({
          masterEdition: masterEditionAddress,
          metadata: metadataAddress,
          mint: mintKeypair.publicKey,
          mintAuthority: provider.wallet.publicKey,
          tokenAccount: tokenAddress,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        })
        .signers([mintKeypair])
        .rpc();

      const updates = {};
      // @ts-ignore
      updates[`Register-Certificate/${nft.id}`] = { ...nft, status: 'minted' };
      update(dbRef, updates);
      setCount((prev) => prev + 1);
      notification.open({
        description: 'Successfully !',
        message: 'Notification',
        type: 'success',
      });

      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log('Transcation error: ', err);

      notification.open({
        description: `Transcation error: ${err}`,
        message: 'Notification',
        type: 'error',
      });
    }
  };
  const columns: ColumnsType<Nft> = [
    {
      dataIndex: 'title',
      key: 'title',
      render: (text, row) => (
        <div className='flex items-center gap-4'>
          <Image preview={false} src={row.image} style={{ height: 40, objectFit: 'cover', width: 40 }} />
          <div>{text}</div>
        </div>
      ),
      title: 'Business Name',
    },
    {
      dataIndex: 'symbol',
      key: 'symbol',
      title: 'Symbol',
    },
    {
      dataIndex: 'createTime',
      key: 'createTime',
      render: (_, { createTime }) => <div>{dayjs.unix(createTime).format('DD/MM/YYYY hh:mm:ss')}</div>,
      title: 'Create At',
    },
    {
      dataIndex: 'docs',
      key: 'docs',
      render: (docs) => (
        <div className='flex gap-4'>
          {Object.values(docs ?? {})
            .filter((item) => item)
            .map((item, index) => (
              <div key={index}>
                <a download href={String(item)} rel='noreferrer' target='_blank'>
                  <FileTextOutlined className='text-2xl text-white' />
                </a>
              </div>
            ))}
        </div>
      ),
      title: 'Docs',
    },

    {
      dataIndex: 'status',
      key: 'status',
      render: (status, row) => (
        <>
          {row.status === 'approved' ? (
            <div className='flex gap-4'>
              <Tag className='flex items-center justify-center' color={handleGetStatusColor(row?.status ?? '')}>
                {row?.status?.toUpperCase() || 'Pending'}
              </Tag>
              <Button
                className='flex h-6 items-start text-base'
                style={{ height: 22 }}
                onClick={() => handleUploadIpfs(row)}
                loading={selectedNft === row.id && loading}
              >
                <div className='mt-[-4px]'>Mint</div>
              </Button>
            </div>
          ) : (
            <Tag color={handleGetStatusColor(status ?? '')}>{status?.toUpperCase() || 'Pending'}</Tag>
          )}
        </>
      ),
      title: 'Status',
    },
  ];

  useEffect(() => {
    if (address)
      get(child(dbRef, 'Register-Certificate')).then(async (snapshot) => {
        const currenNfts = Object.values(snapshot.val()).filter((item) => (item as Nft).wallet === address) as Nft[];
        setNfts(currenNfts);
      });
  }, [address, dbRef, count]);

  return (
    <div className='mt-20 mb-20'>
      <Table
        columns={columns}
        dataSource={nfts}
        pagination={false}
        rowClassName='row-table'
        rowSelection={{
          type: 'checkbox',
        }}
      />
    </div>
  );
}
