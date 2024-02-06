import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { getBugAPI, getUserReportAPI, removeBugAPI } from '../api/api';
import { Modal } from 'react-bootstrap';
import {useNavigate} from 'react-router-dom'
function AdminPanel() {

    const [tab,setTab] = useState('user')
    const [show,setShow] = useState(false)
    

    const [bug,setBug] = useState([])
    const [report,setReport] = useState([])

    const navigate = useNavigate()

    const [modelContent,setModelContent] = useState({
        index:"",
        title:"",
        description:''
    })

    const handleShow = (item,index) =>{

        setModelContent({
            index,
            title:item.title,
            description:item.description
        })

         setShow(true) 
    }

    const handleClose = () =>{
        setModelContent({
            index:"",
            title:"",
            description:""
        })
        
        setShow(false);
    }

    const getReport = async()=>{
        const result = await getUserReportAPI()
        setReport(result.data)
    }


    const getBug = async()=>{
        const result = await getBugAPI()
        setBug(result.data)
    }

    const deleteBug = async(index)=>{
        const data = {
            index
        }
        await removeBugAPI(data)
        getBug()
        handleClose()
    }

    const handleFeedback = (data)=>{
        navigate('/settings/admin/feedback',{state:{data}})
    }

    useEffect(()=>{
        getBug()
        getReport()
    },[])
    
  return (
    <>
        <div className='adminRoot vh-100 w-100 p-0 m-0 pt-4 overflow-auto'>
            <div className='w-100 d-flex justify-content-center adminTabsDiv'>
                <ul className="nav nav-underline">
                    <li className="nav-item">
                      <a className={tab=='user'?"nav-link active":"nav-link"} aria-current="page" href="#" onClick={()=>setTab('user')}>User Reports</a>
                    </li>
                    <li className="nav-item">
                      <a className={tab=='bug'?"nav-link active":"nav-link"} href="#" onClick={()=>setTab('bug')}>Bug Reports</a>
                    </li>
                </ul>
            </div>
    
            <div className='w-100 mt-5 p-0 m-0 d-flex align-items-center flex-column tabContent'>
    
                {
                    tab=="user"?
    
                        <>
                            {report?.length>0?report.sort((a,b)=>b.reports.length - a.reports.length).map(item=>(
                                 <div className='mFriends mt-3 d-flex align-items-center justify-content-between position-relative'>
                                    <h2 className='m-0 ms-4 py-4'>{`User  ${item.user}`}</h2>
                                    <Button className='btn me-1' onClick={()=>handleFeedback(item.user)}>{`${item.reports.length} Reports`}</Button>
                                 </div>
                                ))
                               
                                :
                                <div className='mFriends mt-3 d-flex align-items-center justify-content-between position-relative'>
                                    <h2 className='m-0 ms-4 py-4'>No reports currently</h2>
                                </div>

                            }
                        </>
    
                    :
    
                    <>
                        {
                            bug?.length>0?bug.map((item,index)=>(
                                <div className='mFriends mt-3 d-flex align-items-center justify-content-between position-relative'>
                                    <h2 className='m-0 ms-4 py-4'>{item.title}</h2>
                                    <Button className='btn me-4' onClick={(e)=>handleShow(item,index)}>Details</Button>
                                </div>
                            ))
                            :
                            <div className='mFriends mt-3 d-flex align-items-center justify-content-between position-relative'>
                                <h2 className='m-0 ms-4 py-4'>No reports currently</h2>
                            </div>
                        }
                    </>
    
                }
    
            </div>
    
    
        </div>

        
        <Modal show={show} onHide={handleClose} centered>
        <Modal.Body className='reportModel rounded' style={{backgroundColor:'#060f3f'}}>

            <div className='px-2 py-4'>
                <div className='d-flex'>
                    <p>Title :</p>
                    <p className='ms-2'>{modelContent.title}</p>
                </div>
                <div>
                    <p className='word-break'>
                        {modelContent.description}
                    </p>
                </div>
                <div className='mt-4'>
                    <Button className='btn me-2 btn-danger' onClick={()=>deleteBug(modelContent.index)}>Delete</Button>
                    <Button className='btn' onClick={handleClose}>Close</Button>
                </div>
            </div>
            
        </Modal.Body>
        </Modal>
    </>
  )
}

export default AdminPanel