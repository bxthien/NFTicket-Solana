/* eslint-disable @typescript-eslint/ban-types */
import type { PropsWithChildren } from 'react';
import Footer from '../../shared/components/Footer';
import Header from '../../shared/components/Header/index';

export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <div className='min-h-screen bg-[#2B2B2B]'>
      <Header />
      <div className='flex justify-center'>
        <div className='container flex w-full flex-col' style={{ minHeight: 'calc(100vh - 526px)' }}>
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}
