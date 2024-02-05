import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';
import {Row , Col} from 'react-bootstrap';
import '../App.css'
import { useNavigate } from 'react-router-dom';
import { isUserBannedAPI, userLoginAPI, userRegisterAPI, verifyUserAPI } from '../api/api';
import { io } from 'socket.io-client';
import { BASE_URL } from '../api/commonAPI';
import Swal from 'sweetalert2'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../Res/—Pngtree—3d likes heart logo metallic_6215859.png'

export const socket = io.connect(`${BASE_URL}`)

function LandingPage() {

    const [isLogin,setIsLogin] = useState(false);
    const [isRegister,setIsRegister] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showAuth , setShowAuth] = useState(false);
    const navigate = useNavigate()

    useEffect(()=>{
        socket.emit("clientLeave","")
    },[])


    const handleClose = () => {
        setIsRegister(false)
        setShowModal(false);

        setRegisterInput({
            name:"",
            email:"",
            password:""
        })

        setLoginInput({
            email:"",
            password:""
        })
    }

    const closeAuth = ()=> setShowAuth(false);
    
    const [registerInput,setRegisterInput] = useState({
        name:"",
        email:"",
        password:""
    })

    const [loginInput,setLoginInput] = useState({
        email:"",
        password:""
    })


    const handleRegister = (value)=>{
       
        if(value==="Register"){
            setIsRegister(true);
            closeAuth()
            setShowModal(true)
        }
        else{
            closeAuth()
            setShowModal(true)
        }

    }

    //button clicks

    const handleButtonClick = (value)=>{
        if(isLogin){
            navigate(`/${value}`)
        }
        else{
            setShowAuth(true);
        }
    }

    //user register

    const userRegister = async(e)=>{
        e.preventDefault();
        const {name,email,password} = registerInput;

        if(!name || !email || !password){
            toast.error("Fill out all fields!");
        }
        else{
            const result = await userRegisterAPI(registerInput);
            
            if(result.status===200){
                Swal.fire({
                    title: 'Success!',
                    text: 'Registration successfull',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                  })
                handleClose()
            }
            else{
                Swal.fire({
                    title: 'Error!',
                    text: 'Somthing went wrong',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                  })
                console.log(result.response.data);
                handleClose()
            }
        }
    }

    //user login

    const userLogin = async(e)=>{
        e.preventDefault()
        
        const {email,password} = loginInput;

        if(!email || !password){
            toast.error("Fill out all fields!");
        }
        else{
            const result = await userLoginAPI(loginInput);

            if(result.status===200){
                localStorage.setItem("existingUser",result.data.existingUser._id);
                localStorage.setItem("token",result.data.token);
                verifyUser()
                handleClose()

                Swal.fire({
                    title: 'Success!',
                    text: 'Login successfull',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                  })
            }
            else if(result.response.status == 401){
                Swal.fire({
                    title: 'Error!',
                    text: 'Your account is Banned',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                  })

                  handleClose()
            }
            else{
                Swal.fire({
                    title: 'Error!',
                    text: 'Incorrect credentials',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                  })
                console.log(result.response.data);
                handleClose()
            }
        }

    }

    //verify user login

    const verifyUser = async()=>{
        const token = localStorage.getItem("token")
            if(token){
                const reqHeader = {
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${token}`
                  }
                try{
                    const {data} = await verifyUserAPI(reqHeader)
                
                    if(data.verify){
                        setIsLogin(true)
                    }
                    else{
                        setIsLogin(false)
                    }
                }
                catch(err){
                    console.log(err);
                    localStorage.removeItem("token")
                    localStorage.removeItem("existingUser")
                    alert("You were logged out due to a unexpected error")
                }
            }
            else{
                setIsLogin(false)
            }
    }

    const isBanned = async()=>{
        const user = localStorage.getItem('existingUser')
        if(user){
            const data = {
                user
            }

            const result = await isUserBannedAPI(data)
            if(result.status=="200"){

            }
            else if(result.response.status=="401"){

                localStorage.removeItem('existingUser')
                localStorage.removeItem('token')
                Swal.fire({
                    icon:"error",
                    title:result.response.data.cause.title,
                    text:result.response.data.cause.description
                })

                verifyUser()
            }
        }
    }

    useEffect(()=>{
        isBanned()
        verifyUser()
    },[])

    useEffect(()=>{
        verifyUser()
    },[isLogin])


  return (
     <>
         <div className='landingDiv vh-100 vw-100 m-0 p-0 d-flex align-items-center position-relative'>
            <h2 className='proTitle'>Insta<span>Connect</span></h2>
             <div className='w-100 d-flex buttonDiv'>
                <div className='position-relative neonDiv'>
                     <button className='fs-4 px-4 py-2 neon-button'
                     onClick={()=>handleButtonClick("settings")}
                     >Settings</button>
                </div>                 
                 <div className='position-relative neonDiv'>
                     <button className='fs-4 px-4 py-2 neon-button'
                     onClick={()=>handleButtonClick('connect')}
                     >{isLogin?"Quick Connect":"Get Started"}</button>
                 </div>

                 <div className='position-relative'>
                    <button className='fs-4 px-4 py-2 neon-button'
                    onClick={()=>handleButtonClick("friends")}
                    >Friends</button>
                </div>
             </div>
         </div>

    
        <Modal show={showAuth} onHide={closeAuth} centered>
      
            <Modal.Body className='modalbody d-flex justify-content-center  rounded'>
                <Row className='h-100 w-100'>
                    <Col lg={6} className='h-100 container'>
                        <button name='register' className='h-100 w-100 py-5 bg-dark'
                        onClick={()=>handleRegister("Register")}>
                            <span>
                                <div>
                                    <h6>New user?</h6>
                                    <h2 >Register</h2>
                                </div>
                            </span>
                        </button>
                    </Col>

                    <Col lg={6} className='h-100 container'>
                        <button name='login' className='h-100 w-100 py-5 bg-dark'
                        onClick={()=>handleRegister("Login")}>
                            <span>
                                <div>
                                    <h6>Existing user?</h6>
                                    <h2>Login</h2>
                                </div>
                            </span>
                        </button>
                    </Col>
                </Row>
            </Modal.Body>

        </Modal>

         
        <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Body className='registerModal rounded py-5'>

            {
                isRegister?
                    <div className='w-100 d-flex flex-column align-items-center justify-content-center'>
                        <div className='d-flex flex-column inputDivs'>
                            <label htmlFor="name" className='text-light'>Name</label>
                            <input id='name' type="text" placeholder='Enter your name...'
                            className='px-4 py-2 rounded fs-5 regInput' 
                            onChange={(e)=>setRegisterInput({...registerInput,name:e.target.value})} value={registerInput.name}
                            />
                        </div>

                        <div className='d-flex flex-column inputDivs'>
                            <label htmlFor="email" className='text-light'>Email</label>
                            <input id='email' type="email" placeholder='Enter your email...'
                            className='px-4 py-2 rounded fs-5 regInput' 
                            onChange={(e)=>setRegisterInput({...registerInput,email:e.target.value})} value={registerInput.email}
                            />
                        </div>

                        <div className='d-flex flex-column'>
                            <label htmlFor="password" className='text-light'>Password</label>
                            <input id='password' type="password" placeholder='Enter your password...'
                            className='px-4 py-2 rounded fs-5 regInput' 
                            onChange={(e)=>setRegisterInput({...registerInput,password:e.target.value})} value={registerInput.password}
                            />
                        </div>

                        <button onClick={userRegister}  className='mt-4 custom-btn btn-7'><span>Register</span></button>
                    </div>
                    :
                    <div className='w-100 d-flex flex-column align-items-center justify-content-center'>

                        <div className='d-flex flex-column inputDivs'>
                            <label htmlFor="email" className='text-light'>Email</label>
                            <input id='email' type="email" placeholder='Enter your email...'
                            className='px-4 py-2 rounded fs-5 regInput'
                            onChange={(e)=>setLoginInput({...loginInput,email:e.target.value})} value={loginInput.email}
                             />
                        </div>

                        <div className='d-flex flex-column'>
                            <label htmlFor="password" className='text-light'>Password</label>
                            <input id='password' type="password" placeholder='Enter your password...'
                            className='px-4 py-2 rounded fs-5 regInput'
                            onChange={(e)=>setLoginInput({...loginInput,password:e.target.value})} value={loginInput.password}
                             />
                        </div>

                        <button onClick={userLogin} className='mt-4 custom-btn btn-7'><span>Login</span></button>
                    </div>

            }
            
        </Modal.Body>
        </Modal>

        
        <ToastContainer />

    </>
  )
}

export default LandingPage