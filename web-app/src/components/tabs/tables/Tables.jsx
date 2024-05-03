import './Tables.scss'
import { useCallback, useEffect, useState } from "react"

export default function Tables() {
    // load environment variables from .env file
    const SERVER_ADDRESS = process.env.REACT_APP_SERVER_ADDRESS;

    const [tables, setTables] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [searchedItems, setSearchedItems] = useState([]);
    const [editTableIndex, setEditTableIndex] = useState(-1);
    const [receiptData, setReceiptData] = useState(null);

    const getSearchItems = useCallback(async (searchItem) => {
        try {
            const response = await fetch(SERVER_ADDRESS + `/menu/search?searchItem=${searchItem}`);

            if(response.status < 200 || response.status > 299) {
                console.log("Error getting items after searching. Error: " + response.status)
            } else {
                console.log("Search items retrieved successfully.")
                const result = await response.json();
                setSearchedItems(result);
            }
        } catch (error) {
            console.log("Error making api request.")
        }
    }, [SERVER_ADDRESS])

    useEffect(() => {
        let debounce = setTimeout(() => {
            if(searchText.trim().length > 0) {
                getSearchItems(searchText.trim())
            } else {
                setSearchedItems([])
            }
        }, 1500);

        return () => {
            clearTimeout(debounce)
        }
    }, [searchText, getSearchItems]);

    useEffect(() => {
        updateTableData();
    }, []);

    function updateTableData() {
        let temp = localStorage.getItem("tableData");
        if(temp === null || temp === undefined || temp.length === 0) {
            temp = [];
            for (let index = 0; index < 12; index++) {
                temp.push({
                    number: index + 1,
                    capacity: 4,
                    state: "available",
                    items: []
                })
            }
            localStorage.setItem("tableData", JSON.stringify(temp));
        } else {
            temp = JSON.parse(temp);
        }

        setTables(temp);
    }

    function capitalize(str){
        return str[0].toUpperCase() + str.substring(1, str.length)
    }

    function changeTableState(idx, changeTo){
        let temp = [...tables];
        temp[idx].state = changeTo;

        setTables(temp)
        changeTableDataInLocalStorage(temp);
    }

    function addTable(){
        let temp = [...tables];
        temp.push({
            number: tables.length + 1,
            capacity: 4,
            state: "available",
            items: []
        })

        setTables(temp);
        changeTableDataInLocalStorage(temp);
    }

    function changeTableDataInLocalStorage(temp){
        if(temp === null || temp === undefined || temp.length === 0) return;
        localStorage.setItem("tableData", JSON.stringify(temp));
    }

    function addItemToList(newItem) {
        let localData = JSON.parse(localStorage.getItem("tableData"));
        let currTable = localData[editTableIndex];
        if(currTable.items === null || currTable.items === undefined) currTable.items = [];

        for(let item in currTable.items) {
            if(item.id === newItem.id) {
                setSearchText("");
                return;
            }
        }

        currTable.items.push({...newItem, quantity: 1});
        changeTableDataInLocalStorage(localData);
        setSearchText("");
        updateTableData();
    }

    function changeQuantity(id, change) {
        let localData = JSON.parse(localStorage.getItem("tableData"));
        let currTable = localData[editTableIndex];

        for (let index = 0; index < currTable.items.length; index++) {
            const element = currTable.items[index];
            if(element.id === id) {
                element.quantity += change;
                if(element.quantity === 0) currTable.items.splice(index, 1);
                break;
            }
        }

        changeTableDataInLocalStorage(localData);
        setSearchText("");
        updateTableData();
    }

    async function addToDatabase() {
        const currenDate = new Date();
        let orderDate = getFormatedDate(currenDate);
        let orderTime = getFormatedTime(currenDate);
        
        let localData = JSON.parse(localStorage.getItem("tableData"));
        let currTable = localData[editTableIndex];
        
        let total = 0;
        let orderItems = [];

        currTable.items.forEach(foodItem => {
            orderItems.push({id: foodItem.id, quantity: foodItem.quantity});
            total += foodItem.price * foodItem.quantity;
        });

        let data = {
            total: total,
            seats: currTable.capacity,
            orderDate: orderDate,
            orderTime: orderTime,
            orderItems: orderItems
        }

        try{
            const response = await fetch(SERVER_ADDRESS + "/order/add-table-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
            
            if (response.status < 200 || response.status > 299) {
                // If the response status is not in the range 200-299
                console.log(`Error adding table order to the database. Status: ${response.status}`);
            } else {
                currTable.updated = true;
                currTable.orderDate = orderDate;
                currTable.orderTime = orderTime;
                console.log("Table order placed.");
            }
        }catch (error){
            // Network error or other exceptions
            console.error("Error making the API request:", error);
        }

        changeTableDataInLocalStorage(localData);
        setSearchText("");
        updateTableData();
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

    function generateBill() {
        setReceiptData(tables[editTableIndex]);
    }

    function closeReceipt() {
        setReceiptData(null);
    }

    // function removeTable(index) {
    //     let tables = JSON.parse(localStorage.getItem("tableData"));
    //     tables.splice(index, 1);
    //     changeTableDataInLocalStorage(tables);
    // }

    return(
        <div id="tablesContainer">
            <div className="tabTitle">
                <span>Tables</span>
                <i
                    className="fa-solid fa-plus"
                    onClick={addTable}
                ></i>
            </div>
            <div id="tablesGrid">
                {
                    tables.map((table, idx) => {
                        let currClassName = "tableItem " + table.state;
                        let currState = capitalize(table.state);
                        return(
                            <div className={currClassName} key={idx}>
                                <div className="tableItem-title">
                                    <span>Table {table.number} {currState}</span>
                                    {/* <i className="fa-solid fa-trash" onClick={() => removeTable(idx)}></i> */}
                                </div>
                                <span>Table for: {table.capacity}</span>

                                <span className='tableItem-middle-title'>
                                    {
                                        table.state !== "occupied" ? "Set as:" : "Actions:"
                                    }
                                </span>
                                <div className="buttons">
                                    {
                                        table.state === "available" &&
                                        <>
                                            <div
                                                className="button"
                                                onClick={() => changeTableState(idx, "occupied")}
                                            >Occupied</div>
                                            <div
                                                className="button"
                                                onClick={() => changeTableState(idx, "reserved")}
                                            >Reserved</div>
                                        </>
                                    }
                                    {
                                        table.state === "occupied" &&
                                        <>
                                            <div
                                                className="button"
                                                onClick={() => setEditTableIndex(idx)}
                                            >Edit Items</div>
                                            <div
                                                className="button"
                                                onClick={() => changeTableState(idx, "available")}
                                            >Make available</div>
                                        </>
                                    }
                                    {
                                        table.state === "reserved" &&
                                        <>
                                            <div
                                                className="button"
                                                onClick={() => changeTableState(idx, "occupied")}
                                            >Occupied</div>
                                            <div
                                                className="button"
                                                onClick={() => changeTableState(idx, "available")}
                                            >Available</div>
                                        </>
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            {
                editTableIndex !== -1 &&
                <div id="tableEditForm">
                    <div id="tableEditFormHeader">
                        <div id="tableEditFormHeader-info">
                            Edit data for Table {editTableIndex + 1}
                        </div>
                        <div id="tableEditFormHeaderSearch">
                            <
                                input 
                                type="text" 
                                placeholder='Enter the dish name'
                                value={searchText} 
                                onChange={e => setSearchText(e.target.value)}
                            />
                            <ul id="tableEditFormSearchList">
                                {
                                    searchedItems.map((item, index) => {
                                        return (
                                            <li className='tableEditFormSearchList-item' key={index}>
                                                <span>
                                                    {item.name} (Rs. {item.price})
                                                </span>
                                                <div className="tableEditFormSearchList-item-button" onClick={()=>addItemToList(item)}>
                                                    Add
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                                {
                                    searchText.trim().length > 0 && searchedItems.length === 0 &&
                                    <li className='tableEditFormSearchList-item'>
                                        No Dishes Found!
                                    </li>
                                }
                            </ul>
                        </div>
                        <div id="tableEditFormSearchButtons">
                            {
                                tables[editTableIndex].updated ?
                                <div className="tableEditFormSearch-button" onClick={generateBill}>Bill</div> : 
                                <div className="tableEditFormSearch-button" onClick={addToDatabase}>Save</div>
                            }
                            <div className="tableEditFormSearch-button" onClick={() => setEditTableIndex(-1)}>Close</div>
                        </div>
                    </div>
                    <ul id="tableEditForm-displayList">
                        {
                            editTableIndex !== -1 &&
                            tables[editTableIndex].items.map((foodItem, index) => {
                                return (
                                    <li className="tableEditForm-displayList-item" key={index}>
                                        <div>{foodItem.name}</div>
                                        <div className='tableEditForm-displayList-item-buttons'>
                                            <i className="fa-solid fa-minus" onClick={() => changeQuantity(foodItem.id, -1)}></i>
                                            <span>{foodItem.quantity}</span>
                                            <i className="fa-solid fa-plus" onClick={() => changeQuantity(foodItem.id, 1)}></i>
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            }

            {
                receiptData !== null &&
                <PrintReceipt date={receiptData.orderDate} time={receiptData.orderTime} items={receiptData.items} closeReceipt={closeReceipt}/>
            }
        </div>
    )
}

function PrintReceipt(props) {
    let total = 0;
    props.items.forEach(item => total += item.price * item.quantity);

    function generateReceipt() {
        window.print()
    }

    return(
        <div id="printReceiptContainer">
            <div id="printReceiptHeader">
                <i className="fa-solid fa-martini-glass-citrus"></i>
                <span>RESTRO</span>
            </div>
            <div id="printReceiptSubHeader">
                <div className='printReceiptSubHeader-row'>
                    <span>Time</span>
                    <span>{props.time}</span>
                </div>
                <div className='printReceiptSubHeader-row'>
                    <span>Date</span>
                    <span>{props.date}</span>
                </div>
                <div className='printReceiptSubHeader-row'>
                    <span>Contact</span>
                    <span>+91 95682 12453</span>
                </div>
                <div className='printReceiptSubHeader-row'>
                    <span>Email</span>
                    <span>restro.help@abc.com</span>
                </div>
            </div>
            <ul id="printReceiptList">
                <li className='big'>
                    <span>#</span>
                    <span>Item</span>
                    <span>Quantity</span>
                    <span>Price</span>
                </li>
                {
                    props.items.map((item, index) => {
                        return(
                            <li key={index}>
                                <span>{index+1}</span>
                                <span>{item.name}</span>
                                <span>{item.quantity}</span>
                                <span>Rs. {item.price}</span>
                            </li>
                        )
                    })
                }
                <li className="last big">
                    <span>Total</span>
                    <span>Rs. {total}</span>
                </li>
            </ul>

            <div id="receiptButtons">
                <div id="receiptButton" onClick={generateReceipt}>Print</div>
                <div id="receiptButton">Email</div>
                <div id="receiptButton" onClick={props.closeReceipt}>Close</div>
            </div>
        </div>
    )
}