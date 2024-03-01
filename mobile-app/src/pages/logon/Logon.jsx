import { useRef, useState } from 'react'
import './Logon.scss'

// load environment variables from .env file
const SERVER_ADDRESS = process.env.REACT_APP_SERVER_ADDRESS;

export default function Logon(){
    const [page, setPage] = useState("login")

    function togglepage(){
        setPage(prev => {
            return prev === "login" ? "signup" : "login"
        });
    }

    return(
        <div id="logonConatiner">
            {
                page === "login" ?
                <Login handleToggle={togglepage} /> :
                <Signup handleToggle={togglepage} />
            }
        </div>
    )
}

function Login(props){
    return(
        <div className="internalContainer">
            <div className="title">
                <span className='big'>Welcome Back</span>
                <span className='small'>Sign in to continue</span>
            </div>
            <div className="form">
                <input type="text" placeholder='Email'/>
                <input type="password" placeholder='Password'/>

                <div className="linkContainer">
                    <div className="link">
                        Forgot Password?
                    </div>
                </div>
                <div className="footer">
                    Create new account?
                    <div 
                        className="link"
                        onClick={props.handleToggle}
                    >
                        Sign Up
                    </div>
                </div>
                <div className="button">
                    Sign In
                </div>
            </div>
        </div>
    )
}

function Signup(props){
    const nameRef = useRef();
    const emailRef = useRef();
    const passRef = useRef();
    const confirmRef = useRef();

    function sendSignUpRequest(){
        const name = nameRef.current.value;
        const email = emailRef.current.value;
        const password = passRef.current.value;
        const confirm = confirmRef.current.value;

        console.log(name)
        console.log(email)
        console.log(password)
        console.log(confirm)
        console.log(SERVER_ADDRESS)
    }

    return(
        <div className="internalContainer">
            <div className="title">
                <span className='big'>Welcome User</span>
                <span className='small'>Sign up to join</span>
            </div>
            <div className="form">
                <input type="text" placeholder='Enter your Name' ref={nameRef}/>
                <input type="text" placeholder='Enter your Email' ref={emailRef}/>
                <input type="password" placeholder='Enter a Password' ref={passRef}/>
                <input type="password" placeholder='Confirm Password' ref={confirmRef}/>

                <div className="footer">
                    Have an account?
                    <div 
                        className="link"
                        onClick={props.handleToggle}
                    >
                        Sign In
                    </div>
                </div>
                <div className="button" onClick={sendSignUpRequest}>
                    Sign Up
                </div>
            </div>
        </div>
    )
}