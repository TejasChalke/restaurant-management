import './OnlineOrders.scss'
import { useEffect, useState } from "react"

const data = 
[
    {
        "customer": {
        "name": "John Doe",
        "contact": "+1 123-456-7890",
        "address": "123 Main Street, Cityville, State, Zip"
        },
        "status": "pending",
        "items": [
        {"dish": "Butter Chicken", "quantity": 2, "price": "$12.99"},
        {"dish": "Biryani", "quantity": 1, "price": "$14.99"}
        ]
    },
    {
        "customer": {
        "name": "Jane Smith",
        "contact": "+1 234-567-8901",
        "address": "456 Oak Avenue, Townsville, State, Zip"
        },
        "status": "pending",
        "items": [
        {"dish": "Masala Dosa", "quantity": 3, "price": "$8.99"},
        {"dish": "Chole Bhature", "quantity": 1, "price": "$10.99"}
        ]
    },
    {
        "customer": {
        "name": "Alice Johnson",
        "contact": "+1 345-678-9012",
        "address": "789 Pine Street, Villagetown, State, Zip"
        },
        "status": "pending",
        "items": [
        {"dish": "Rogan Josh", "quantity": 2, "price": "$13.99"},
        {"dish": "Samosa", "quantity": 4, "price": "$2.99"}
        ]
    },
    {
        "customer": {
        "name": "Bob Williams",
        "contact": "+1 456-789-0123",
        "address": "101 Maple Lane, Hamletville, State, Zip"
        },
        "status": "pending",
        "items": [
        {"dish": "Chicken Tikka Masala", "quantity": 1, "price": "$11.99"},
        {"dish": "Dhokla", "quantity": 2, "price": "$6.99"}
        ]
    },
    {
        "customer": {
        "name": "Eva Davis",
        "contact": "+1 567-890-1234",
        "address": "202 Elm Street, Riverside, State, Zip"
        },
        "status": "pending",
        "items": [
        {"dish": "Paneer Tikka", "quantity": 2, "price": "$9.99"},
        {"dish": "Aloo Paratha", "quantity": 2, "price": "$7.99"}
        ]
    },
    {
        "customer": {
        "name": "Chris Brown",
        "contact": "+1 678-901-2345",
        "address": "303 Cedar Avenue, Lakeside, State, Zip"
        },
        "status": "pending",
        "items": [
        {"dish": "Butter Chicken", "quantity": 1, "price": "$12.99"},
        {"dish": "Biryani", "quantity": 1, "price": "$14.99"}
        ]
    },
    {
        "customer": {
        "name": "Grace Taylor",
        "contact": "+1 789-012-3456",
        "address": "404 Birch Street, Mountainview, State, Zip"
        },
        "status": "pending",
        "items": [
        {"dish": "Masala Dosa", "quantity": 1, "price": "$8.99"},
        {"dish": "Chole Bhature", "quantity": 3, "price": "$10.99"}
        ]
    },
    {
        "customer": {
        "name": "David Martin",
        "contact": "+1 890-123-4567",
        "address": "505 Oak Lane, Hillside, State, Zip"
        },
        "status": "pending",
        "items": [
        {"dish": "Rogan Josh", "quantity": 2, "price": "$13.99"},
        {"dish": "Samosa", "quantity": 2, "price": "$2.99"}
        ]
    },
    {
        "customer": {
        "name": "Emma White",
        "contact": "+1 901-234-5678",
        "address": "606 Pine Avenue, Seaside, State, Zip"
        },
        "status": "pending",
        "items": [
        {"dish": "Chicken Tikka Masala", "quantity": 2, "price": "$11.99"},
        {"dish": "Dhokla", "quantity": 1, "price": "$6.99"}
        ]
    },
    {
        "customer": {
        "name": "Frank Harris",
        "contact": "+1 012-345-6789",
        "address": "707 Maple Street, Cityside, State, Zip"
        },
        "status": "pending",
        "items": [
        {"dish": "Paneer Tikka", "quantity": 3, "price": "$9.99"},
        {"dish": "Aloo Paratha", "quantity": 1, "price": "$7.99"}
        ]
    }
]
  
export default function OnlineOrders(){
    const [orders, setOrders] = useState();
    useEffect(() => {
        function getOrders(){
            setOrders(data)
        }

        getOrders();
    }, [])

    function acceptOrder(index){
        setOrders(prev => {
            var temp = [...prev]
            temp[index].status = "accepted"
            return temp
        })
    }

    return(
        <div id="onlineOrdersContainer">
            <div className="tabTitle">
                <span>Online Orders</span>
                <i
                    className="fa-solid fa-rotate"
                    onClick={() => {}}
                    title='update dishes'
                ></i>
            </div>
            <div id="ordersGrid">
                {
                    orders?.map((order, index) => {
                        var total = 0;
                        order.items.forEach(element => {
                            var price = element.price.substring(1)
                            total += parseFloat(price)
                        })

                        return(
                            <div className="orderItem" key={index}>
                                <div className="orderItem-header">
                                    <span className="big">
                                        {order.customer.name}
                                    </span>
                                    <span className='small'>
                                        {order.customer.contact}
                                    </span>
                                    <span>
                                        Address: {order.customer.address}
                                    </span>
                                </div>
                                <div className="orderItem-list">
                                    <div className="medium">
                                        Items:
                                    </div>
                                    <ul>
                                        {
                                            order.items?.map((item, itemIdx) => {
                                                return(
                                                    <li key={itemIdx}>
                                                        <span>
                                                            <span>{item.dish}</span>
                                                            (x {item.quantity})
                                                        </span>
                                                        <span>{item.price}</span>
                                                    </li>
                                                )
                                            })
                                        }
                                        <li className='medium'>
                                            <span>Total: </span>
                                            <span>${total}</span>
                                        </li>
                                    </ul>
                                </div>
                                {
                                    order.status === "pending" ? 
                                    <div className="orderItem-buttons">
                                        <div className="orderItem-button" onClick={() => acceptOrder(index)}>
                                            Accept
                                        </div>
                                        <div className="orderItem-button red">
                                            Reject
                                        </div>
                                    </div> :
                                    <div className="orderItem-buttons">
                                        <div className="orderItem-button">
                                            Out for Delivery
                                        </div>
                                        <div className="orderItem-button red">
                                            Cancel
                                        </div>
                                    </div>
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}