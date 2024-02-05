import { Route, Routes } from 'react-router-dom';
import './App.css';
import LandingPage from './Pages/LandingPage';
import InstaConnect from './Pages/InstaConnect';
import Settings from './Pages/Settings';
import Friends from './Pages/Friends';
import EditAccount from './Pages/EditAccount';
import ManageFriends from './Pages/ManageFriends';
import AdminPanel from './Pages/AdminPanel';
import Notification from './Pages/Notification';
import Feedback from './Pages/Feedback';
import { useEffect, useState } from 'react';

function App() {

  const [token,setToken] = useState(localStorage.getItem("token"))

  useEffect(()=>{
      setToken(localStorage.getItem("token"))
  },[token])
  
  return (
    <div>
        {token?<Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/connect' element={<InstaConnect/>}/>
          <Route path='/settings' element={<Settings/>}/>
          <Route path='/friends' element={<Friends/>}/>
          <Route path='/settings/manage' element={<EditAccount/>}/>
          <Route path='/settings/friends' element={<ManageFriends/>}/>
          <Route path='/settings/admin' element={<AdminPanel/>}/>
          <Route path='/settings/notification' element={<Notification/>}/>
          <Route path='/settings/admin/feedback' element={<Feedback/>}/>
        </Routes>:
        <Routes><Route path='/' element={<LandingPage/>}/></Routes>}
    </div>
  );
}

export default App;
