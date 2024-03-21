import { useContext, useEffect, useState } from 'react'
import Footer from '../footer/Footer'
import './Cart.scss'
import { UserDataContext } from '../../contexts/UserDataContext';

// load environment variables from .env file
const LOCAL_STORAGE_ALIAS = process.env.REACT_APP_LOCAL_STORAGE_ALIAS;

export default function Cart(){
    const [cartItems, setCartItems] = useState([]);
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
                    <div className="cartButton">Submit</div>
                    <div className="cartButton" onClick={clearCart}>Clear</div>
                </div>
            }
            <Footer tab="cart" />
        </div>
    )
}