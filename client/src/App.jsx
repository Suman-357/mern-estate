import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './Components/Header'
import PrivateRoute from './Components/PrivateRoute'
import Createlisting from './pages/Createlisting'
import Updatelisting from './pages/Updatelisting'
import Listing from './pages/Listing'
import Search from './pages/Search'

export default function App() {
  return (
    <BrowserRouter>
    <Header />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/signin' element={<Signin />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/about' element={<About />} />
      <Route path='/search' element={<Search />} />
      <Route path='/listing/:listingId' element={<Listing />} />
      <Route element={<PrivateRoute />}>
        <Route path='/profile' element={<Profile />} />
        <Route path='/create-listing' element={<Createlisting />} />
        <Route path='/update-listing/:listingId' element={<Updatelisting />} />
      </Route>
    </Routes>
    </BrowserRouter>
  )
}
