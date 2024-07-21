import React, { useEffect } from 'react'
import{useContext} from 'react'
import './Chatting.css'
import gsap from 'gsap'
import Context, { refcontext } from '../context.jsx'
import { useGSAP } from '@gsap/react'



const Chatting = () => {
 

  const{ onto,loadi,
    setcurrenti,
    setloadi,
    setloading,currenti,loading,result,setresult,setshowresult,
    showresult
  } = useContext(refcontext)
  useGSAP(() => {
  
    gsap.fromTo('.final', {opacity: 0,translateX:20},{opacity:1,delay:2,stagger:1,ease: "powerin.out",translateX:0})
   
  gsap.fromTo('.done',{opacity:0,rotateZ:0},{opacity:1,delay:1,stagger:1,rotateZ:360,})
  }, []);
  var tl=gsap.timeline()
useEffect(() => {
  tl.fromTo('#none', {opacity:0,translateY:-50,scaleX:0,translateX:20},{opacity:1,translateY:0,scaleX:1,translateX:0})
  return () => {
    
  }
}, [showresult])

  
  return (
   <Context>

    <div>
      <div>

      <div className='done  absolute  max-h-60 max-w-60 min-w-60 min-h-60 border-pink-30  rounded-full  items-center  flex flex-col justify-center  gap-4 text-red z-20 md-w-40'  >
        
        <div className="final" ><h1 className=' font-bold text-5xl  text-slate-800'>Hi!</h1>
        <h6>Buddy How are you?</h6></div>
        <div className='final flex gap-3 flex-col '>
          <input type="text" className='ban flex rounded-full p-2 text-black shadow-slate-600 shadow-2xl'placeholder='Wanna talk' onChange={(e)=>{setloadi(e.target.value); setcurrenti(e.target.value+"Keep the answer short in about 3 lines.Talk to me like you are my pokemon and not like an ai.Don't behave like any specific pokemon just a general pokemon and don't reply to last 2 statements just include it in giving answers to all previous statments.Don't behave like any specific pokemon")}}  value={loadi} />
        <button className='shadow-xl ban rounded-full h-7' onClick={()=>{onto(),setloading((prev)=!prev)}}>Send</button>
        </div>
      </div>
      <div className='flex flex-col justify-center items-center absolute p-1 top-3/4 right-3/4 text-red-950 rounded-3xl text-center z-20 bg-white formElement ' id='none' >{result}

        {/* <div  className='relative top-32' >output</div> */}
      </div>
      </div>
    
    </div>
   </Context>
  )
}

export default Chatting