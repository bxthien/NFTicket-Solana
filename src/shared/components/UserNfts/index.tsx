/* eslint-disable @typescript-eslint/naming-convention */
import { Image } from 'antd';
import { child, get, getDatabase, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import avatar from '../../../assets/images/avatar.png';

interface NFT {
  URI: string;
  mintAccount: string;
  owner: string;
  title: string;
  name: string;
  symbol: string;
  description: string;
  seller_fee_basis_points: string;
  external_url: string;
  edition: string;
  background_color: string;
  image: string;
}

export default function UserNfts() {
  const dbRef = ref(getDatabase());
  const [nfts, setNfts] = useState<NFT[]>([]);

  useEffect(() => {
    get(child(dbRef, 'NFT-Certificate')).then(async (snapshot) => {
      if (snapshot.exists()) {
        snapshot.val().map((item: Partial<NFT>) =>
          fetch(item.URI ?? '')
            .then((response) => response.json())
            .then((responseJson) => {
              setNfts((prev) => [...prev, responseJson]);
            })
        );
      }
    });
  }, []);

  return (
    <div className='mt-20 mb-20'>
      <div className='text-2xl text-white'>Discover More NFTs Certificates</div>
      <div className='mt-2 text-sm text-white'>View Certificates available on Certi-Food</div>

      <div className='mt-14 flex w-full gap-14'>
        <Swiper className='mt-10 w-full' pagination={false} slidesPerView={'auto'}>
          {nfts.map((item, index) => (
            <SwiperSlide className='transition-in-out-common mr-[120px] w-[236px] max-w-[236px]   cursor-pointer' key={index}>
              <Link to={`/certificate/?symbol=${item.symbol}`}>
                <div className='flex w-[330px] flex-col justify-start'>
                  <Image
                    className='h-[296px] w-full bg-black object-fill'
                    preview={false}
                    src={item.image}
                    style={{ height: 296, objectFit: 'cover', width: '100%' }}
                  />
                  <div className='rounded-br-3xl rounded-bl-3xl bg-[#3B3B3B] py-4 px-6'>
                    <div className='text-lg text-white'>Ramen Rouse</div>
                    <div className='mt-2 flex items-center gap-3 text-white'>
                      <Image preview={false} src={avatar} />
                      <div className='text-sm text-white'>{item.name}</div>
                    </div>

                    <div className='mt-4 flex justify-between'>
                      <div>
                        <div className='text-[#858584]'>Price</div>
                        <div className='mt-1 text-sm text-white'>{item.seller_fee_basis_points} SOL</div>
                      </div>

                      <div>
                        <div>
                          <div className='text-[#858584]'>Create Time</div>
                          <div className='mt-1 text-sm text-white'>30/11/2022</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
