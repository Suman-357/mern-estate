import { useSelector } from "react-redux"
import { useState, useEffect, useRef } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../firebase";
import { updateuserstart, updateuserfailure, updateusersuccess, deleteuserfailure, deleteuserstart, deleteusersuccess, signoutuserfailure, signoutusersuccess, signoutuserstart } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from 'react-router-dom';

export default function Profile() {
  const { currentUser, loading, error } = useSelector(state => state.user)
  const fileref = useRef(null);
  const [file, setfile] = useState(undefined);
  const [fileper, setfileperc] = useState(0)
  const [fileuploaderror, setfileuploaderror] = useState(false)
  const [formdata, setformdata] = useState({})
  const [updatesuccess, setupdatesuccess] = useState(false)
  const [showlistingserror, setshowlistingserror] = useState(false);
  const [userlisting, setuserlisting] =useState([])
  const dispatch = useDispatch();
  console.log(currentUser._id)

  //firebase
  // allow read;
  // allow write: if
  // request.resource.size < 2 *1024 *1024 &&
  // request.resource.contentType.matches("image/.*")
  useEffect(() => {
    if (file) {
      handleFileupload(file);
    }
  }, [file]);

  const handleFileupload = (file) => {
    const storage = getStorage(app);
    const filename = new Date().getTime() + file.name;
    const storageref = ref(storage, filename);
    const uploadtask = uploadBytesResumable(storageref, file);

    uploadtask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      setfileperc(Math.round(progress))
    },
      (error) => {
        setfileuploaderror(true);
      },
      () => {
        getDownloadURL(uploadtask.snapshot.ref).then
          ((downloadURL) => {
            setformdata({ ...formdata, avatar: downloadURL })
          })
      }
    );
  }

  const handelchange = (e) => {
    setformdata({ ...formdata, [e.target.id]: e.target.value })
  }

  const handelsubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateuserstart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'content-Type': 'application/json',
        },
        body: JSON.stringify(formdata),
      })
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateuserfailure(data.message));
        return;
      }
      dispatch(updateusersuccess(data));
      setupdatesuccess(true);
    }
    catch (error) {
      dispatch(updateuserfailure(error.message));
    }
  }

  const handeldeleteuser = async (e) => {
    try {
      dispatch(deleteuserstart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteuserfailure(data.message));
        return;
      }
      dispatch(deleteusersuccess(data));
    } catch (error) {
      dispatch(deleteuserfailure(error.message))
    }
  }

  const handelsignout = async (e) => {
        try {
          dispatch(signoutuserstart());
          const res = await fetch('/api/auth/signout');
          const data =  await res.json()
          if (data.success === false) {
            dispatch(signoutuserfailure(data.message));
            return;
          }
          dispatch(signoutusersuccess(data.message));
        } catch (error) {
          dispatch(signoutuserfailure(data.message));
        }
  }

  const handelshowlistings = async () => {
    try {
      setshowlistingserror(false)
      const res = await fetch(`/api/user/listing/${currentUser._id}`);
      const data =  await res.json();
      if (data.success === false) {
        setshowlistingserror(true);
        return
      }
      setuserlisting(data);
      console.log(data)
    } catch (error) {
      setshowlistingserror(true);
    }
  }

 const handellistingdelete = async (listingId) =>
 {
  try {
    const res = await fetch(`/api/listing/delete/${listingId}`,{
      method: 'DELETE',
    });
    const data =  await res.json();
      if (data.success === false) {
        console.log(data.message);
        return
      }
      setuserlisting((prev) => prev.filter((listing) => listing._id !== listingId));
  } catch (error) {
    console.log(error.message)
  }
 }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl text-bold text-center my-7'>Profile</h1>
      <form onSubmit={handelsubmit} className="flex flex-col gap-4">
        <input onChange={(e) => setfile(e.target.files[0])} type="file" ref={fileref} hidden accept="image/*" />
        <img onClick={() => fileref.current.click()} className="rounded-full h-24 w-24 object-cover self-center cursor-pointer" src={formdata.avatar || currentUser.avatar} alt="img" />
        <p className="text-sm self-center">
          {fileuploaderror ?
            (<span className="text-red-700">error image upload</span>) : fileper > 0 && fileper < 100 ? (<span className="text-slate-950">{`uploding ${fileper}%`}</span>) :
              fileper === 100 ? (
                <span className="text-green-700">upload successfull</span>
              ) : ""}
        </p>
        <input className="border border-black p-3 rounded-lg" onChange={handelchange} type="text" placeholder="username" id="username" defaultValue={currentUser.username} />
        <input className="border border-black p-3 rounded-lg" onChange={handelchange} type="email" placeholder="email" id="email" defaultValue={currentUser.email} />
        <input className="border border-black p-3 rounded-lg" onChange={handelchange} type="password" placeholder="password" />
        <button className="bg-slate-950 text-white rounded-lg p-3 hover:opacity-80 disabled:opacity-70 uppercase">{loading ? 'loading...' : 'update'}</button>
        <Link className="bg-green-700 text-white rounded-lg p-3 text-center hover:opacity-80 disabled:opacity-70 uppercase" to={'/create-listing'}>create listing</Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handeldeleteuser} className="text-red-800 cursor-pointer">Delete account</span>
        <span onClick={handelsignout} className="text-red-800 cursor-pointer">Sign out</span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      <p className="text-green-700 mt-5">{updatesuccess ? 'user updated successfully!' : ''}</p>
      <button className="text-green-700 w-full" onClick={handelshowlistings}>Show listings</button>
      <p className="text-red-700 mt-5">{showlistingserror ? 'error in showing listings!' : ''}</p>
      {userlisting && userlisting.length > 0 &&
      <div className="flex flex-col gap-4">
        <h1 className="text-center mt-7 text-2xl font-semibold">Your Listing</h1>
        {userlisting.map((listing)=>(
          <div key={listing._id} className="border rounded-lg p-3 flex justify-between items-center gap-4">
            <Link to={`/listing/${listing._id}`}>
              <img src={listing.imageurls[0]} className="w-16 h-16 object-contain rounded-lg" alt="Listings"/>
            </Link>
            <Link className='text-slate-700 font-semibold hover:underline flex-1' to={`/listing/${listing._id}`}>
              <p>{listing.name}</p>
            </Link>
            <div className="flex flex-col items-center">
              <button onClick={()=>handellistingdelete(listing._id)} className="text-red-700 cursor-pointer uppercase">Delete</button>
              <Link to={`/update-listing/${listing._id}`}>
              <button className="text-green-700 cursor-pointer uppercase">Edit</button>
              </Link>
            </div>
          </div>
        ))}

      </div>}
    </div>
  )
}
