import React from 'react'

function AboutUs() {
  return (
    <div className='about-Root vh-100 w-100 m-0 p-0 d-flex flex-column align-items-center'>
      <div className='pt-4'>
        <h1 className='text-light text-center'>About <span className='text-danger'>InstaConnect</span></h1>
      </div>

      <div className='w-75 mt-4 text-light fs-5'>
          <p>
          Welcome to InstaConnect, where strangers become friends in an instant! InstaConnect is an innovative chat application designed to bring people together in a safe and friendly online environment. Similar to platforms like Omegle, InstaConnect allows users to connect with random strangers for private conversations. However, what sets us apart is our unique feature that enables users to turn those chance encounters into lasting friendships.
          </p> 
      </div>

      <div className='mt-4'>
        <h2 className='text-warning'>Our Mission</h2>
      </div>

      <div className='w-75 mt-4 text-light fs-5'>
          <p>
          At InstaConnect, our mission is simple: to foster genuine connections between individuals from all walks of life. In a world where digital interactions often feel fleeting, we aim to create meaningful relationships that transcend the virtual realm. Whether you're looking for a casual chat buddy or a lifelong friend, InstaConnect is here to facilitate those connections.
          </p> 
      </div>

      <div className='mt-4'>
        <h2 className='text-warning'>Key Features</h2>
      </div>

      <div className='w-75 mt-4 text-light fs-5'>
          <ul>
            <li><span className='text-primary'>Instant Connections</span> : Connect with random strangers for private one-on-one chats</li>
            <li><span className='text-primary'>Friend Requests</span> : Send friend requests to users you connect with, turning them into permanent contacts</li>
            <li><span className='text-primary'>Friend List</span> : Easily manage and navigate your list of friends for seamless communication</li>
            <li><span className='text-primary'>Report Chats</span> : Maintain a safe and respectful community by reporting inappropriate behavior or content</li>
            <li><span className='text-primary'>Admin Controls</span> : Our dedicated admin team ensures a secure and enjoyable experience for all users by enforcing community guidelines and promptly addressing any issues</li>
          </ul>
      </div>

      <div className='mt-4'>
        <h2 className='text-warning'>Our Technology Stack</h2>
      </div>

      <div className='w-75 mt-4 text-light fs-5'>
          <p>
          InstaConnect is built using the powerful MERN stack (MongoDB, Express.js, React.js, Node.js) along with Socket.IO for real-time communication. Leveraging the MVC (Model-View-Controller) architecture, we've created a robust and scalable platform that delivers a smooth user experience.
          </p> 
      </div>

      <div className='mt-4'>
        <h2 className='text-warning'>Meet the Developer</h2>
      </div>

      <div className='w-75 mt-4 text-light fs-5'>
          <p>
          InstaConnect was developed by a solo developer with a passion for creating meaningful connections in the digital world. Drawing from experience in web development and a commitment to innovation, the developer has poured their heart and soul into bringing InstaConnect to life.
          </p> 
      </div>
    </div>
  )
}

export default AboutUs