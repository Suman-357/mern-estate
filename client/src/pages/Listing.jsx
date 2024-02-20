import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

export default function Listing() {

    const params = useParams();
    const [loading, setloading] = useState(true);
    const [listing, setlisting] = useState(null);
    const [error, seterror] = useState(false);

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
                    </div>
                )
            }
        </main>
    )
}
