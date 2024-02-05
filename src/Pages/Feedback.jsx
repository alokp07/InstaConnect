import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import { banUserAPI, newEmailAPI } from '../api/api';
import Swal from 'sweetalert2'

function Feedback() {

  const location = useLocation()
  const [user,setUser] = useState(location.state)

  const [tab,setTab] = useState('user')

  const [report,setReport] = useState({
    title:"",
    description:""
  })

  const handleSubmit = async()=>{
      const {title,description} = report;
      if(title == "" || description==""){
          Swal.fire({
            icon:"warning",
            title:"Please fill the form"
          })
      }
      else{
        const data = {
          userId:user.data,
          data:report
        }
        const result = await newEmailAPI(data)
        console.log(result);
  
        if(result.status=="200"){
            Swal.fire({
              icon:"success",
              title:"Submitted successfully"
            })
            clearForm()
        }
      }
  }

  const handleBan = async()=>{
    const {title,description} = report;

    if(title=="" || description==""){
      Swal.fire({
        icon:"warning",
        title:"Please fill the form"
      })
    }
    else{
      const data = {
        user:user.data,
        cause:report
      }

      const result = await banUserAPI(data)

      if(result.status=="200"){
        Swal.fire({
          icon:"success",
          title:"User has been banned"
        })
      }
      else{
        Swal.fire({
          icon:"error",
          title:"Somthing went wrong try again"
        })
      }

      clearForm()

      console.log(data);
    }
  }

  const clearForm = ()=>{
    setReport({
      title:"",
      description:""
    })
  }

  return (
    <div className='vh-100 w-100 m-0 p-0 adminRoot d-flex flex-column align-items-center pt-3'>

            <div className='w-100 d-flex justify-content-center adminTabsDiv mb-4'>
                <ul className="nav nav-underline">
                    <li className="nav-item">
                      <a className={tab=='user'?"nav-link active":"nav-link"} aria-current="page" href="#" onClick={()=>setTab('user')}>Feedback</a>
                    </li>
                    <li className="nav-item">
                      <a className={tab=='bug'?"nav-link active":"nav-link"} href="#" onClick={()=>setTab('bug')}>Ban User</a>
                    </li>
                </ul>
            </div>


          {
            tab=="user"?
            <div className='w-100 p-0 m-0 d-flex align-items-center flex-column tabContent'>
            <div className='mt-1 d-flex justify-content-center reportDiv'>
                  <div className='d-flex flex-column'>
                      <input type="text" placeholder='Title' value={report.title} 
                      onChange={(e)=>setReport({...report,title:e.target.value})}/>
                      <textarea name="" id="" cols="30" rows="8" className='mt-3' placeholder='Type here...' value={report.description}
                      onChange={(e)=>setReport({...report,description:e.target.value})}></textarea>
                      <div className='d-flex justify-content-end w-100'>
                          <Button className='btn mt-4' onClick={handleSubmit}>Submit</Button>
                      </div>
                     
                  </div>
            </div>
          </div>

          :

          <div className='w-100 p-0 m-0 d-flex align-items-center flex-column tabContent'>
            <div className='mt-1 d-flex justify-content-center reportDiv'>
                  <div className='d-flex flex-column'>
                      <input type="text" placeholder='Title' value={report.title} 
                      onChange={(e)=>setReport({...report,title:e.target.value})}/>
                      <textarea name="" id="" cols="30" rows="8" className='mt-3' placeholder='Type here...' value={report.description}
                      onChange={(e)=>setReport({...report,description:e.target.value})}></textarea>
                      <div className='d-flex justify-content-end w-100'>
                          <Button className='btn mt-4' onClick={handleBan}>Ban user</Button>
                      </div>
                     
                  </div>
            </div>
          </div>

          
          }
    </div>
  )
}

export default Feedback