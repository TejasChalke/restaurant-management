import './Profile.scss'
import Footer from '../footer/Footer';
import { useContext, useRef, useState } from 'react';
import { UserDataContext } from '../../contexts/UserDataContext';

// load environment variables from .env file
const SERVER_ADDRESS = process.env.REACT_APP_SERVER_ADDRESS;
const LOCAL_STORAGE_ALIAS = process.env.REACT_APP_LOCAL_STORAGE_ALIAS;

export default function Profile(){
    const [editTitle, setEditTitle] = useState("field");
    const [showEditToggle, setShowEditToggle] = useState(false);
    const { userData, setUserData} = useContext(UserDataContext);
    const editFieldRef = useRef();

    async function saveProfileChangesToDatabase(){
        if(!validateData()) {
            console.log("Please check the entered data!");
            return;
        }

        try {
            const tempStorage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ALIAS));
            const storageUsers = tempStorage.users;
            const accessToken = storageUsers.filter(user => user.id === userData.id)[0].accessToken

            const response = await fetch(SERVER_ADDRESS + "/user/update-user", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify(userData),
            })
    
            if (response.status < 200 || response.status > 299) {
                console.log(`Error updating menu values inside the database. Status: ${response.status}`);
            } else {
                console.log("Menu values updated successfully");
            }
        } catch (error) {
            // Network error or other exceptions
            console.error("Error making the API request:", error);
        }
    }

    function validateData(){
        const name = userData.name.trim();
        const contact = userData.contact.trim();
        const email = userData.email.trim();
        const address = userData.address.trim();

        if(address.length < 10) return false;
        if(name.length < 4) return false;
        if(contact.length !== 10) return false;
        
        for(let i=0; i<contact.length; i++){
            if(contact[i] < '0' || contact[i] > '9') return false;
        }
        
        return validateEmail(email);
    }

    function validateEmail(email){
        const atIndex = email.indexOf('@');
        const atLastIndex = email.lastIndexOf('@');
        const dotIndex = email.lastIndexOf('.');

        if(atIndex === -1 || atIndex !== atLastIndex) return false;
        if(atIndex < 4 || dotIndex < atIndex || dotIndex - atIndex < 3) return false;
        return true;
    }

    function makeChangesToData(){
        var temp = {...userData};
        switch (editTitle) {
            case "name":
                temp.name = editFieldRef.current.value;
                break;
            case "contact":
                temp.contact = editFieldRef.current.value;
                break;
            case "email":
                temp.email = editFieldRef.current.value;
                break;
            case "address":
                temp.address = editFieldRef.current.value;
                break;
            default:
                break;
        }

        setUserData(temp);
        closeEditForm();
    }

    function showEditForm(currEditTitle){
        setEditTitle(currEditTitle);
        setShowEditToggle(true);
    }

    function closeEditForm(){
        setEditTitle("");
        setShowEditToggle(false);
        editFieldRef.current.value = "";
    }

    const editFormClassName = showEditToggle ? "active" : "";

    return(
        <div id="profileContainer">
            <div className="tabTitle">
                <div className="big">Profile</div>
            </div>
            <div id="profileForm">
                <div className="profileOption">
                    <div className="profileOption-header">
                        <span>Name</span>
                        <i 
                            className="fa-solid fa-pen"
                            onClick={() => showEditForm("name")}
                        >
                        </i>
                    </div>
                    <div className="info">
                        {userData.name}
                    </div>
                </div>
                <div className="profileOption">
                    <div className="profileOption-header">
                        <span>Contact</span>
                        <i 
                            className="fa-solid fa-pen"
                            onClick={() => showEditForm("contact")}
                        >
                        </i>
                    </div>
                    <div className="info">
                        {userData.contact === "" ? "Please enter a mobile number" : userData.contact}
                    </div>
                </div>
                <div className="profileOption">
                    <div className="profileOption-header">
                        <span>Email</span>
                        <i 
                            className="fa-solid fa-pen"
                            onClick={() => showEditForm("email")}
                        >
                        </i>
                    </div>
                    <div className="info">
                        {userData.email}
                    </div>
                </div>
                <div className="profileOption">
                    <div className="profileOption-header">
                        <span>Address</span>
                        <i 
                            className="fa-solid fa-pen"
                            onClick={() => showEditForm("address")}
                        >
                        </i>
                    </div>
                    <div className="info">
                        {userData.address === "" ? "Please enter an address" : userData.address}
                    </div>
                </div>
                <div className="profileButton" onClick={saveProfileChangesToDatabase}>
                    Save Changes
                </div>
            </div>

            <div id="profileEditForm" className={editFormClassName}>
                <div id="profileEditTitle">Edit Details</div>
                <textarea name="profileEditInput" cols="30" rows="10" placeholder={`Enter the new ${editTitle}`} ref={editFieldRef}></textarea>
                
                <div id="profileEditButtons">
                    <div className="profileEditButton" onClick={makeChangesToData}>Save</div>
                    <div className="profileEditButton" onClick={closeEditForm}>Close</div>
                </div>
            </div>

            <Footer tab="profile" />
        </div>
    )
}