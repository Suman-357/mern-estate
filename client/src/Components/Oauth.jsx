import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInsuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function Oauth() {

        const Dispatch = new useDispatch();
        const navigate = new useNavigate();
    const handlegoogleclick = async () =>{
        try {
            const provider = new GoogleAuthProvider();
            const auth = new getAuth(app);

            const result = await signInWithPopup(auth, provider);
            const res = await fetch('/api/auth/google',{
                method : 'POST',
                headers :{
                    'Content-Type' : 'application/json', 
                },
                body : JSON.stringify({
                    name: result.user.displayName,
                    email : result.user.email,
                    photo: result.user.photoURL
                }),

            });
            const data = await res.json();
            Dispatch(signInsuccess(data));
            navigate("/")
        } catch (error) {
            console.log('cannot signin with google acct',error);
        }
    }

  return (
    <button onClick={handlegoogleclick} type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-90'>
      Countinue with google
    </button>
  )
}
