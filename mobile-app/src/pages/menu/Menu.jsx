import { useContext, useEffect, useState } from 'react'
import Footer from '../footer/Footer'
import './Menu.scss'
import { MenuItemsContext } from '../../contexts/MenuItemsContext'
import { UserDataContext } from '../../contexts/UserDataContext';

// load environment variables from .env file
const LOCAL_STORAGE_ALIAS = process.env.REACT_APP_LOCAL_STORAGE_ALIAS;

export default function Menu(){
    const { menuItems, setMenuItems } = useContext(MenuItemsContext);
    const { userData } = useContext(UserDataContext);
    const [descrptionStatus, setDescriptionStatus] = useState([]);

    useEffect(() => {
        let temp = [];
        for (let index = 0; index < menuItems.length; index++)
            temp.push(false)

            setDescriptionStatus(temp);
    }, [menuItems])

    function toggleDescription(index){
        console.log(index)
        let temp = [...descrptionStatus]
        temp[index] = !temp[index]
        setDescriptionStatus(temp);
    }

    function addToCart(index){
        const userId = userData.id;

        // get the data from local storage
        let localStorageData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ALIAS));
        let storedUsers = localStorageData.users;
        
        // get the index for the user in the users array
        let userCartIndex = 0
        for (let index = 0; index < storedUsers.length; index++) {
            const element = storedUsers[index];
            if(element.id === userId){
                userCartIndex = index;
                break;
            }
        }
        
        let hasItem = false;
        for(let item of storedUsers[userCartIndex].cartItems){
            if(item.itemId === menuItems[index].id){
                hasItem = true;
                break;
            }
        }

        if(!hasItem){
            // add the item
            storedUsers[userCartIndex].cartItems.push({
                itemId: menuItems[index].id,
                itemPrice: menuItems[index].price,
                itemName: menuItems[index].name,
                itemQuantity: 1
            })
        }

        // localStorageData.users = storedUsers;
        localStorage.setItem(LOCAL_STORAGE_ALIAS, JSON.stringify(localStorageData));
        
        setMenuItems((prev) => {
            let tempMenuItems = [...prev]
            tempMenuItems[index].added = true;
            return tempMenuItems
        })
    }

    function removeFromCart(index){
        const userId = userData.id, itemId = menuItems[index].id;

        // get the data from local storage
        let localStorageData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ALIAS));
        // get the users array
        let storedUsers = localStorageData.users;

        // extract the current user from the array
        let currentUserData = storedUsers.filter(user => user.id === userId)[0]
        // remove the item
        let newCartItems = currentUserData.cartItems.filter(item => item.itemId !== itemId)

        // update the users array
        localStorageData.users = storedUsers.map((user) => {
            return user.id !== userId ? user : {...user, cartItems: newCartItems}
        })
        localStorage.setItem(LOCAL_STORAGE_ALIAS, JSON.stringify(localStorageData));
        
        // make changes in the UI
        setMenuItems((prev) => {
            let tempMenuItems = [...prev]
            tempMenuItems[index].added = false;
            return tempMenuItems
        })
    }

    return(
        <div id="menuContainer">
            <div className="tabTitle">
                <div className="big">Menu</div>
            </div>
            <ul id="menuList">
                {
                    menuItems !== null &&
                    menuItems.map((item, index) => {
                        return <li key={index} className='menuItem'>
                            <div className="menuItemHeader">
                                <img src={item.image} alt="" />
                                <div className="menuItemHeader-text">
                                    <div className="big">{item.name}</div>
                                    <div className="medium">@ {item.price}</div>
                                </div>
                            </div>
                            <div className={"menuItemText" + (descrptionStatus[index] ? " active" : "")}>
                                <span>
                                    <span>Description</span>
                                    <i className="fa-solid fa-caret-down" onClick={() => toggleDescription(index)}></i>
                                </span>
                                <div className="small">
                                    {item.description}
                                </div>
                            </div>
                            <div className="menuItemButtons">
                                {!item.added && 
                                    <div className="button" onClick={() => addToCart(index)}>Add</div>
                                }
                                {item.added && 
                                    <div className="button" onClick={() => removeFromCart(index)}>
                                        <i className="fa-solid fa-xmark"></i>
                                    </div>
                                }
                                <div className="button">
                                    <i className="fa-solid fa-heart"></i>
                                </div>
                            </div>
                        </li>
                    })
                }
            </ul>
            <Footer tab="menu" />
        </div>
    )
}