import React from 'react'
import { Navbar } from './Navbar'
import Luxurybackground from './Luxurybackground'
import Maincomponent from './Maincomponent'
import Footer from './Footer';

const Home = () => {
  return (
    <div className="relative h-screen text-white bg-black overflow-y-auto">
      <Luxurybackground />

      <div className="relative z-10">
        <Navbar />
        <Maincomponent />
        <Footer/>
       
      </div>
    </div>
  );
};

export default Home;
