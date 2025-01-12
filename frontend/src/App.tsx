import { Routes, Route, Navigate } from 'react-router-dom'


import Home from './pages/Home/Home'
import Login from './pages/Auth/Login/Login'
import SignUp from './pages/Auth/SignUp/SignUp'


const App = () => {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path='*' element={<div className='h-screen w-full flex text-[30px] justify-center items-center'>404 Not Found</div>} />
      </Routes>
    </div>
  )
}

//Define the Root component to handle the initial redirect
const Root = () => {
  //Check if the token exists in localStorage
  const isAuthentificated = !!localStorage.getItem('accessToken');

  //Redirect to the login page if not authenticated
  return isAuthentificated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
}

export default App
