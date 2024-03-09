import { useContext, useEffect, useState } from 'react'
import Footer from '../footer/Footer'
import './Menu.scss'
import { MenuItemsContext } from '../../contexts/MenuItemsContext'

export default function Menu(){
    const { menuItems } = useContext(MenuItemsContext);
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
                                <div className="button">Add</div>
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