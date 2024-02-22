import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import {useSelector} from 'react-redux'
import { useEffect, useState } from 'react';

export default function Header() {
    const {currentUser} = useSelector(state => state.user);
    const [searchterm , setserchterm] = useState('');
    const navigate = useNavigate();

const handelsubmit = (e) => {
    e.preventDefault();
    const urlparams = new URLSearchParams(window.location.search);
    urlparams.set('searchterm', searchterm);
    const searchquery = urlparams.toString();
    navigate(`/search?${searchquery}`);
}

useEffect(() => {
    const urlparams = new URLSearchParams(location.search);
    const searchtermfromurl = urlparams.get('searchterm');
    if(searchtermfromurl){
        setserchterm(searchtermfromurl);
    }
}, [location.search]);




  return (
   <header className='bg-slate-200 shadow-md'>
    <div className='flex justify-between item-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>Friends</span>
            <span className='text-slate-700'>Estate</span>
        </h1>
        </Link>
        <form onSubmit={handelsubmit} className='bg-slate-100 p-3 rounded-lg flex items-center'>
            <input type='text' value={searchterm} onChange={(e) => setserchterm(e.target.value)} placeholder='Search...' className='bg-transperent focus:outline-none w-24 sm:w-64'/>
            <button>
                <FaSearch className='text-slate-600' />
            </button>
        </form>
        <ul className='flex gap-4'>
            <Link to='/'><li className='hidden sm:inline text-slate-700 hover:underline'>Home</li></Link>
            <Link to='/about'><li className='hidden sm:inline text-slate-700 hover:underline'>About</li></Link>
            <Link to='/profile'>
                {currentUser ? (
                    <img className='rounded-full h-7 w-7 object-cover'src={currentUser.avatar} alt='profile' />) : (<li className='hidden sm:inline text-slate-700 hover:underline'>Sign in</li>
            )}
                </Link>
        </ul>
    </div>
   </header>
  )
}
