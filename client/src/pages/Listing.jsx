import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { FaBath, FaBed, FaChair, FaParking, FaShare } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useSelector } from 'react-redux';
import Contact from '../Components/Contact';

export default function Listing() {

    const params = useParams();
    const [loading, setloading] = useState(true);
    const [listing, setlisting] = useState(null);
    const [contact, setcontact] = useState(false);
    const [error, seterror] = useState(false);
    const [copied, setcopied] = useState(false);
    const { currentUser } = useSelector(state => state.user)
   
console.log(currentUser._id , listing?.userRef)
    useEffect(() => {
        const fetchlisting = async () => {
            try {
                setloading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                if (data.success === false) {
                    seterror(true);
                    setloading(false);
                    return;
                }
                setlisting(data);
                setloading(false);
                seterror(false);
            } catch (error) {
                seterror(true);
                setloading(false);
            }

        }
        fetchlisting();
    }, [params.listingId])
    

    return (
        <main>
            {loading && <p className='text-center my-10 text-3xl'>Loading...</p>}
            {error && <p className='text-center my-10 text-3xl'>Something went Wrong</p>}
            {listing && !loading && !error &&
                (
                    <div>
                        <Swiper navigation>
                            {listing.imageurls.map((url) =>
                            (
                                <SwiperSlide key={url}>
                                    <div className='h-[550px]' style={{ background: `url(${url}) center no-repeat`, backgroundSize: `cover` }}></div>
                                </SwiperSlide>
                            )
                            )}
                        </Swiper>
                        <div className='fixed top-[13%] right-[3%] z-10 border rounded-full h-12 w-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                            <FaShare
                            className='text-slate-500'
                            onClick={()=>{
                                navigator.clipboard.writeText(window.location.href);
                                setcopied(true);
                                setTimeout(() => {
                                    setcopied(false);
                                }, 2000);
                            }}/>
                        </div>
                        {copied && (
                            <p className='top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
                                Link copied!
                            </p>
                        )}
                        <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
                            <p className='text-2xl font-semibold'>
                                {listing.name} - ${' '}
                                {listing.offer
                                ? listing.discountprice.toLocaleString('en-US')
                                : listing.regularprice.toLocaleString('en-US')}
                                {listing.type === 'rent' && ' / month'}
                            </p>
                            <p className='flex items-center mt-6 gap-2 text-slate-600 text-sm'>
                                <FaMapMarkerAlt className='text-green-700'/>
                                {listing.address}
                            </p>
                            <div className='flex gap-5'>
                                <p className='bg-red-800 w-full max-w-[200px] text-center text-white rounded-md p-2'>
                                    {listing.type === 'sale' ? 'For sale' : 'For rent'}
                                </p>
                                {listing.offer && (
                                    <button className='bg-green-800 w-full max-w-[200px] text-center text-white rounded-md p-2'>${+listing.regularprice - +listing.discountprice}</button>
                                )
                                }
                            </div>
                        <p className='text-slate-800'>
                            <span className='text-black font-semibold'>Description - </span>
                            {listing.description}
                        </p>
                        <ul className=' text-green-900 font-semibold flex flex-wrap items-center gap-4 sm:gap-6'>
                            <li className='flex items-center gap-1 whitespace-nowrap'>
                                <FaBed className='text-lg' />
                                {listing.bedroom > 1 ? `${listing.bedroom} Beds` : `${listing.bedroom} Bed`}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap'>
                                <FaBath className='text-lg' />
                                {listing.bathdroom > 1 ? `${listing.bathroom} Bathrooms` : `${listing.bathroom} Bathroom`}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap'>
                                <FaParking className='text-lg' />
                                {listing.parking ? 'Parking Spot' : 'No Parking'}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap'>
                                <FaChair className='text-lg' />
                                {listing.furnished ? `Furnished` : `Unfurnished`}
                            </li>
                        </ul>
                        { currentUser && listing.userRef !== currentUser._id && !contact && (
                            <button onClick={()=>setcontact(true)} className='bg-slate-900 text-white rounded-lg font-semibold hover:opacity-80 items-center p-4'>Contact Landlord</button>
                         )}
                         {contact && <Contact listing={listing}/>}
                        </div>
                    </div>
                )
            }
        </main>
    )
}
