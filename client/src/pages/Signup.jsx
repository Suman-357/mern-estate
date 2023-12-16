import { useState } from 'react';
import { Link ,useNavigate } from 'react-router-dom';

export default function Signup() {

const [formdata, setformdata] = useState({});
const [error, seterror] = useState(null);
const Navigate = useNavigate();
const [loading, setloading] = useState();
  const handlechange = (e) =>
  {
    setformdata({...formdata, [e.target.id]: e.target.value});
  };

  const hanlesubmit = async (e) =>
  {
     e.preventDefault();
     try {
      
       setloading(true);
       const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'content-Type': 'application/json',
        },
        body: JSON.stringify(formdata),
       });
       const data = await res.json();
       console.log(data)
       if(data.success === false){
        setloading(false);
        seterror(data.message);
        return;
       }
       setloading(false);
       seterror(null);
       Navigate('/signin')
     } catch (error) {
      setloading(false);
      seterror(error.message);
      
     }

  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Sign up
      </h1>
      <form onSubmit={hanlesubmit} className='flex flex-col gap-4'>
        <input type="text" placeholder='username' id='username' className='border p-3 rounded-lg '  onChange={handlechange}/>
        <input type="email" placeholder='email' id='email' className='border p-3 rounded-lg' onChange={handlechange} />
        <input type="password" placeholder='password' id='password' className='border p-3 rounded-lg' onChange={handlechange}/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-70'>{loading? 'loading...':'sign up'}</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className='text-blue-700'>sign in</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-4'>{error}</p>}
    </div>
  )
}
