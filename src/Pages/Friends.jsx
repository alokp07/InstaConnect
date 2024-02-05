import React, { useEffect, useRef, useState } from 'react'
import { Row,Col, Button } from 'react-bootstrap'
import Offcanvas from 'react-bootstrap/Offcanvas';
import { socket } from './LandingPage';
import { getChatAPI, getFriendsDetailsAPI, reportUserAPI } from '../api/api'
import { Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';


function Friends() {

    const userId = localStorage.getItem('existingUser')

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [reportContent,setReportContent] = useState({
      userId,
      msg:'',
      user:''
    })

    const [showRep,setShowRep] = useState(false)

    const showRepModal = (user,msg)=>{
        setReportContent({
          userId,
          msg,
          user
        })

        setShowRep(true)
    }
    const closeRep =()=> {
      setReportContent({
        userId,
        msg:"",
        user:""
      })

      setShowRep(false)
    }

    

    const [room,setRoom] = useState('')
    const [message,setMessage] = useState('')
    const [msg,setMsg] = useState([])
    const [friends,setFriends] = useState([])
    const [activeBtn,setActiveBtn] = useState(null)
    const [search,setSearch] = useState('')

    


    const getFriendsDetails = async()=>{
        const userId = localStorage.getItem('existingUser')
        const data = {
          userId
        }
        const result = await getFriendsDetailsAPI(data)
        
        if(result.status==200){
          setFriends(result.data)
        }
    }

    const getChat = async(data,e)=>{

      e.preventDefault()
      setMsg([])
      setRoom(data)
      setActiveBtn(data)

      const body = {
        clientOne:data,
        clientTwo:userId
      }

      const res = await getChatAPI(body)

      console.log(res);

      if(res.data){
        res.data.messages.forEach(item=>{
          const newMessage = {
            room,
            message:item.message,
            userId
          }
          if(item.sent==userId){
            setMsg((prevMessages)=>[...prevMessages,{...newMessage,client:item.sent,sent:true}])
          }
          else{
            setMsg((prevMessages)=>[...prevMessages,{...newMessage,client:item.sent,sent:false}])
          }
        })
      }

      
    }

    const joinRoom = ()=>{
      socket.emit("joinPrivate",userId) 
    }

    const sendMessage = async()=>{

      if(message !== "" && room){
        const newMessage = {
          room,
          message,
          userId
        }
  
        setMsg((prevMessages)=>[...prevMessages,{...newMessage,sent:true}])
        await socket.emit("sendPrivate",newMessage);
        setMessage("")
        const msgIp = document.getElementById('messageInput')
        msgIp.focus()
      }
    }

    const displayMessage = (data)=>{
      if(data.userId==room){
        setMsg((prevMessages)=>[...prevMessages,{...data,sent:false}])
      }
  }

  const markerRef = useRef(null);

  const scrollToBottom = () => {
    if (markerRef.current) {
      markerRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' },0);
    }
  };


  const reportMessage = async()=>{
    const {user} = reportContent;
    if(user==userId){
      Swal.fire({
        icon:"warning",
        title:"You cant report Your self"
      })

      closeRep()
    }
    else{
        const result = await reportUserAPI(reportContent)

        if(result.status=='200'){
          Swal.fire({
            icon:"success",
            title:"User has been reported"
          })
        }
        else if(result.response.status=='400'){
          Swal.fire({
            icon:"warning",
            title:"Please wait a day before reporting again"
          })
        }
        else{
          Swal.fire({
            icon:"error",
            title:"Somthing went wrong"
          })
        
          console.log(result);
        }
      
        closeRep()
    }
  }

    useEffect(()=>{
      socket.on("recivePrivate",(data)=>{
        displayMessage(data)
      })

      socket.on("recivePrivate",(data)=>{
        console.log(data);
      })

      return()=>{
        socket.off("recivePrivate")
      }
    })

    useEffect(()=>{
      scrollToBottom()
    },[msg])

    useEffect(()=>{
      getFriendsDetails()
      joinRoom()
    },[])
    
  return (
    <>
        <div className='vh-100 vw-100 p-0 m-0'>
            <Row className='h-100 w-100 m-0'>
                <Col lg={3} className='m-0 p-0 h-100 profileCol bg-black'>
                    <div className='w-100 h-100 profileCol pt-3 px-2 friends_side'>
                      <div className='d-flex justify-content-center'>
                        <input type="search" className='rounded mb-4 mt-3 px-4 py-4 search_frnds' placeholder='Seach by name ..' 
                        onChange={(e)=>setSearch(e.target.value)}/>
                      </div>

                        {friends?search?friends.filter(item=>item.name.toLowerCase().startsWith(search.toLowerCase())).map(item=>(
                        
                          <Button id='friend-btn' className={`friend_btn d-flex  pt-3 pb-2 rounded mb-2 w-100 text-start border-0 ${activeBtn==item.userId?'text-warning':''}`}
                          onClick={(e)=>getChat(item.userId,e)}>
                            <div className='ms-2  mb-0 mt-0 p-0'>
                                <h5 className='m-0 friend_name'>{item.name}</h5>
                            </div>
                          </Button>

                        ))
                          :
                            friends.map(item=>(
                        
                            <Button id='friend-btn' className={`friend_btn d-flex  pt-3 pb-2 rounded mb-2 w-100 text-start border-0 ${activeBtn==item.userId?'text-warning':''}`}
                            onClick={(e)=>getChat(item.userId,e)}>
                              <div className='ms-2  mb-0 mt-0 p-0'>
                                  <h5 className='m-0 friend_name'>{item.name}</h5>
                              </div>
                            </Button>
  
                          ))

                          
                        :
                        ""
                        }
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
                           </div>
                        </div>

                        <div id='chatDisplayDiv' className='h-100 text-light chatDisplayDiv pe-3 pb-1'>
                            {msg?.length>0?msg.map((data)=>(
                                <div onClick={()=>showRepModal(data.client,data.message)} className={data.sent?"msgContainer1":"msgContainer"}>
                                    {data.message}
                                </div>
                            ))
                              :<div className='text-center' style={{fontFamily:`Kalam`,fontSize:'20px'}}>{friends.length>0?"Click on a Friend to start chat":"You have no Friends currently"}</div>
                            }
                            <div className='' ref={markerRef}></div>
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
          <Offcanvas.Body className='p-0 m-0 position-relative pt-5 bg-black'>
               <div className='w-100 h-100 bg-black pt-3 px-2 friends_side'>
                      <div>
                        <input type="search" className='rounded mb-4 mt-3 px-4 py-4 search_frnds' placeholder='Seach by name ..' 
                        onChange={(e)=>setSearch(e.target.value)}/>
                      </div>

                        {friends?search?friends.filter(item=>item.name.toLowerCase().startsWith(search.toLowerCase())).map(item=>(
                        
                          <Button id='friend-btn' className={`friend_btn d-flex  pt-3 pb-2 rounded mb-2 w-100 text-start border-0 ${activeBtn==item.userId?'text-warning':''}`}
                          onClick={(e)=>getChat(item.userId,e)}>
                            <div className='ms-2  mb-0 mt-0 p-0'>
                                <h5 className='m-0 friend_name'>{item.name}</h5>
                            </div>
                          </Button>

                        ))
                          :
                            friends.map(item=>(
                        
                            <Button id='friend-btn' className={`friend_btn d-flex  pt-3 pb-2 rounded mb-2 w-100 text-start border-0 ${activeBtn==item.userId?'text-warning':''}`}
                            onClick={(e)=>getChat(item.userId,e)}>
                              <div className='ms-2  mb-0 mt-0 p-0'>
                                  <h5 className='m-0 friend_name'>{item.name}</h5>
                              </div>
                            </Button>
  
                          ))

                          
                        :
                        ""
                        }
               </div>
              <Button variant='outline-danger' className='toggle-close' onClick={handleClose}><i className="fa-solid fa-xmark"></i></Button>
          </Offcanvas.Body>
        </Offcanvas>

        <Modal show={showRep} onHide={closeRep} centered>
        <Modal.Body className='rounded' style={{backgroundColor:'#060f3f'}}>

            <div className='px-2 py-4 d-flex flex-column align-items-center'>
                <div>
                  <h4 className='text-light'>do you want to proceed ?</h4>
                </div>
                <div className='mt-3'>
                  <Button className='btn-danger' onClick={reportMessage}>Report</Button>
                  <Button className='ms-3 btn-warning' onClick={closeRep}>Cancel</Button>
                </div>
            </div>
            
        </Modal.Body>
        </Modal>
    </>
  )
}

export default Friends