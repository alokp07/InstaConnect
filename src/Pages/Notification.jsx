import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { getEmailAPI, removeEmailAPI, reportBugAPI } from '../api/api';

function Notification() {

    const [tab,setTab] = useState('not')
    const [show,setShow] = useState(false)
    const handleClose = () =>{
        emptyModal();
        setShow(false);
        getEmail()
    }
    const handleShow = () =>{ setShow(true) }

    const userId = localStorage.getItem("existingUser")

    const [modalContent,setModalContent] = useState({
        index:"",
        title:"",
        description:''
    })

    const viewDetails = (data,index)=>{
        setModalContent({
            index,
            title:data.title,
            description:data.description
        })
        handleShow()
    }

    const deleteEmail = async(item)=>{
        const data = {
            userId,
            index:item
        }
        await removeEmailAPI(data)
        handleClose()
    }

    const [report,setReport] = useState({
        userId,
        title:"",
        description:""
    })

    const [email,setEmail] = useState([])

    const getEmail = async()=>{
        const data = {
            userId
        }

        const result = await getEmailAPI(data)
        setEmail(result.data.notification)
    }

    const handleSubmit = async()=>{
        
        const {title,description} = report;

        if(title=="" || description ==""){
            Swal.fire({
                icon:"warning",
                title:"Please fill the form"
            })
        }
        else{
            const result = await reportBugAPI(report)

        if(result.status=="200"){
            Swal.fire({
                icon:'success',
                title:"Submitted Successfully"
            })
            
            setReport({
                userId,
                title:"",
                description:""
            })

        }
        }
        
    }

    const emptyModal = ()=>{
        setModalContent({
            index:"",
            title:"",
            description:''
        })
    }


    useEffect(()=>{
        getEmail()
    },[])

  return (
    <>
        <div className='adminRoot vh-100 w-100 p-0 m-0 pt-4 overflow-auto'>
            <div className='w-100 d-flex justify-content-center adminTabsDiv'>
                <ul className="nav nav-underline">
                    <li className="nav-item">
                      <a className={tab=='not'?"nav-link active":"nav-link"} aria-current="page" href="#" onClick={()=>setTab('not')}>Notification</a>
                    </li>
                    <li className="nav-item">
                      <a className={tab=='bug'?"nav-link active":"nav-link"} href="#" onClick={()=>setTab('bug')}>Report Bug</a>
                    </li>
                </ul>
            </div>
    
            <div className='w-100 mt-5 p-0 m-0 d-flex align-items-center flex-column tabContent'>
    
                {
                    tab=="not"?
    
                        <>
                           {email?.length>0?email.map((item,index)=>(
                                <div className='mFriends mt-3 d-flex align-items-center justify-content-between position-relative'>
                                    <h2 className='m-0 ms-4 py-4'>{item.title}</h2>
                                    <Button className='btn me-4' onClick={()=>viewDetails(item,index)}>Details</Button>
                                </div>
                           ))
                            
                            :
                            <div className='mFriends mt-3 d-flex align-items-center justify-content-between position-relative'>
                                <h2 className='m-0 ms-4 py-4'>No new Notifications</h2>
                            </div>
                            }
                        </>
    
                    :
    
                    <div className='mt-1 d-flex justify-content-center reportDiv'>
                        <div className='d-flex flex-column'>
                            <input type="text" placeholder='Title' value={report.title} 
                            onChange={(e)=>setReport({...report,title:e.target.value})}/>
                            <textarea name="" id="" cols="30" rows="8" className='mt-3' placeholder='Type here...' value={report.description}
                            onChange={(e)=>setReport({...report,description:e.target.value})}></textarea>
                            <div className='d-flex justify-content-end w-100'>
                                <Button className='btn mt-4' onClick={handleSubmit}>Report</Button>
                            </div>
                           
                        </div>
                    </div>
    
                }
    
            </div>
    
    
        </div>

        <Modal show={show} onHide={handleClose} centered>
        <Modal.Body className='reportModel rounded' style={{backgroundColor:'#060f3f'}}>

            <div className='px-2 py-4'>
                <div className='d-flex'>
                    <p>Title :</p>
                    <p className='ms-2'>{modalContent.title}</p>
                </div>
                <div>
                    <p>
                        {modalContent.description}
                    </p>
                </div>
                <div>
                    <Button className='btn-danger me-3' onClick={()=>deleteEmail(modalContent.index)}>Delete</Button>
                    <Button className='btn' onClick={handleClose}>Close</Button>
                </div>
            </div>
            
        </Modal.Body>
        </Modal>
    </>
  )
}

export default Notification