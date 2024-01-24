import { useSelector } from "react-redux"
import { useState, useEffect, useRef } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../firebase";
import { updateuserstart, updateuserfailure, updateusersuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function Profile() {
  const { currentUser } = useSelector(state => state.user)
  const fileref = useRef(null);
  const [file, setfile] = useState(undefined);
  const [fileper, setfileperc] = useState(0)
  const [fileuploaderror, setfileuploaderror] = useState(false)
  const [formdata, setformdata] = useState({})
  const dispatch = useDispatch();

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
      dispatch(updateusersuccess(data))
    }
    catch (error) {
      dispatch(updateuserfailure(error.message));
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
        <button className="bg-slate-950 text-white rounded-lg p-3 hover:opacity-80 disabled:opacity-70 uppercase">update</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-800 cursor-pointer">Delete account</span>
        <span className="text-red-800 cursor-pointer">Sign out</span>
      </div>
    </div>
  )
}
