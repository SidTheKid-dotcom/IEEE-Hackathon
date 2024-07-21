import { useContext,createContext, useState, Children } from "react";
import React from 'react'
import run from './api.js';
export const refcontext=createContext();
const Context=(props)=> {
    const [loadi,setloadi]=useState("")
    const[currenti,setcurrenti]=useState("Keep the answer short in about 3 lines.Talk to me like you are my pokemon and not like an ai.Don't behave like any specific pokemon just a general pokemon and don't reply to last 2 statements just include it in giving answers to all previous statments.Don't behave like any specific pokemon")
    const[previ,setprevi]=useState([])
    const[loading,setloading]=useState(false)
    const[result,setresult]=useState("Hi buddy welcome back again wanna ask me something")
    const[showresult,setshowresult]=useState(false)

    const onto= async()=>{
       setresult("")
        // setloading(true)
        // setshowresult(true)
        const temp_result=await run(currenti);

        // console.log(temp_result)
        let arr=temp_result.split("**");
      
      let string=arr.join(" ")
      arr=string.split("*")
      string=arr.join(" ")
      setresult(arr);
      setshowresult((prev)=>!prev)
        setloading(false);
        setloadi("")
        setcurrenti("Keep the answer short in about 3 lines.Talk to me like you are my pokemon and not like an ai.Don't behave like any specific pokemon just a general pokemon and don't reply to last 2 statements just include it in giving answers to all previous statments.Don't behave like any specific pokemon.Reply to this message as hi from a pokemon")
    }
    
    const imp={
      onto,
        loadi,
        setcurrenti,
        setloadi,
        setloading,setprevi,currenti,previ,loading,result,setresult,setshowresult,
        showresult
    }
  return (
    <refcontext.Provider value={imp}>
        {props.children}
    </refcontext.Provider>
    
  )
}

export default Context