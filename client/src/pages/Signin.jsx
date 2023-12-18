import { useState } from 'react';
import { Link ,useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInsuccess, signInfailure } from '../redux/user/userSlice.js';

export default function Signin() {

const [formdata, setformdata] = useState({});
const {loading, error} = useSelector((state) => state.user);
const Navigate = useNavigate();
const Dispatch = useDispatch();
  const handlechange = (e) =>
  {
    setformdata({...formdata, [e.target.id]: e.target.value});
  };

  const hanlesubmit = async (e) =>
  {
     e.preventDefault();
     try {
      
       Dispatch(signInStart());
       const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'content-Type': 'application/json',
        },
        body: JSON.stringify(formdata),
       });
       const data = await res.json();
       console.log(data)
       if(data.success === false){
        Dispatch(signInfailure(data.message))
        return;
       }
       Dispatch(signInsuccess(data))
       Navigate('/')
     } catch (error) {
      Dispatch(signInfailure(error.message))
      
     }

  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Sign In
      </h1>
      <form onSubmit={hanlesubmit} className='flex flex-col gap-4'>
        <input type="email" placeholder='email' id='email' className='border p-3 rounded-lg' onChange={handlechange} />
        <input type="password" placeholder='password' id='password' className='border p-3 rounded-lg' onChange={handlechange}/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-70'>{loading? 'loading...':'sign in'}</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Don't Have an account?</p>
        <Link to="/signup">
          <span className='text-blue-700'>sign up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-4'>{error}</p>}
    </div>
  )
}
