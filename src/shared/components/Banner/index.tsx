import { Image } from 'antd';
import { useToggle } from '@enouvo/react-hooks';
import avatar from '../../../assets/images/avatar.png';
import banner from '../../../assets/images/banner.png';
import rocket from '../../../assets/images/rocket.png';
import RegisterModal from '../../../shared/components/Modals/Register';

export default function Banner() {
  const [isOpen, onOpen, onClose, _onToggle] = useToggle(false);

  return (
    <div className='flex w-full'>
      <div className='flex w-3/6 flex-col justify-end gap-6 pr-32'>
        <div className='text-lg text-white'>
          Enouverse is trusting food safety certificate platform. We provide a place that everyone can discover trusting food suppliers or
          mint certificate for your business.
        </div>
        <div className='flex h-16 w-56 cursor-pointer items-center justify-center gap-6 rounded-3xl bg-[#A259FF]' onClick={onOpen}>
          <Image preview={false} src={rocket} />
          <div className='text-base text-white'>Get Register</div>
        </div>
        <div className='flex gap-10'>
          <div>
            <div className='text-lg font-bold text-white'>240k+</div>
            <div className='text-sm text-white'>Total Sale</div>
          </div>

          <div>
            <div className='text-lg font-bold text-white'>140k+</div>
            <div className='text-sm text-white'>Auctions</div>
          </div>

          <div>
            <div className='text-lg font-bold text-white'>240k+</div>
            <div className='text-sm text-white'>Artists</div>
          </div>
        </div>
      </div>

      <div className='flex w-3/6 flex-col justify-start'>
        <Image preview={false} src={banner} />
        <div className='rounded-br-3xl rounded-bl-3xl bg-[#3B3B3B] p-4'>
          <div className='text-lg text-white'>Space Walking</div>
          <div className='mt-2 flex items-center gap-3 text-white'>
            <Image preview={false} src={avatar} />
            <div className='text-sm text-white'>Animakid</div>
          </div>
        </div>
      </div>

      <RegisterModal isOpen={isOpen} onClose={onClose} onOpen={onOpen} />
    </div>
  );
}
