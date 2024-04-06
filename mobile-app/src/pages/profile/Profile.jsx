import './Profile.scss'
import Footer from '../footer/Footer';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { UserDataContext } from '../../contexts/UserDataContext';

// load environment variables from .env file
const SERVER_ADDRESS = process.env.REACT_APP_SERVER_ADDRESS;
const LOCAL_STORAGE_ALIAS = process.env.REACT_APP_LOCAL_STORAGE_ALIAS;

export default function Profile(){
    const [editTitle, setEditTitle] = useState("field");
    const [showEditToggle, setShowEditToggle] = useState(false);
    const [orders, setOrders] = useState([]);

    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState({});

    const { userData, setUserData} = useContext(UserDataContext);
    const editFieldRef = useRef();

    const getUserOrders = useCallback(async () => {
        try {
            const tempStorage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ALIAS));
            const storageUsers = tempStorage.users;
            const accessToken = storageUsers.filter(user => user.id === userData.id)[0].accessToken

            const data = {
                user_id: userData.id
            }

            const response = await fetch(SERVER_ADDRESS + "/order/all-user-orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify(data),
            })
    
            if (response.status < 200 || response.status > 299) {
                console.log(`Error getting user orders data from the database. Status: ${response.status}`);
            } else {
                console.log("User order data retrieved successfully");
                const result = await response.json();
                setOrders(result);
            }
        } catch (error) {
            // Network error or other exceptions
            console.error("Error making the API request:", error);
        }
    }, [userData.id]);

    useEffect(() => {
        getUserOrders();
    }, [getUserOrders])

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

    async function cancelOrder(orderId) {
        const data = {
            id: orderId
        }

        try {
            const tempStorage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ALIAS));
            const storageUsers = tempStorage.users;
            const accessToken = storageUsers.filter(user => user.id === userData.id)[0].accessToken;

            const response = await fetch(SERVER_ADDRESS + "/order/user-order", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify(data),
            });
            
            if (response.status < 200 || response.status > 299) {
                // If the response status is not in the range 200-299
                console.log(`Error deleting order from the database. Status: ${response.status}`);
            } else {
                console.log("Order deleted.");
                getUserOrders();
            }
        } catch (error) {
            // Network error or other exceptions
            console.error("Error making the API request:", error);
        }
    }

    async function displayDetails(orderId) {
        const data = {
            id: orderId
        }

        try {
            const tempStorage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ALIAS));
            const storageUsers = tempStorage.users;
            const accessToken = storageUsers.filter(user => user.id === userData.id)[0].accessToken;

            const response = await fetch(SERVER_ADDRESS + "/order/user-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify(data),
            });
            
            if (response.status < 200 || response.status > 299) {
                // If the response status is not in the range 200-299
                console.log(`Error getting order data from the database. Status: ${response.status}`);
            } else {
                console.log("Order data retrieved.");

                setSelectedOrderDetails(await response.json());
                setShowOrderDetails(true);
            }
        } catch (error) {
            // Network error or other exceptions
            console.error("Error making the API request:", error);
        }
    }

    function closeDisplayDetails() {
        setShowOrderDetails(false);
    }

    const editFormClassName = showEditToggle ? "active" : "";
    const orderDetailsDisplayClassName = showOrderDetails ? "active" : "";
    console.log(orders);

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

            <ul id="profileOrders">
                <li id='profileOrdersTitle'>My Orders</li>
                {
                    orders?.map((item, index) => {
                        return (
                            <li className="profileOrderItem" key={index}>
                                <div className="profileOrderItem-header">
                                    <div className="profileOrderItem-title">
                                        ORID{item.id}
                                        <i className="fa-solid fa-circle-info" onClick={() => displayDetails(item.id)}></i>
                                    </div>
                                    <i className="fa-solid fa-ban" onClick={() => cancelOrder(item.id)}></i>
                                </div>
                                <div className="profileOrderItem-cell">
                                    <span className="profileOrderItem-bold">Status</span>
                                    <span>{item.status}</span>
                                </div>
                                <div className="profileOrderItem-cell">
                                    <span className="profileOrderItem-bold">Total</span>
                                    <span>{item.total}</span>
                                </div>
                                <div className="profileOrderItem-cell">
                                    <span className="profileOrderItem-bold">Date</span>
                                    <span>{item.date.split("T")[0]}</span>
                                </div>
                                <div className="profileOrderItem-cell">
                                    <span className="profileOrderItem-bold">Time</span>
                                    <span>{item.time}</span>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>

            <div id="profileEditForm" className={editFormClassName}>
                <div id="profileEditTitle">Edit Details</div>
                <textarea name="profileEditInput" cols="30" rows="10" placeholder={`Enter the new ${editTitle}`} ref={editFieldRef}></textarea>
                
                <div id="profileEditButtons">
                    <div className="profileEditButton" onClick={makeChangesToData}>Save</div>
                    <div className="profileEditButton" onClick={closeEditForm}>Close</div>
                </div>
            </div>

            <div id="orderDetailsDisplay" className={orderDetailsDisplayClassName}>
                <div id="orderDetailsDisplayTitle">Order Details</div>
                <div className="orderDetailsDisplay-text">
                    <span className="bold">
                        Order ID:
                    </span>
                    <span>
                        ORID{selectedOrderDetails.id}
                    </span>
                </div>
                <div className="orderDetailsDisplay-text">
                    <span className="bold">
                        Status:
                    </span>
                    <span>
                        {selectedOrderDetails.status}
                    </span>
                </div>
                <div className="orderDetailsDisplay-text">
                    <span className="bold">
                        Address:
                    </span>
                    <span>
                        {selectedOrderDetails.address}
                    </span>
                </div>
                <div className="orderDetailsDisplay-text">
                    <span className="bold">
                        Contact:
                    </span>
                    <span>
                        {selectedOrderDetails.delivery_contact}
                    </span>
                </div>

                <div id="orderDetailsButton" onClick={closeDisplayDetails}>
                    Close
                </div>
            </div>

            <Footer tab="profile" />
        </div>
    )
}