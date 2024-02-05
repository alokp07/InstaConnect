import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { getFriendsDetailsAPI, removeFriendsAPI } from '../api/api'
import Swal from 'sweetalert2'

function ManageFriends() {

    const [friends,setFriends] = useState([])
    const [search,setSearch] = useState("")

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

    const removeFriend = async(friendId)=>{

        const userId = localStorage.getItem('existingUser')
        const data = {
            userId,
            friendId
        }
        const result = await removeFriendsAPI(data)

        if(result.status==200){
            Swal.fire({
                title: 'Success!',
                text: 'User has successfully removed from your friend list',
                icon: 'success',
                confirmButtonText: 'Ok'
              })
    
            getFriendsDetails()
        }
    }

    useEffect(()=>{
        getFriendsDetails()
    },[])
  return (
    <div className='vh-100 vw-100 p-0 m-0 d-flex align-items-center flex-column mFriendsRoot'>

        <input type="text" placeholder='Search here...' className='mt-5 mb-4'
        onChange={(e)=>setSearch(e.target.value)}/>

        {
            friends?search?friends.filter(item=>item.name.toLowerCase().startsWith(search.toLowerCase())).map(data=>(
                <div className='mFriends mt-3 d-flex align-items-center justify-content-between position-relative'>
                    <h2 className='m-0 ms-4 py-4'>{data.name}</h2>
                    <Button className='btn me-2'>Unfollow</Button>
                </div>
            ))
            :
            friends.map(item=>(
                <div className='mFriends mt-3 d-flex align-items-center justify-content-between position-relative'>
                    <h2 className='m-0 ms-4 py-4'>{item.name}</h2>
                    <Button className='btn me-2'
                    onClick={(e)=>removeFriend(item.userId)}>Unfollow</Button>
                </div>
            ))
            :
            ""
        }

        {
            friends?.length>0?
            ""  :
            <h2 className='text-light mt-5' style={{fontFamily:'Kalam'}}>You have Currently no Friends</h2>
        }
        
    </div>
  )
}

export default ManageFriends