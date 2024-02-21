import { useState } from 'react'
import './Logon.scss'

export default function Logon(){
    const [page, setPage] = useState("login")
    return(
        <div id="logonConatiner">
            <div className="title">
                Restro
            </div>
            {
                page === "login" ?
                <Login /> :
                <Signup />
            }
            {
                page === "login" ? 
                <div className="links">
                    New user? <span onClick={() => setPage("sign up")}>Sign Up!</span>
                </div>:
                <div className="links">
                    Already registered? <span onClick={() => setPage("login")}>Log In!</span>
                </div>
            }
        </div>
    )
}

function Login(){
    return(
        <div id="loginContainer">
            Login
        </div>
    )
}

function Signup(){
    return(
        <div id="signupContainer">
            Sign up
        </div>
    )
}