import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Contact({listing}) {

  const [Landlord , setlandlord] = useState(null);
  const [message , setmessage] = useState('');
  useEffect(() => {
  
    const fetchlandlord = async() => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setlandlord(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchlandlord();
  }, [listing.userRef]);

  const onchange = (e) => {
    setmessage(e.target.value);
  }
  return (
    <>
    {Landlord && (
    <div className='flex flex-col gap-4'>
      <p>Contact <span className='font-semibold'>{Landlord.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span></p>
      <textarea name='message' id='message' rows={3} value={message} onChange={onchange} placeholder='Enter your Message...' className='w-full border p-2 rounded-lg'></textarea>
      <Link
      to={`mailto:${Landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
      className='bg-slate-900 w-full text-white text-center p-3 rounded-lg uppercase hover:opacity-80'
      >
        Send Message
      </Link>
    </div>
    )}
    </>
  )
}
