import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import About from './pages/About'
import Profile from './pages/profile'
import Header from './Components/Header'
import PrivateRoute from './Components/PrivateRoute'

export default function App() {
  return (
    <BrowserRouter>
    <Header />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/signin' element={<Signin />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/about' element={<About />} />
      <Route element={<PrivateRoute />}>
        <Route path='/profile' element={<Profile />} />
      </Route>
    </Routes>
    </BrowserRouter>
  )
}
