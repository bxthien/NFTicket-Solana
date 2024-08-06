import { Image, Input } from 'antd';
import aboutUs from '../../../assets/images/aboutUs.png';

const { Search } = Input;

export default function AboutUs() {
  return (
    <div className='mt-10 mb-10 flex h-[430px] items-center justify-center gap-32 rounded-2xl bg-[#3B3B3B]'>
      <Image className='' preview={false} src={aboutUs} />
      <div>
        <div className='text-4xl text-white'>Know more about us</div>
        <div className='mt-2 text-lg text-white'>Get news and updates at your Gmail</div>

        <Search allowClear className='mt-6 rounded-lg' enterButton='Subscribe' placeholder='Enter your email here' size='large' />
      </div>
    </div>
  );
}
