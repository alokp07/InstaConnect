import React, { useEffect, useRef } from 'react'
import '../App.css'
import { Row,Col } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import { useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { socket } from './LandingPage';
import { Modal } from 'react-bootstrap';
import { addToFriendsAPI } from '../api/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

function InstaConnect() {

  const [show, setShow] = useState(false);
  const [waitingModal,setWaitingModal] = useState(false)

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [message,setMessage] = useState('')
  const [room,setRoom] = useState('')

  const [msg,setMsg] = useState([])

  const [friend,setFriend] = useState('')
  const [friendBtn,setFriendBtn] = useState('Friends +')
  const [disabled,setDisabled] = useState(false)

  const userId = localStorage.getItem("existingUser");

  const closeWaitingModal = ()=>{setWaitingModal(false)}

  
  const chatDiv = useRef(null)

  const stagingArea = ()=>{
    if(room){
      setRoom("")
      setMsg([])
      setDisabled(false)
      socket.emit("clientLeave",room)
    }

    setWaitingModal(true)
    socket.emit("waiting",{userId})
  }

  const handleFriends = ()=>{

      if(room){
        if(friend){
          socket.emit('reqAccepted',userId)
          addToFriends(friend)
          setFriendBtn('friends')
        }
        else{
          socket.emit("friendReq",userId)
          setDisabled(true)
          setFriendBtn('Req sent')
        }  
      }
  }

  const addToFriends = async(data)=>{

    const body = {
      userId,
      friendId:data
    }

    setFriendBtn("friends")
    setDisabled(true)
    const res = await addToFriendsAPI(body)

    if(res.status=="200"){
      toast.success("Stranger added to friends")
    }
    else{
      toast.warning("Already in your Friends list")
    }
  }

  const sendMessage = async(e)=>{
    e.preventDefault();

    if(message !== "" && room){
      console.log(`room : ${room}`);
      const newMessage = {
        room,
        message,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
      }

      setMsg((prevMessages)=>[...prevMessages,{...newMessage,sent:true}]) 
      scrollToBottom()
      await socket.emit("sendMessage",newMessage);
      setMessage("")
      const msgIp = document.getElementById('messageInput')
      msgIp.focus()
    }
  }

  const displayMessage = (data)=>{
      setMsg((prevMessages)=>[...prevMessages,{...data,sent:false}])
      scrollToBottom()
  }

  const markerRef = useRef(null);

  const scrollToBottom = () => {
    if (markerRef.current) {
      markerRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' },0);
    }
  };

  useEffect(()=>{

    socket.on("joinedRoom",(data)=>{
      if(room===""){
        setRoom(data.room)
        setWaitingModal(false)
      }
      else{
        console.log("already in room");
      }
    })

    socket.on("reciveMessage",(data)=>{
      displayMessage(data)
    })

    socket.on("userLeft",()=>{
      setRoom("")
      setMsg([])
      setDisabled(false)
      toast.error("user left the room")
    })

    socket.on("RecivefriendReq",(data)=>{
        setFriend(data)
    })

    socket.on("reciveRequestAccepted",(data)=>{
        addToFriends(data)
    })

    return () => {
      // Cleanup: Remove event listeners
      socket.off("joinedRoom");
      socket.off("reciveMessage");
      socket.off("userLeft");
      socket.off("RecivefriendReq")
      socket.off("reciveRequestAccepted")
    };

  },[])

  return (
      <>
        <div className='vh-100 vw-100 d-flex justify-content-center bg-black'>
          <Row className='h-100 w-100'>
              <Col lg={3} className='profileCol p-0'>
                    <div className='h-100 w-100 d-flex align-items-center justify-content-center'>
                      <div className='d-flex flex-column align-items-center justify-content-center'>
                        <div className='strangerProfileDiv'>
                          <img width={'100%'} src="https://static.vecteezy.com/system/resources/previews/002/331/587/original/unknown-person-user-icon-line-vector.jpg" alt="" />
                        </div>
                        
                        <h5 className='text-primary mt-3'>{room?"Stranger":"?"}</h5>
                        <span className={room?"text-success":"text-danger"}>{room?"Online":"Offline"}</span>
                        
                        <div className='mt-3'>
                           <Button variant='outline-success' disabled={disabled} onClick={handleFriends}>{friendBtn}</Button>
                           <Button variant='outline-danger' className='ms-3'
                           onClick={stagingArea}
                           >{room?"Next Chat":"New Chat"}</Button>
                        </div>
                      </div>
                    </div>
              </Col>
              <Col lg={9} className='chatCol p-0 h-100'>
                  <div className='h-100 w-100'>
                    <div className='chatDiv pt-3 pb-2 w-100 d-flex pe-5'>
                        <div className='sidebar h-100 d-flex flex-column align-items-center justify-content-center position-relative' style={{visibility:"hidden"}}>
                           <div>
                             <button className='toggle-btn rounded ms-2' 
                             onClick={handleShow}><i className="fa-solid fa-bars"></i>
                             </button>

                             <div className={`${room?"text-success":"text-danger"} text-center`}>
                                <i className="fa-solid fa-question"></i>
                             </div>

                             <div className='mt-4 mb-4 text-center'>
                              <button className='btn sidebarButton' disabled={disabled} onClick={handleFriends}><i className="fa-solid fa-user-plus"></i></button>
                             </div>

                             <div className='text-center'>
                              <button onClick={stagingArea} className='btn sidebarButton'><i className="fa-solid fa-plus"></i></button>
                             </div>

                           </div>
                        </div>

                        <div id='chatDisplayDiv' className='h-100 text-light chatDisplayDiv pe-3 pb-1'>
                            {msg?.length>0?msg.map((data)=>(
                                <div className={data.sent?"msgContainer1":"msgContainer"}>
                                    {data.message}
                                </div>
                            ))
                              :""
                            }
                            <div className='mt-5' ref={markerRef}></div>
                        </div>
                    </div>
                    <div className="chatInputDiv w-100 d-flex align-items-center justify-content-center">
                      <div className='d-flex align-items-center w-75 position-relative'>
                          <input id='messageInput' type="text" placeholder='Type here...' className='messageInputBox ps-4'
                          onChange={(e)=>setMessage(e.target.value)} value={message}/>
                          <button className='btn text-light btn-dark me-2 send-btn'
                          onClick={sendMessage}>
                            <i className="fa-regular fa-paper-plane"></i>
                          </button>
                      </div>
                    </div>
                  </div>
              </Col>
          </Row>
        </div>

        <Offcanvas show={show} onHide={handleClose}>
          <Offcanvas.Body className='bg-black p-0 m-0 position-relative'>
              <div className='profileCol h-100 w-100 d-flex align-items-center justify-content-center'>
                <div className='d-flex flex-column align-items-center justify-content-center'>
                  <div className='strangerProfileDiv'>
                    <img width={'100%'} src="https://static.vecteezy.com/system/resources/previews/002/331/587/original/unknown-person-user-icon-line-vector.jpg" alt="" />
                  </div>
                  
                  <h5 className='text-primary mt-3'>{room?"Stranger":"?"}</h5>
                  <span className={room?"text-success":"text-danger"}>{room?"Online":"Offline"}</span>
                  
                  <div className='mt-3'>
                     <Button variant='outline-success' disabled={disabled} onClick={handleFriends}>{friendBtn}</Button>
                     <Button variant='outline-danger' className='ms-3'
                     onClick={stagingArea}
                     >{room?"Next chat":"New chat"}</Button>
                  </div>
                </div>
              </div>
              <Button variant='outline-danger' className='toggle-close' onClick={handleClose}><i className="fa-solid fa-xmark"></i></Button>
          </Offcanvas.Body>
        </Offcanvas>

        <Modal show={waitingModal} onHide={closeWaitingModal} centered className='d-flex'>
          <Modal.Body className='rounded position-relative d-flex justify-content-center align-items-center' style={{backgroundColor:'black'}}>
                <div>
                  <div class="loader">
                    <div class="loader-inner">
                      <div class="loader-line-wrap">
                        <div class="loader-line"></div>
                      </div>
                      <div class="loader-line-wrap">
                        <div class="loader-line"></div>
                      </div>
                      <div class="loader-line-wrap">
                        <div class="loader-line"></div>
                      </div>
                      <div class="loader-line-wrap">
                        <div class="loader-line"></div>
                      </div>
                      <div class="loader-line-wrap">
                        <div class="loader-line"></div>
                      </div>
                    </div>
                  </div>
                </div>
          </Modal.Body>
        </Modal>
            
        <ToastContainer />

      </>
  )
}

export default InstaConnect