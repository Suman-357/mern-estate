import { useSelector } from "react-redux"

export default function Profile() {
  const {currentUser} = useSelector(state => state.user)
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl text-bold text-center my-7'>Profile</h1>
      <form className="flex flex-col gap-4">
        <img className="rounded-full h-24 w-24 object-cover self-center" src={currentUser.avatar} alt="img" />
        <input className="border border-black p-3 rounded-lg" type="text" placeholder="username" id="username"/>
        <input className="border border-black p-3 rounded-lg" type="email" placeholder="email"id="email"/>
        <input className="border border-black p-3 rounded-lg" type="password" placeholder="password"/>
      <button className="bg-slate-950 text-white rounded-lg p-3 hover:opacity-80 disabled:opacity-70 uppercase">update</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-800 cursor-pointer">Delete account</span>
        <span className="text-red-800 cursor-pointer">Sign out</span>
      </div>
    </div>
  )
}
