import { useContext, useEffect, useState } from 'react'
import Footer from '../footer/Footer'
import './Cart.scss'
import { UserDataContext } from '../../contexts/UserDataContext';

// load environment variables from .env file
const LOCAL_STORAGE_ALIAS = process.env.REACT_APP_LOCAL_STORAGE_ALIAS;

export default function Cart(){
    const [cartItems, setCartItems] = useState([]);
    const [orderContact, setOrderContact] = useState("");
    const [displayForm, setDisplayForm] = useState(false);
    const { userData } = useContext(UserDataContext);

    useEffect(() => {
        const localStorageData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ALIAS));
        const users = localStorageData.users;
        const currentUser = users.filter((user) => user.id === userData.id)[0];
        
        if(currentUser === undefined || currentUser.cartItems === undefined) setCartItems([]);
        else setCartItems(currentUser.cartItems);
    }, [userData.id])

    function increaseCount(index){
        const localStorageData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ALIAS));
        let users = localStorageData.users, userIndex = 0;

        for (let itr = 0; itr < users.length; itr++) {
            let element = users[itr];
            if(element.id === userData.id){
                userIndex = itr;
                break;
            }
        }

        users[userIndex].cartItems[index].itemQuantity += 1;
        localStorage.setItem(LOCAL_STORAGE_ALIAS, JSON.stringify(localStorageData));
        setCartItems(users[userIndex].cartItems);
    }

    function decreaseCount(index){
        const localStorageData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ALIAS));
        let users = localStorageData.users, userIndex = 0;

        for (let itr = 0; itr < users.length; itr++) {
            let element = users[itr];
            if(element.id === userData.id){
                userIndex = itr;
                break;
            }
        }

        if(users[userIndex].cartItems[index].itemQuantity === 1){
            users[userIndex].cartItems.splice(index, 1);
        }else{
            users[userIndex].cartItems[index].itemQuantity -= 1;
        }
        localStorage.setItem(LOCAL_STORAGE_ALIAS, JSON.stringify(localStorageData));
        setCartItems(users[userIndex].cartItems);
    }

    function placeOrder(){
        if(userData.address.trim().length < 10) {
            console.log("Enter a valid address");
            return;
        }
        
        setOrderContact("");
        setDisplayForm(true);
    }

    function cancelConfirmation() {
        setOrderContact("");
        setDisplayForm(false);
    }

    function confirmOrder() {
        let deliveryContact = userData.contact;
        if(orderContact.trim().length > 0 && orderContact.trim().length !== 10) {
            console.log("Enter a valid delivery contact");
            return;
        }else{
            deliveryContact = orderContact.trim();
        }
        
        const address = userData.address;
        const user_id = userData.id;
        let total = 0;
        
        const currenDate = new Date();
        let orderDate = getFormatedDate(currenDate);
        let orderTime = getFormatedTime(currenDate);

        
        let status = "placed";

        const localStorageData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ALIAS));
        const users = localStorageData.users;

        users.filter(user => user.id === user_id)[0].cartItems.forEach(item => {
            total += item.itemPrice
        })

        console.log(total + ", " + orderDate + ", " + orderTime);
    }

    function getFormatedDate(currenDate) {
        let month = currenDate.getMonth() + 1;
        if(month < 10) month = '0' + month;
        let date = currenDate.getDate();
        if(date < 10) date = '0' + date;

        return currenDate.getFullYear() + "-" + month + "-" + date;
    }

    function getFormatedTime(currenDate) {
        let hours = currenDate.getHours();
        if(hours < 10) hours = '0' + hours;
        let minutes = currenDate.getMinutes();
        if(minutes < 10) minutes = '0' + minutes;
        let seconds = currenDate.getSeconds();
        if(seconds < 10) seconds = '0' + seconds;

        return hours + ":" + minutes + ":" + seconds;
    }

    const confirmationFormClassname = displayForm ? "active" : "";

    function clearCart(){
        const localStorageData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ALIAS));
        let users = localStorageData.users, userIndex = 0;

        for (let itr = 0; itr < users.length; itr++) {
            let element = users[itr];
            if(element.id === userData.id){
                userIndex = itr;
                break;
            }
        }

        users[userIndex].cartItems = [];
        localStorage.setItem(LOCAL_STORAGE_ALIAS, JSON.stringify(localStorageData));
        setCartItems(users[userIndex].cartItems);
    }

    return(
        <div id="cartContainer">
            <div className="tabTitle">
                <div className="big">Cart</div>
            </div>
            <ul id='cartList'>
                { 
                    cartItems.length > 0 ?
                    cartItems.map((item, index) => {
                        return(
                            <li className='cartListItem' key={index}>
                                <div className="cartListItem-text">
                                    <span className='big'>{item.itemName}</span>
                                    <span className='med'>Rs. {item.itemPrice}</span>
                                </div>
                                <div className="cartListItem-controls">
                                    <i className="fa-solid fa-minus" onClick={() => decreaseCount(index)}></i>
                                    <span>{item.itemQuantity}</span>
                                    <i className="fa-solid fa-plus" onClick={() => increaseCount(index)}></i>
                                </div>
                            </li>
                        )
                    }) :
                    <div id="cartEmpty">
                        No items added to cart.
                    </div>
                }
            </ul>
            {
                cartItems.length > 0 &&
                <div id="cartButtons">
                    <div className="cartButton" onClick={placeOrder}>Submit</div>
                    <div className="cartButton" onClick={clearCart}>Clear</div>
                </div>
            }
            <div id="orderConfirmationForm" className={confirmationFormClassname}>
                <div className="orderConfirmation-text">Use a different number for contact?</div>
                <input type="text" placeholder='Leave blank if no.' />
                <div id="orderConfirmationButtons">
                    <div className="orderConfirmationButton" onClick={confirmOrder}>Confirm</div>
                    <div className="orderConfirmationButton" onClick={cancelConfirmation}>Cancel</div>
                </div>
            </div>
            <Footer tab="cart" />
        </div>
    )
}