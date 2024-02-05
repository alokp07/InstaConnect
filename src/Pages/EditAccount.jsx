import React, { useEffect, useState } from 'react'
import Button  from 'react-bootstrap/Button'
import { getUserDetailsAPI, updateUserDetailsAPI } from '../api/api';
import Swal from 'sweetalert2';

function EditAccount() {

    const [account,setAccount] = useState([])

  const getAccountDetilas = async()=>{
        const userId = localStorage.getItem('existingUser');
        const data = {
            userId
        }
        const result = await getUserDetailsAPI(data)
        setAccount(result.data)
  }

  const handleUpdate = async()=>{
    const {name,email,password} = account;

    if(name=="" || email=="" || password==""){
        alert("Can't contain empty fields")
    }
    else{
      const id = localStorage.getItem('existingUser');

        const data = {
          id,
          name,
          email,
          password
        }

        const result = await updateUserDetailsAPI(data)

        Swal.fire({
          title: 'Success!',
          text: 'User details updated successfully',
          icon: 'success',
          confirmButtonText: 'Ok'
        })
        
        getAccountDetilas()
    }
  }

  useEffect(()=>{
    getAccountDetilas()
  },[])


  return (
    <div className='vh-100 vw-100 p-0 m-0 d-flex justify-content-center align-items-center flex-column editRoot'>
        <h2 className='editH2'>Account Details</h2>
        <div className='d-flex flex-column align-items-center'>
            <input type="text" placeholder='username' 
            value={account.name || ''} onChange={(e)=>setAccount({...account,name:e.target.value})}/>
            <input type="text" placeholder='email' 
            value={account.email || ''} onChange={(e)=>setAccount({...account,email:e.target.value})}/>
            <input type="password" placeholder='password' 
            value={account.password || ''} onChange={(e)=>setAccount({...account,password:e.target.value})}/>
            <div className='mt-2'>
                <Button variant='r-btn btn' className='me-3'
                onClick={getAccountDetilas}>Reset</Button>
                <Button variant='u-btn btn'
                onClick={handleUpdate}>Update</Button>
            </div>
        </div>
    </div>
  )
}

export default EditAccount