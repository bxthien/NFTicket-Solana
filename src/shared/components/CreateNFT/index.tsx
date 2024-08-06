import { Image } from 'antd';
import step1 from '../../../assets/images/step1.png';
import step2 from '../../../assets/images/step2.png';
import step3 from '../../../assets/images/step3.png';

export default function CreateNFT() {
  const steps = [
    {
      description: 'Set up your wallet of choice. Connect it to the Certi-Food by clicking the wallet icon in the top right corner.',
      image: step1,
      title: 'Setup Your wallet',
    },
    {
      description: 'Upload proof of certificate registration documents. Add description, business name and logo image.',
      image: step2,
      title: 'Upload Information',
    },
    {
      description: 'Waiting to be reviewed by the system for accuracy. Then will be issued NFT Certificate',
      image: step3,
      title: 'Waiting for approval',
    },
  ];

  return (
    <div className='mt-10 mb-20'>
      <div className='text-2xl text-white'>How to Create for a certificate NFT?</div>
      <div className='mt-2 text-sm text-white'>Find out how to get started</div>

      <div className='mt-14 flex w-full gap-14'>
        {steps.map((item, index) => (
          <div className='flex h-[430px] w-[330px] flex-col items-center justify-start rounded-2xl bg-[#3B3B3B] px-6 pt-4' key={index}>
            <Image className='mt-4 h-[250px] w-[250px]' preview={false} src={item.image} />

            <div className='mt-2 text-xl font-medium text-white'>{item.title}</div>
            <div className='mt-4 text-center text-sm text-white'>{item.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
