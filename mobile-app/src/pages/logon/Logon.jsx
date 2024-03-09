import { useContext, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom";
import './Logon.scss'
import DB from '../../common functions/Database'
import { UserDataContext } from '../../contexts/UserDataContext';
import { MenuItemsContext } from '../../contexts/MenuItemsContext';

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
    const { setUserData } = useContext(UserDataContext);
    const { setMenuItems } = useContext(MenuItemsContext);
    const navigate = useNavigate();
    const emailRef = useRef();
    const passwordRef = useRef();

    async function sendLogInRequest(){
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        const data = {
            email: email,
            password: password
        }

        try{
            const response = await fetch(SERVER_ADDRESS + "/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
            
            if (response.status < 200 || response.status > 299) {
                // If the response status is not in the range 200-299
                console.log(`Error getting user from the database. Status: ${response.status}`);
            } else {
                console.log("User details retreived");

                const result = await response.json();
                setUserData(result[0]);

                const availMenuItems = await DB.getAvailableMenuItems();
                setMenuItems(availMenuItems);
                
                navigate("/profile");
            }
        }catch (error){
            // Network error or other exceptions
            console.error("Error making the API request:", error);
        }

        resetFields();
    }

    function resetFields() {
        emailRef.current.value = "";
        passwordRef.current.value = "";
    }

    return(
        <div className="internalContainer">
            <div className="title">
                <span className='big'>Welcome Back</span>
                <span className='small'>Sign in to continue</span>
            </div>
            <div className="form">
                <input type="text" placeholder='Email' ref={emailRef}/>
                <input type="password" placeholder='Password' ref={passwordRef}/>

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
                <div className="button" onClick={sendLogInRequest}>
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

    async function sendSignUpRequest(){
        const name = nameRef.current.value;
        const email = emailRef.current.value;
        const password = passRef.current.value.trim();
        const confirm = confirmRef.current.value.trim();
        if(password !== confirm || invalidPassword(password)) return;

        const data = {
            name: name,
            email: email,
            address: '',
            contact: '',
            password: password
        }
        
        try{
            const response = await fetch(SERVER_ADDRESS + "/user/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (response.status < 200 || response.status > 299) {
                // If the response status is not in the range 200-299
                console.log(`Error adding user inside the database. Status: ${response.status}`);
            } else {
                console.log("User added successfully");
            }
        }catch (error){
            // Network error or other exceptions
            console.error("Error making the API request:", error);
        }

        resetFields();
    }

    function invalidPassword(password){
        return password.length < 5
    }

    function resetFields(){
        nameRef.current.value = "";
        emailRef.current.value = "";
        passRef.current.value = "";
        confirmRef.current.value = "";
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