import { Image, Input } from 'antd';
import logo from '../../../assets/images/logo.png';

const { Search } = Input;

export default function Footer() {
  return (
    <div className='mb-20 flex h-[430px] flex-col items-center justify-center bg-[#3B3B3B]'>
      <div className='flex  items-center justify-center gap-32'>
        <div className='flex w-3/6 justify-end gap-36'>
          <div>
            <Image preview={false} src={logo} style={{ width: 80 }} />
            <div className='mt-6 w-60  text-base text-[#858584]'>NFT Certifivate for Food Safety</div>
            <div className='mt-6 text-base  text-[#858584]'>Join our community</div>
          </div>

          <div>
            <div className='text-3xl text-white'>Explore</div>
            <div className='mt-6 w-60  text-base text-[#858584]'>NFT Certifivate for Food Safety</div>
            <div className='mt-6 text-base  text-[#858584]'>Join our community</div>
          </div>
        </div>
        <div className='flex w-3/6 flex-col'>
          <div className='text-4xl text-white'>Know more about us</div>
          <div className='mt-2 text-lg text-white'>Get news and updates at your Gmail</div>

          <Search allowClear className='mt-6 w-96 rounded-lg' enterButton='Subscribe' placeholder='Enter your email here' size='large' />
        </div>
      </div>

      <div className='container  mt-20 w-full border-t-2  pt-4 text-base text-[#858584]'>Ⓒ NFT Market. Use this template freely.</div>
    </div>
  );
}
