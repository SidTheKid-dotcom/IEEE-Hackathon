import React, { useEffect, useState } from 'react';
import "./Login1.css";
import useSound from 'use-sound';
import soundUrl from '../../assets/loginsound.mp3'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function Login1() {
  const [cu, setcu] = useState(false);
  const [emaillogin, setemaillogin] = useState(true);
  const [current, setCurrent] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const [cheker, setcheker] = useState(false);
  const omg=()=>{
    if(username!='' && username!=null && email!=null && email!='' && password!='' && password!=null){
        setcheker(true);
    }
  }
  const [playbackRate, setPlaybackRate] = React.useState(0.75);
    const [play] = useSound(soundUrl, {
      playbackRate: 1.5,
      volume: 0.5,
      preload: true, // Preload the sound file
      duration: 2000,
    });
 useEffect(() => {return omg();
 }, [password,setPassword,email,setemail,username,setUsername])
 const myfunct=(e)=>{
    if (!cheker) {
        alert("please check if all side filled")
        e.preventDefault
      }
 }


  const clientId = '700551369753-k58b1sehh9p89al907gkjn9usv94mntg.apps.googleusercontent.com'; // Replace with your actual Client ID

  const onSuccess = (response) => {
    console.log('Login Success:', response);
    // Navigate to homepage on successful login
    window.location.href = '/homepage';
  };

  const onFailure = (response) => {
    console.log('Login failed:', response);
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className='mai'>
        <div className='left'></div>
        <div className="right"></div>
        <div className={cu && cheker ? 'onsub' : 'circle'}>
          <div className="content">
            <input
              type="text"
              placeholder='Enter username'
              onChange={(e) => { setUsername(e.target.value) }}
              value={username}
            />
            {emaillogin ? (
              <input
                type='email'
                placeholder='Enter email'
                onChange={(e) => { setemail(e.target.value) }}
                value={email}
                className='temp'
              />
            ) : <div></div>}
            <input
              type='password'
              placeholder='Enter password'
              onChange={(e) => { setPassword(e.target.value) }}
              value={password}
            />
            <input
              type='submit' 
              onClick={(e)=>{myfunct(e); return setcu(prev=>!prev) }}
            />
            <div onClick={() => { setemaillogin(prev => !prev) }} className="login-signup-toggle">
              {emaillogin ? 'Sign Up' : 'Login'}
            </div>
            <div className="google-button-container">
              <GoogleLogin
                onSuccess={onSuccess}
                onError={onFailure}
              />
            </div>
          </div>
          {!current ? <div className="top"></div> : <div className='class'></div>}
          {!current ? <div className="bottom"></div> : <div className='class1'></div>}
          {!current ? (
            <div className='mid' onClick={() =>{play(); setCurrent(prev => !prev)}}>
              {current ? 'Close' : 'Login'}
            </div>
          ) : <div></div>}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Login1;
