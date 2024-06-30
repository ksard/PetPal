import './App.scss'
import { Routes, Route } from "react-router-dom";
import Adoption from './pages/Adoption/Adoption';
import Events from './pages/Events/Events';
import Home from './pages/Home/Home';
import LostAndFound from './pages/LostAndFound/LostAndFound';
import PetFacilities from './pages/PetFacilities/PetFacilities';
import PetServices from './pages/PetServices/PetServices';
import Login from './pages/Login/Login';
import NavBar from './components/NavBar/NavBar';
import { AuthProvider } from './hooks/useAuth';
import RedirectToHome from './components/Routes/RedirectToHome';
import Toaster from './components/Toaster/Toaster';
import { AxiosInterceptor } from './services/Http';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <AuthProvider>
    <AxiosInterceptor>

      <div className='container'>
        <Toaster />
        <NavBar></NavBar>
        <div className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/adoption" element={<Adoption />} />
            <Route path="/events" element={<Events />} >

              </Route>
            <Route path="/petfacilities" element={<PetFacilities />} />
            <Route path="/petservices" element={<PetServices />} />
            <Route path="/lostandfound" element={<LostAndFound />} />
            <Route path="/login" element={
              <RedirectToHome>
                <Login />
              </RedirectToHome>
            } />
          </Routes>
        </div>
        <Footer></Footer>
      </div>
      </AxiosInterceptor>
    </AuthProvider>

  )
}

export default App
