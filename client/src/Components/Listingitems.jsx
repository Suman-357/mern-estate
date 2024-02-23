import React from 'react'
import { Link } from 'react-router-dom'
import { FaMapMarkerAlt } from "react-icons/fa"

export default function Listingitems({ listings }) {
    return (
        <div className='bg-white shadow-md rounded-lg w-full sm:w-[330px] hover:shadow-lg transition-shadow overflow-hidden'>
            <Link to={`/listing/${listings._id}`}>
                <img src={listings.imageurls[0]} alt="Listing cover" className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-110 transition-scale duration-500' />
                <div className="p-3 flex flex-col gap-2">
                    <p className=' text-lg font-semibold truncate'>{listings.name}</p>
                    <div className="flex items-center gap-1">
                        <FaMapMarkerAlt className='h-4 w-4 text-green-700' />
                        <p className='text-sm truncate w-full'>{listings.address}</p>
                    </div>
                    <p className='text-sm line-clamp-2'>{listings.description}</p>
                    <p className='items-center font-semibold'>${listings.offer ? listings.discountprice.toLocaleString('en-US') : listings.regularprice.toLocaleString('en-US')} {listings.type === 'rent' ? '/ month' : ''}</p>
                    <div className="flex gap-2">
                        <h4 className='items-center font-semibold'>{listings.bedroom} {listings.bedroom > 1 ? 'Beds' : 'Bed'}</h4>
                        <h4 className='items-center font-semibold'>{listings.bathroom} {listings.bathroom > 1 ? 'Bathrooms' : 'Bathroom'}</h4>
                    </div>
                </div>
            </Link>
        </div>
    )
}
