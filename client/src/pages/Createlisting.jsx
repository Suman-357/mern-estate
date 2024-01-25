import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React from 'react'
import { useState } from 'react'
import { app } from '../firebase';

export default function Createlisting() {

    const [files, setfiles] = useState([]);
    const [formdata, setformdata] = useState({
        imageurls:[]
    })
    const [imageuploaderror, setimageuploaderror] = useState(false);
    const [uploading, setuploading] = useState(false);

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

  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create a listing</h1>
        <form className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
                <input type='text' placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength={64} minLength={10} required /> 
                <textarea type='text' placeholder='Description' className='border p-3 rounded-lg' id='description' required /> 
                <input type='text' placeholder='address' className='border p-3 rounded-lg' id='address' maxLength={64} minLength={10} required /> 
                <div className='flex gap-6 flex-wrap'>
                    <div className="flex gap-2">
                        <input type='checkbox' className='w-5' id='sale' />
                        <span>Sell</span>
                    </div>
                    <div className="flex gap-2">
                        <input type='checkbox' className='w-5' id='rent' />
                        <span>Rent</span>
                    </div>
                    <div className="flex gap-2">
                        <input type='checkbox' className='w-5' id='parking' />
                        <span>Parking Spot</span>
                    </div>
                    <div className="flex gap-2">
                        <input type='checkbox' className='w-5' id='furnished' />
                        <span>Furnished</span>
                    </div>
                    <div className="flex gap-2">
                        <input type='checkbox' className='w-5' id='offer' />
                        <span>Offer</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-3">
                        <input type='number' id='bedroom' min={1} max={10} className='p-3 border border-gray-300 rounded-lg'/>
                        <p>Bedrooms</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <input type='number' id='bathroom' min={1} max={10} className='p-3 border border-gray-300 rounded-lg'/>
                        <p>Bathrooms</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <input type='number' id='regularprice' min={1} max={100} className='p-3 border border-gray-300 rounded-lg'/>
                        <div className="flex flex-col items-center">
                        <p>Regular Price</p>
                        <span className='text-xs'>($ / month)</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <input type='number' id='discountprice' min={1} max={100} className='p-3 border border-gray-300 rounded-lg'/>
                        <div className="flex flex-col items-center">
                        <p>Discounted Price</p>
                        <span className='text-xs'>($ / month)</span>
                        </div>
                    </div>
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
            <button className="bg-slate-700 text-white rounded-lg p-3 text-center hover:opacity-80 disabled:opacity-70 uppercase">create listing</button>
            </div>
        </form>
    </main>
  )
}
