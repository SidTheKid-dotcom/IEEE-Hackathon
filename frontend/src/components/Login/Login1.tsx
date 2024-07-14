import React, { useState } from 'react';
import "./Login1.css";
import { GoogleLogin } from 'react-google-login';


function Login1() {
    const [cu, setcu] = useState(false);
    const [emaillogin, setemaillogin] = useState(true);
    const [current, setCurrent] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setemail] = useState('');
    const [password, setPassword] = useState('');

    const clientId = '700551369753-k58b1sehh9p89al907gkjn9usv94mntg.apps.googleusercontent.com'; // Replace with your actual Client ID

    const onSuccess = (response: any) => {
        console.log('Login Success: currentUser:', response.profileObj);
        //handle success
        
    };

    const onFailure = (response: any) => {
        console.log('Login failed: res:', response);
        // Handle login failure
      
    };

    return (
        <div className='mai'>
            <div className='left'></div>
            <div className="right"></div>
            <div className={cu ? 'onsub' : 'circle'}>
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
                        onClick={() => { setcu(prev => !prev) }}
                    />
                    <div onClick={() => { setemaillogin(prev => !prev) }} className="login-signup-toggle">
                        {emaillogin ? 'Sign Up' : 'Login'}
                    </div>
                    
                    <div className="google-button-container">
                        <GoogleLogin
                            clientId={clientId}
                            buttonText="Sign in with Google"
                            onSuccess={onSuccess}
                            onFailure={onFailure}
                            cookiePolicy={'single_host_origin'}
                        />
                    </div>
                </div>
                {!current ? <div className="top"></div> : <div className='class'></div>}
                {!current ? <div className="bottom"></div> : <div className='class1'></div>}
                {!current ? (
                    <div className='mid' onClick={() => setCurrent(prev => !prev)}>
                        {current ? 'Close' : 'Login'}
                    </div>
                ) : <div></div>}
            </div>
        </div>
    );
}

export default Login1;
