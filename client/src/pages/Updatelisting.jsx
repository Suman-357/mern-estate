import { useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect } from 'react'
import { useState } from 'react'
import { app } from '../firebase'
import { useNavigate, useParams } from 'react-router-dom'


export default function Createlisting() {

    const { currentUser } = useSelector(state => state.user)
    const [files, setfiles] = useState([]);
    const params = useParams();
    const navigate = useNavigate();
    const [formdata, setformdata] = useState({
        imageurls:[],
        name:'',
        description:'',
        address:'',
        regularprice:0,
        discountprice:0,
        bathroom:1,
        bedroom:1,
        furnished: false,
        parking: false,
        type:"rent",
        offer: false,
    })
    const [imageuploaderror, setimageuploaderror] = useState(false);
    const [uploading, setuploading] = useState(false);
    const [Error, setError] = useState(false);
    const [loading, setloading] = useState(false)
    
useEffect(() => {
    const fetchlisting = async () => {
        const listingId = params.listingId;
        const res = await fetch(`/api/listing/get/${listingId}`);
        const data = await res.json();
        if(data.success == false){
            console.log(error.message);
            return
        }
        setformdata(data);
    };
    fetchlisting();

}, []);

    const handelimage = (e) => {
      if(files.length > 0 && files.length < 7){
        setuploading(true);
        const promises = [];


        for (let i=0;i < files.length; i++){
            promises.push(storeImage(files[i]));
        }
        Promise.all(promises).then((urls)=>{
            setformdata({
                ...formdata,
                imageurls: formdata.imageurls.concat(urls)
            });setimageuploaderror(false);
            setuploading(false);
        }).catch((err)=>{
            setimageuploaderror('image upload failed')
            setuploading(false);
        })
      }
      else{
        setimageuploaderror("you can upload only 6 images");
        setuploading(false);
      }
    };



    const storeImage = async(file) =>{
        return new Promise((resolve,reject) => {
                const storage = getStorage(app);
                const filename = new Date().getTime() + file.name;
                const storageref = ref(storage,filename);
                const uploadetask = uploadBytesResumable(storageref, file);

                uploadetask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        
                      },
                    (error)=>{
                        reject(error);
                    },

                    ()=>{
                        getDownloadURL(uploadetask.snapshot.ref).then((downloadURL)=>{
                            resolve(downloadURL);
                        })
                    }
                )
        });
    } 

    const handelremoveimage = (index) =>{
        setformdata({
            ...formdata, imageurls: formdata.imageurls.filter((_,i) => i !== index)
        })
    }

    const handelchange = (e) =>{
            if(e.target.id === 'sale' || e.target.id === 'rent'){
                setformdata({...formdata, type: e.target.id})
            }
            if(e.target.id === 'parking' || e.target.id === 'offer' || e.target.id === 'furnished' ){
                setformdata({...formdata, [e.target.id] : e.target.checked})
            }
            if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea' ){
                setformdata({...formdata, [e.target.id] : e.target.value})
            }
    };

    const handelsubmit = async(e) =>{
        e.preventDefault();
        try {
            if(formdata.imageurls < 1) return setError('you must upload atleast one image');
            if(+formdata.regularprice < +formdata.discountprice) return setError('discount price must be less than regular price');
            setloading(true);
            setError(false);

            const res = await fetch(`/api/listing/update/${params.listingId}`, 
            {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({...formdata ,
                     userRef: currentUser._id,}),
              });
              const data = await res.json();
              setloading(false);
              if (data.success === false) {
                setError(data.message);
              }
              navigate(`/listing/${data._id}`);
        } catch (error) {
            setError(error.message);
            setloading(false)
        }
    }

  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Update a listing</h1>
        <form onSubmit={handelsubmit} className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
                <input type='text' placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength={64} minLength={10} required onChange={handelchange} value={formdata.name} /> 
                <textarea type='text' placeholder='Description' className='border p-3 rounded-lg' id='description' required onChange={handelchange} value={formdata.description} /> 
                <input type='text' placeholder='address' className='border p-3 rounded-lg' id='address' maxLength={64} minLength={10} required onChange={handelchange} value={formdata.address} /> 
                <div className='flex gap-6 flex-wrap'>
                    <div className="flex gap-2">
                        <input type='checkbox' className='w-5' id='sale' onChange={handelchange} checked={formdata.type === 'sale'}/>
                        <span>Sell</span>
                    </div>
                    <div className="flex gap-2">
                        <input type='checkbox' className='w-5' id='rent' onChange={handelchange} checked={formdata.type === 'rent'} />
                        <span>Rent</span>
                    </div>
                    <div className="flex gap-2">
                        <input type='checkbox' className='w-5' id='parking' onChange={handelchange} checked={formdata.parking} />
                        <span>Parking Spot</span>
                    </div>
                    <div className="flex gap-2">
                        <input type='checkbox' className='w-5' id='furnished' onChange={handelchange} checked={formdata.furnished} />
                        <span>Furnished</span>
                    </div>
                    <div className="flex gap-2">
                        <input type='checkbox' className='w-5' id='offer' onChange={handelchange} checked={formdata.offer} />
                        <span>Offer</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-3">
                        <input type='number' id='bedroom' min={1} max={10} className='p-3 border border-gray-300 rounded-lg' onChange={handelchange} value={formdata.bedroom} />
                        <p>Bedrooms</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <input type='number' id='bathroom' min={1} max={10} className='p-3 border border-gray-300 rounded-lg'  onChange={handelchange} value={formdata.bathroom} />
                        <p>Bathrooms</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <input type='number' id='regularprice' min={1} max={1000000} className='p-3 border border-gray-300 rounded-lg'  onChange={handelchange} value={formdata.regularprice} />
                        <div className="flex flex-col items-center">
                        <p>Regular Price</p>
                        <span className='text-xs'>($ / month)</span>
                        </div>
                    </div>
                    { formdata.offer && (
                    <div className="flex items-center gap-3">
                        <input type='number' id='discountprice' min={1} max={1000000} className='p-3 border border-gray-300 rounded-lg' onChange={handelchange} value={formdata.discountprice} />
                        <div className="flex flex-col items-center">
                        <p>Discounted Price</p>
                        <span className='text-xs'>($ / month)</span>
                        </div>
                    </div>

                    )}
                </div>
            </div>
            <div className='flex flex-col flex-1 gap-4'>
                <p className='font-semibold'>Image:
                <span className='font-normal text-gray-700 ml-2'>The first image will be the cover (max 6)</span>
                </p>
                <div className="flex gap-4">
                    <input onChange={(e)=> setfiles(e.target.files)} type="file" id='image' accept='image/*' multiple className='border p-3 border-gray-300 rounded w-full' />
                    <button type='button' onClick={handelimage} className=' border border-green-600 p-3 text-green-600 text-center uppercase rounded disabled:opacity-70 hover:shadow-lg'>{uploading ? 'uploading...' : 'upload'}</button>
                </div>
            <span className='text-sm text-red-700'>{imageuploaderror && imageuploaderror}</span>
            {
                formdata.imageurls.length > 0 && formdata.imageurls.map((url, index)=>(
                    <div key={url} className="flex justify-between p-3 border items-center">
                        <img src={url} alt='img' className='w-20 h-20 object-contain rounded-lg'/>
                        <button onClick={()=>handelremoveimage(index)} type='button' className='p-3 uppercase text-red-700 hover:opacity-70'>delete</button>
                    </div>
                ))
            }
            <button onSubmit={handelsubmit} disabled={loading || uploading} className="bg-slate-700 text-white rounded-lg p-3 text-center hover:opacity-80 disabled:opacity-70 uppercase">{loading ? 'Updating...' : 'Update listing'}</button>
            {Error && <p className='text-red-700 text-sm'>{Error}</p>}
            </div>
        </form>
    </main>
  )
}
