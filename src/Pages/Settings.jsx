import React from 'react'
import { Button } from 'react-bootstrap'
import {Row,Col} from 'react-bootstrap'
import '../Pages/settings.css'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

function Settings() {

    const navigate = useNavigate()

    const validateAdmin = ()=>{
        const adminId = localStorage.getItem('existingUser')
        if(adminId == "65b9e5c6986119a5b25f8802"){
          navigate('/settings/admin')
        }
        else{
          Swal.fire({
            icon:"error",
            title:"You are not authorized to access"
          })
        }
    }

    const handleLogout = ()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('existingUser');

        Swal.fire({
            title: 'Success!',
            text: 'Logout successfull',
            icon: 'success',
            confirmButtonText: 'Ok'
          })

          navigate('/')
    }
  return (
    <div className='vh-100 vw-100 p-0 m-0 settingsRoot'>
        <div className='w-100 h-100 d-flex justify-content-center align-items-center'>
            <Row className='rootRow m-0 p-0'>
                <Row className='w-100 m-0 p-0'>
                  <Col lg={6} className='btnContainer'>
                      <Button className='btn' onClick={validateAdmin}><i className="fa-solid fa-user-tie me-4"></i>Admin Panel</Button>
                  </Col>
                  <Col lg={6} className='btnContainer'>
                      <Link to={'/settings/notification'}><Button className='btn'><i className="fa-solid fa-bell me-4"></i>Notification</Button></Link>
                  </Col>
                </Row>

                <Row className='w-100 m-0 p-0'>
                  <Col lg={6} className='btnContainer'>
                      <Link to={'/settings/manage'}><Button className='btn'><i className="fa-solid fa-wrench me-4"></i>Manage Your Account</Button></Link>
                  </Col>
                  <Col lg={6} className='btnContainer'>
                      <Link to={'/settings/friends'}><Button className='btn'><i className="fa-solid fa-user-group me-4"></i>Manage Friends</Button></Link>
                  </Col>
                </Row>

                <Row className='w-100 m-0 p-0'>
                  <Col lg={6} className='btnContainer'>
                      <Link to={'/settings/about'}><Button className='btn'><i className="fa-solid fa-circle-info me-4"></i>About Us</Button></Link>
                  </Col>
                  <Col lg={6} className='btnContainer'>
                      <Button className='btn' onClick={handleLogout}><i className="fa-solid fa-power-off me-4"></i>Log-out</Button>
                  </Col>
                </Row>
            </Row>
        </div>
    </div>
  )
}

export default Settings