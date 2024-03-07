import './Menu.scss'
import { useCallback, useEffect } from "react";
import { useState } from "react"

// const data =
// [
//     {
//         "image": "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=1884&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         "name": "Butter Chicken",
//         "description": "Tender chicken cooked in a rich, creamy tomato-based curry with butter and various spices.",
//         "price": "320",
//         "status": "available",
//         "tags": "lunch, dinner"
//     },
//     {
//         "image": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         "name": "Biryani",
//         "description": "Fragrant and flavorful rice dish cooked with aromatic spices, basmati rice, and meat (chicken, mutton, or beef).",
//         "price": "380",
//         "status": "available",
//         "tags": "lunch, dinner"
//     },
//     {
//         "image": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=1917&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         "name": "Paneer Tikka",
//         "description": "Marinated and grilled cubes of paneer (Indian cottage cheese) served with mint chutney.",
//         "price": "280",
//         "status": "available",
//         "tags": "lunch, dinner"
//     },
//     {
//         "image": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         "name": "Masala Dosa",
//         "description": "Thin and crispy fermented rice crepe filled with spiced mashed potatoes, served with coconut chutney and sambar.",
//         "price": "80",
//         "status": "available",
//         "tags": "snacks, breakfast"
//     },
//     {
//         "image": "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         "name": "Rogan Josh",
//         "description": "Slow-cooked aromatic curry with tender pieces of meat (usually lamb or goat) in a rich and flavorful sauce.",
//         "price": "300",
//         "status": "available",
//         "tags": "lunch, dinner"
//     },
//     {
//         "image": "https://images.unsplash.com/photo-1567337710282-00832b415979?q=80&w=1930&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         "name": "Chole Bhature",
//         "description": "Spicy chickpea curry served with deep-fried bread (bhatura) made from fermented dough.",
//         "price": "195",
//         "status": "available",
//         "tags": "lunch, dinner"
//     },
//     {
//         "image": "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         "name": "Samosa",
//         "description": "Triangular pastry filled with spiced potatoes, peas, and sometimes meat, deep-fried until golden brown.",
//         "price": "22",
//         "status": "available",
//         "tags": "snacks, breakfast"
//     },
//     {
//         "image": "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=1900&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         "name": "Chicken Tikka Masala",
//         "description": "Grilled chicken tikka pieces in a creamy tomato-based curry sauce with aromatic spices.",
//         "price": "350",
//         "status": "available",
//         "tags": "lunch, dinner"
//     },
//     {
//         "image": "https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         "name": "Dhokla",
//         "description": "Steamed and spongy cake made from fermented rice and chickpea flour, typically served as a snack or breakfast.",
//         "price": "55",
//         "status": "available",
//         "tags": "snacks, breakfast"
//     },
//     {
//         "image": "https://images.unsplash.com/photo-1574448857443-dc1d7e9c4dad?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         "name": "Aloo Paratha",
//         "description": "Stuffed Indian flatbread with spiced mashed potatoes, pan-fried until golden and served with yogurt or chutney.",
//         "price": "65",
//         "status": "available",
//         "tags": "lunch, dinner, snacks, breakfast"
//     }
// ]
  
export default function Menu(){
    const [dishes, setDishes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [fieldsSet, setFieldsSet] = useState({status: false, index: -1});

    // funciton call to update the data values
    async function updateDishesData(newData){
        var updateStatus = "failed"
        try {
            const response = await fetch('http://localhost:4300/menu/update-menu', {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newData),
            });
            
          
            if (response.status < 200 || response.status > 299) {
              console.log(`Error updating menu values inside the database. Status: ${response.status}`);
            } else {
              console.log("Menu values updated successfully");
              // set the status
              updateStatus = "done";
            }

        } catch (error) {
            // Network error or other exceptions
            console.error("Error making the API request:", error);
        }
        
        return updateStatus
    }

    // function call to get disher data from api
    async function getDishesData(){
        const respone = await fetch('http://localhost:4300/menu/get-menu')
        const result = await respone.json()
        setDishes(result); 
    }
    // memoizing the funciton call
    const memoizedGetDishesData = useCallback(getDishesData, []);

    // setting the data for menu items
    useEffect(() => {
        memoizedGetDishesData();
    }, [memoizedGetDishesData])

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

    function prepareForm(index){
        setShowForm(true);
        setFieldsSet({
            status: false,
            index: index
        })
    }

    async function changeDishStatus(index, newStatus){
        var newData = {
            status: newStatus,
            id: dishes[index].id
        }
        
        const updateStatus = await updateDishesData(newData);
        if(updateStatus === "failed"){
            return
        }

        setDishes(prev => {
            var temp = [...prev]
            temp[index].status = newStatus
            return temp
        })
    }

    async function saveDishChanges(){
        var index = fieldsSet.index
        var nameField = document.getElementById("menuEditForm-name")
        var descField = document.getElementById("menuEditForm-description")
        var priceField = document.getElementById("menuEditForm-price")

        var newData = dishes[index]
        newData.name = nameField.value
        newData.description = descField.value
        newData.price = priceField.value
        
        const updateStatus = await updateDishesData(newData)
        if(updateStatus === "failed"){
            return
        }
        
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
                        const imageClassName = dish.status === "sold out" ? "filter" : "";
                        return(
                            <div key={index} className={currClassName}>
                                <div className="menuItem-imageContainer">
                                    {
                                        dish.status === "sold out" &&
                                        <div className="soldOut-overlay">
                                            Sold Out!
                                        </div>
                                    }
                                    <img className={imageClassName} src={dish.image} alt="" />
                                </div>
                                <div className="menuItem-big">
                                    {dish.name}
                                </div>
                                <div className="menuItem-small">
                                    {dish.description}
                                </div>
                                <div className="menuItem-big">
                                    Rs.{dish.price}
                                </div>

                                <div className="menuItem-buttons">
                                    {
                                        dish.status !== "sold out" && dish.status !== "hidden" && 
                                        <div className="menuItem-button" onClick={() => changeDishStatus(index, "sold out")}>
                                            Sold out
                                        </div>
                                    }
                                    {
                                        dish.status === "sold out" && 
                                        <div className="menuItem-button" onClick={() => changeDishStatus(index, "available")}>
                                            Available
                                        </div>
                                    }

                                    {
                                        dish.status !== "sold out" && dish.status !== "hidden" && 
                                        <div className="menuItem-button" onClick={() => changeDishStatus(index, "hidden")}>
                                            Hide
                                        </div>
                                    }
                                    {
                                        dish.status === "hidden" && 
                                        <div className="menuItem-button" onClick={() => changeDishStatus(index, "available")}>
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