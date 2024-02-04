import './Menu.scss'
import { useEffect } from "react";
import { useState } from "react"

const data =
[
    {
        "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "name": "Butter Chicken",
        "description": "Tender chicken cooked in a rich, creamy tomato-based curry with butter and various spices.",
        "price": "$12.99",
        "status": "hidden"
    },
    {
        "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "name": "Biryani",
        "description": "Fragrant and flavorful rice dish cooked with aromatic spices, basmati rice, and meat (chicken, mutton, or beef).",
        "price": "$14.99",
        "status": "available"
    },
    {
        "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "name": "Paneer Tikka",
        "description": "Marinated and grilled cubes of paneer (Indian cottage cheese) served with mint chutney.",
        "price": "$9.99",
        "status": "available"
    },
    {
        "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "name": "Masala Dosa",
        "description": "Thin and crispy fermented rice crepe filled with spiced mashed potatoes, served with coconut chutney and sambar.",
        "price": "$8.99",
        "status": "available"
    },
    {
        "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "name": "Rogan Josh",
        "description": "Slow-cooked aromatic curry with tender pieces of meat (usually lamb or goat) in a rich and flavorful sauce.",
        "price": "$13.99",
        "status": "available"
    },
    {
        "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "name": "Chole Bhature",
        "description": "Spicy chickpea curry served with deep-fried bread (bhatura) made from fermented dough.",
        "price": "$10.99",
        "status": "available"
    },
    {
        "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "name": "Samosa",
        "description": "Triangular pastry filled with spiced potatoes, peas, and sometimes meat, deep-fried until golden brown.",
        "price": "$2.99 (each)",
        "status": "available"
    },
    {
        "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "name": "Chicken Tikka Masala",
        "description": "Grilled chicken tikka pieces in a creamy tomato-based curry sauce with aromatic spices.",
        "price": "$11.99",
        "status": "available"
    },
    {
        "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "name": "Dhokla",
        "description": "Steamed and spongy cake made from fermented rice and chickpea flour, typically served as a snack or breakfast.",
        "price": "$6.99",
        "status": "available"
    },
    {
        "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "name": "Aloo Paratha",
        "description": "Stuffed Indian flatbread with spiced mashed potatoes, pan-fried until golden and served with yogurt or chutney.",
        "price": "$7.99",
        "status": "available"
    }
]
  
export default function Menu(){
    const [dishes, setDishes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [fieldsSet, setFieldsSet] = useState({status: false, index: -1});

    useEffect(() => {
        function getDishesData(){
            setDishes(data);
        }

        getDishesData()
    }, [])

    useEffect(() => {
        if(showForm && !fieldsSet.status){
            var index = fieldsSet.index
            var nameField = document.getElementById("menuEditForm-name")
            var descField = document.getElementById("menuEditForm-description")
            var priceField = document.getElementById("menuEditForm-price")
            
            nameField.value = dishes[index].name
            descField.value = dishes[index].description
            priceField.value = dishes[index].price
            
            setFieldsSet({
                status: true,
                index: index
            })
        }
    }, [showForm, fieldsSet, dishes])

    function hideItem(index){
        setDishes(prev => {
            var temp = [...prev]
            temp[index].status = "hidden"
            return temp
        })
    }

    function showItem(index){
        setDishes(prev => {
            var temp = [...prev]
            temp[index].status = "available"
            return temp
        })
    }

    function prepareForm(index){
        setShowForm(true);
        setFieldsSet({
            status: false,
            index: index
        })
    }

    function saveDishChanges(){
        var index = fieldsSet.index
        var nameField = document.getElementById("menuEditForm-name")
        var descField = document.getElementById("menuEditForm-description")
        var priceField = document.getElementById("menuEditForm-price")

        setDishes(prev => {
            var temp = [...prev]
            temp[index].name = nameField.value
            temp[index].description = descField.value
            temp[index].price = priceField.value
            return temp
        })
        setFieldsSet({
            status: false,
            index: -1
        })
        setShowForm(false)
    }

    return(
        <div id="menuContainer">
            <div className="tabTitle">
                <span>Menu</span>
                <i
                    className="fa-solid fa-rotate"
                    onClick={() => {}}
                    title='update dishes'
                ></i>
            </div>
            <div id="menuGrid">
                {
                    dishes.map((dish, index) => {
                        const currClassName = dish.status === "hidden" ? "menuItem hidden" : "menuItem";
                        return(
                            <div key={index} className={currClassName}>
                                <img src={dish.image} alt="" />
                                <div className="menuItem-big">
                                    {dish.name}
                                </div>
                                <div className="menuItem-small">
                                    {dish.description}
                                </div>
                                <div className="menuItem-big">
                                    {dish.price}
                                </div>

                                <div className="menuItem-buttons">
                                    <div className="menuItem-button">
                                        Sold out
                                    </div>

                                    {
                                        dish.status !== "hidden" && 
                                        <div className="menuItem-button" onClick={() => hideItem(index)}>
                                            Hide
                                        </div>
                                    }
                                    {
                                        dish.status === "hidden" && 
                                        <div className="menuItem-button" onClick={() => showItem(index)}>
                                            Show
                                        </div>
                                    }

                                    <div className="menuItem-button red" onClick={() => prepareForm(index)}>
                                        Edit
                                    </div>
                                    <div className="menuItem-button red">
                                        Remove
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            {
                showForm &&
                <div id="menuEditForm">
                    <div id="menuEditForm-title">
                        Edit dish details
                    </div>
                    <input type="text" id='menuEditForm-name' placeholder='Name of the Dish'/>
                    <input type="text" id='menuEditForm-description' placeholder='Description of the Dish'/>
                    <input type="text" id='menuEditForm-price' placeholder='Price of the Dish'/>
                    <div id="menuEditForm-buttons">
                        <div className="menuEditForm-button" onClick={saveDishChanges}>
                            Save
                        </div>
                        <div className="menuEditForm-button" onClick={() => setShowForm(false)}>
                            Cancel
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}