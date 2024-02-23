import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Listingitems from '../Components/Listingitems';

export default function Search() {
    const navigate = useNavigate();
    const [sidebardata, setsidebardata] = useState({
        searchterm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc',
    })
    const [loading, setloading] = useState(false);
    const [listing, setlisting] = useState([]);
    const [showmore, setshowmore] = useState(false);

    console.log(listing);

    useEffect(() => {
        const urlparams = new URLSearchParams(location.search);
        const searchtermfromurl = urlparams.get('searchterm')
        const typefromurl = urlparams.get('type')
        const offerfromurl = urlparams.get('offer')
        const parkingfromurl = urlparams.get('parking')
        const furnishedfromurl = urlparams.get('furnished')
        const sortfromurl = urlparams.get('sort')
        const orderfromurl = urlparams.get('order')

        if (searchtermfromurl || typefromurl || offerfromurl || parkingfromurl || furnishedfromurl || sortfromurl || orderfromurl) {
            setsidebardata({
                searchterm: searchtermfromurl || '',
                type: typefromurl || 'all',
                parking: parkingfromurl === 'true' ? true : false,
                furnished: furnishedfromurl === 'true' ? true : false,
                offer: offerfromurl === 'true' ? true : false,
                sort: sortfromurl || 'created_at',
                order: orderfromurl || 'desc',
            })
        }

        const fetchlisting = async () => {
            setloading(true)
            const searchquery = urlparams.toString();
            const res = await fetch(`/api/listing/get?${searchquery}`);
            const data = await res.json();
            if (data.length > 8) {
                setshowmore(true);
            } else {
                setshowmore(false);
            }
            setlisting(data);
            setloading(false);
        }

        fetchlisting();

    }, [location.search])



    const handelchange = (e) => {

        if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
            setsidebardata({ ...sidebardata, type: e.target.id })
        }
        if (e.target.id === 'searchterm') {
            setsidebardata({ ...sidebardata, searchterm: e.target.value })
        }
        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setsidebardata({ ...sidebardata, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false })
        }
        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc';
            setsidebardata({ ...sidebardata, sort, order });
        }


    }

    const handelsubmit = (e) => {
        e.preventDefault();
        const urlparams = new URLSearchParams();
        urlparams.set('searchterm', sidebardata.searchterm)
        urlparams.set('type', sidebardata.type)
        urlparams.set('parking', sidebardata.parking)
        urlparams.set('offer', sidebardata.offer)
        urlparams.set('furnished', sidebardata.furnished)
        urlparams.set('sort', sidebardata.sort)
        urlparams.set('order', sidebardata.order)
        const searchquery = urlparams.toString();
        navigate(`/search?${searchquery}`)

    }
    const handelshowmore = async () => {
        const numberoflisting = listing.length;
        const startindex = numberoflisting;
        const urlparams = new URLSearchParams(location.search);
        urlparams.set('startindex', startindex);
        const searchquery = urlparams.toString();
        const res = await fetch(`/api/listing/get?${searchquery}`);
        const data = await res.json();
        if (data.length < 9) {
            setshowmore(false)
        }
        setlisting([...listing, ...data]);
    }
    return (
        <div className='flex flex-col md:flex-row'>
            <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
                <form onSubmit={handelsubmit} className='flex flex-col gap-6'>
                    <div className="flex items-center gap-3 ">
                        <label className='whitespace-nowrap font-semibold'>Search Term: </label>
                        <input type="text"
                            id='searchterm'
                            placeholder='Search...'
                            className='border rounded-lg p-3 w-full'
                            value={sidebardata.searchterm}
                            onChange={handelchange}
                        />
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='font-semibold'>Type: </label>
                        <div className="flex gap-2">
                            <input type="checkbox" id="all" className='w-5' checked={sidebardata.type === 'all'} onChange={handelchange} />
                            <span>Rent & Sale</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="rent" className='w-5' onChange={handelchange} checked={sidebardata.type === 'rent'} />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="sale" className='w-5' checked={sidebardata.type === 'sale'} onChange={handelchange} />
                            <span>Sale</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="offer" className='w-5' onChange={handelchange} checked={sidebardata.offer} />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='font-semibold'>Amenities: </label>
                        <div className="flex gap-2">
                            <input type="checkbox" id="parking" className='w-5' onChange={handelchange} checked={sidebardata.parking} />
                            <span>Parking</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="furnished" className='w-5' onChange={handelchange} checked={sidebardata.furnished} />
                            <span>Furnished</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className='font-semibold'>Sort: </label>
                        <select onChange={handelchange} defaultValue={sidebardata.sort} id="sort_order" className='border rounded-lg p-2'>
                            <option value='regularprice_desc'>Price high to low</option>
                            <option value='regularprice_asc'>Price low to high</option>
                            <option value='createdAt_desc'>Latest</option>
                            <option value='createdAt_asc'>Oldest</option>
                        </select>
                    </div>
                    <button className='bg-slate-800 text-white p-2 items-center w-full rounded-lg uppercase hover:opacity-80'>Search</button>
                </form>
            </div>
            <div className="flex-1">
                <h1 className='text-3xl font-semibold p-3 mt-5'>Listing Results: </h1>
                <div className="p-7 flex flex-wrap gap-3">
                    {!loading && listing.length == 0 && (
                        <p className='text-2xl font-semibold text-center w-full'>No Listing Found!</p>
                    )}
                    {loading && (
                        <p className='text-2xl font-semibold text-center w-full'>Loding...</p>
                    )}


                    {!loading && listing && listing.map((listings) => (
                        <Listingitems key={listings._id} listings={listings} />
                    ))}
                    {
                        showmore && (
                            <button className='text-green-700 hover:underline' onClick={handelshowmore}>show more</button>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
