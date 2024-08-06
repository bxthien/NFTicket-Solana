import AboutUs from '../shared/components/AboutUs';
import Banner from '../shared/components/Banner';
import CreateNFT from '../shared/components/CreateNFT';
import Nfts from '../shared/components/Nfts';
import UserNfts from '../shared/components/UserNfts';

const Home: React.FC = () => {
  return (
    <div className='flex  w-full flex-col p-20'>
      <Banner />
      <Nfts />
      <UserNfts />
      <CreateNFT />
      <AboutUs />
    </div>
  );
};

export default Home;
