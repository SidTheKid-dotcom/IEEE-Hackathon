import { useEffect, useState } from 'react'

import Finalp from './pokeball/Pokeball'
import gsap from 'gsap'
import { useGSAP } from "@gsap/react"

// @ts-ignore
import LoginPage from './Login'


function LoginWrapper() {
  const [count, setCount] = useState(false);
  useGSAP(() => {
    gsap.fromTo('.fine', { translateX: 100, rotateX: 360 }, { translateX: 0, opacity: 1, duration: 3 })
    gsap.fromTo('.confirm',{translateY:1000,scale:0},{translateY:0,duration:3,scale:1.1})
  }, []);
  // useEffect(() => {
  //   gsap.to(".confirm",{translateY:0,duration:1})
  
  //   return () => {
      
  //   }
  // }, [count])
  

  return (
    
    <div className='relative min-h-screen min-w-screen bg-red-400  flex justify-center items-center overflow-hidden'>
      <video 
        src='/public/images/galar-scenery.mp4' 
        autoPlay 
        loop 
        muted 
        playsInline 
        className='absolute top-0 left-0 w-full h-full object-cover'
      />

      <div className="backdrop-blur-sm bg-white/30 min-h-full min-w-full flex  gap-10">
        <div className='fine w-1/2 mt-[-1rem] flex justify-center items-center'>
          <Finalp />
        </div>
        {/* <button onClick={setCount((prev) => !prev)}> SignUp/Loginin</button> */}
        <div className='w-1/2 flex justify-center items-center flex-1'>
        
          <div className='confirm'><LoginPage/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginWrapper
