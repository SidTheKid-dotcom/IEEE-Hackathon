
// import Model from './components/Model';
import Finalb from './bulba/Finalb.jsx';
import FinalS from './squirtle/FinalS.jsx'
import FinalC from './charlizard/Finalc.jsx';
import Finalp from './pikachu/Finalp.jsx';
import * as Sentry from '@sentry/react';
import Chatting from './gemi/chating/Chatting.jsx';
import gsap from 'gsap';
import { useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import Context from './gemi/context.jsx';
// import Pokeball from './pokeball/Pokeball.jsx';
import { div } from 'three/examples/jsm/nodes/Nodes.js';
import DO from './ash1/Do.jsx';

// import { div } from 'three/examples/jsm/nodes/Nodes.js';
const BuddyPokemon = () => {

  const [forstat, setforstat] = useState(false);
  const [cont, setCont] = useState(true);
  const [counter, setcounter] = useState(0);
  // const [nfo, setinfo] = useState(false) 
  const [dine, setdine] = useState(false)
  const [choose, setchoose] = useState(true)


  const [currentComponent, setCurrentComponent] = useState('FinalC');
  // gsapfromTo('.jj',{opacity:0,translateY:200},{opacity:1,translateY:0})
  var tl = gsap.timeline();
  useEffect(() => {
  
    gsap.fromTo(".bone", { translateX: -50, opacity: 0 }, { duration: 4, ease: "elastic", translateX: 0, opacity: 1 })
    gsap.to('.please',{translateX:0,opacity:1,delay:1,stagger:0.4})
    // .to('.please',{opacity:0,translateX:200},{opacity:1,translateX:0,duration:1,})
    // gsap.fromTo('.bone',{opacity:0,translateX:-20,scale:0},{scale:1,opacity:1,translateY:0,delay:1.5,stagger:0.2,translateX:0})
    gsap.fromTo('.final', { opacity: 0, translateX: 20 }, { opacity: 1, delay: 2, stagger: 0.2, ease: "powerin.out", translateX: 0 })
    // gsap.fromTo('.chatter',{opacity:0,rotateX:0},{opacity:1,rotateX:360})



    return () => {

    }
  }, [cont])

  useEffect(() => {
    tl.fromTo('.choosing',{translateX:-20,opacity:0},{translateX:0,opacity:1,duration:2})
  

  
    return () => {
      
    }
  }, [choose])
  
 



  const switchComponent = (component) => {
    setCurrentComponent(component);
  };

  // Render the selected component
  const renderComponent = () => {
    switch (currentComponent) {
      case 'Finalb':
        return <Finalb />;
      case 'FinalS':
        return <FinalS />;
      case 'FinalC':
        return <Finalp/>;
      case 'Finalp':
        return <FinalC/>;
      default:
        return <Finalp/>;
    }
  };



  return (

    <Context className=" max-h-screen max-w-auto overflow-hidden ">
      <div className='flex flex-row w-full   '>
        <Chatting className="chatter" />
        <div className="please bg-slate-800 flex overflow-hidden flex-nowrap w-1/2 roller  ">
          {renderComponent()}
        </div>

        <div className='right w-1/2 z-10 bg-slate-200'>
          <DO/>
          <button className='fin absolute bottom-28 z-50 right-24 rounded-full   max-h-20 max-w-20' onClick={() => { setdine((prev) => !prev) }}><img src='/public/assets/images/Pokeball.png' alt="" className=' h-full w-full' /> </button>
          {/* <div className='text-wrap text-teal-500 absolute right-24 bottom-56 bg-neutral-700 rounded-3xl text-center items-center'><h1>My stats</h1><ul><li>type:fire</li><li>type:attacking,fighter</li><li>text</li></ul></div> */}
        </div>
      </div>
      {choose?
      <div className="mt-[1.75rem] button-container flex gap-6 items-center p-2 text-red-700 absolute top-40 z-10 left-9 justify-center max-sm:max-w-36 overflow-hidden ">
        <button onClick={() => { switchComponent('Finalb'); setCont((prev) => !prev) }} className=' bone1 bone  rounded-full max-h-10 max-w-10 md:min-w-4 md:min-h-4 max-sm:max-w-5 max-sm:max-h-5' > <img src='/grasstype.PNG' alt="" className=' h-full w-full' /></button>
        <button onClick={() => { switchComponent('FinalS'); setCont((prev) => !prev) }} className=' bone2 bone  rounded-full max-h-10 max-w-10 ' ><img src='/watertype.PNG' alt="" className=' h-full w-full' /></button>
        <button onClick={() => { switchComponent('FinalC'); setCont((prev) => !prev) }} className=' bone3 bone  rounded-full  max-h-10 max-w-10' ><img src='/electrictype.PNG' alt="" className=' h-full w-full' /></button>
        <button onClick={() => { switchComponent('Finalp'); setCont((prev) => !prev) }} className=' bone4 bone  rounded-full max-h-10 max-w-10 ' ><img src='/firetype.PNG' alt="" className=' h-full w-full' /></button>
        <button onClick={() => {  setchoose((prev) => !prev) }} className=' bone4 bone  rounded-full p-2 bg-gray-200 text-black' >choose me</button>
        {/* <button className='fin absolute bottom-28 z-50 right-24 rounded-full   max-h-20 max-w-20' onClick={() => { setdine((prev) => !prev) }}><img src='/public/assets/images/Pokeball.png' alt="" className=' h-full w-full' /> </button> */}
      </div>:
      <div className=' choosing text-4xl text-gray-400 absolute top-40 z-10 left-9 justify-center p-2 mt-[1.75rem] pl-[1.75rem] '>Thank you for choosing me as your pokemon</div>
      }


    </Context>
  )
}

export default BuddyPokemon;
