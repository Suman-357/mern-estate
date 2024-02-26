import React, { useEffect, useState } from 'react'
import { Link }  from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import Listingitems from '../Components/Listingitems';

export default function Home() {

  const [offerlisting, setofferlisting] = useState([]);
  const [salelisting, setsalelisting] = useState([]);
  const [rentlisting, setrentlisting] = useState([]);
  SwiperCore.use([Navigation])
  useEffect(()=>{
    const fetchofferlisting = async () =>{
      try {
        const res = await fetch(`/api/listing/get?offer=true&limit=4`);
        const data = await res.json();
        setofferlisting(data);
        fetchrentlisting();
      } catch (error) {
        console.log(error)
      }
    }
    const fetchrentlisting = async () =>{
      try {
        const res = await fetch(`/api/listing/get?type=rent&limit=4`);
        const data = await res.json();
        setrentlisting(data);
        fetchsalelisting();
      } catch (error) {
        console.log(error)
      }
    }
    const fetchsalelisting = async () =>{
      try {
        const res = await fetch(`/api/listing/get?type=sale&limit=4`);
        const data = await res.json();
        setofferlisting(data);
      } catch (error) {
        console.log(error)
      }
    }
    fetchofferlisting();
  }, []);


  return (
    <div className=' '>
      {/* top */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className='text-slate-700 font-semibold text-3xl lg:text-6xl'>
       Find your next <span className='text-slate-500'>perfect</span> 
        <br/> place with ease 
        </h1> 
        <div className="text-slate-400 text-xs sm:text-sm">
          Friend estate is the best place to find your next perfect place to live
          <br />we have wide rangr of properties to choose from.
        </div>
        <Link to={'/search'} className='text-xs sm:text-sm font-bold text-blue-500 hover:underline'>
          let's get started...
        </Link>
      </div>



      {/* swiper */}
    <Swiper>
      {
        offerlisting && offerlisting.length >0 && offerlisting.map((listing) => (
          <SwiperSlide>
            <div style={{background: `url(${listing.imageurl[0]}) center no-repeat`, backgroundSize: 'cover'}} key={listing._id} className="h-[500px]">
            </div>
          </SwiperSlide>
        ))
      }
    </Swiper>
      {/* listing results */}
      <div className="flex flex-col gap-8 p-3 my-10 max-w-6xl mx-auto">
        {
          offerlisting && offerlisting.length >0 && (
            <div className="">
              <div className="my-3">
                <h2 className='text-2xl text-slate-700 font-semibold'>Recent offers</h2>
                <Link className='text-blue-500 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {offerlisting.map((listing) => (
                  <Listingitems listings={listing} key={listing._id}/>
                ))}
              </div>
            </div>
          )
        }
      </div>
      <div className="flex flex-col gap-8 p-3 my-10 max-w-6xl mx-auto">
        {
          rentlisting && rentlisting.length >0 && (
            <div className="">
              <div className="my-3">
                <h2 className='text-2xl text-slate-700 font-semibold'>Recent places for rent</h2>
                <Link className='text-blue-500 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {rentlisting.map((listing) => (
                  <Listingitems listings={listing} key={listing._id}/>
                ))}
              </div>
            </div>
          )
        }
      </div>
      <div className="flex flex-col gap-8 p-3 my-10 max-w-6xl mx-auto">
        {
          salelisting && salelisting.length >0 && (
            <div className="">
              <div className="my-3">
                <h2 className='text-2xl text-slate-700 font-semibold'>Recent places for sale</h2>
                <Link className='text-blue-500 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {salelisting.map((listing) => (
                  <Listingitems listings={listing} key={listing._id}/>
                ))}
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}
