import './Tables.scss'
import { useCallback, useEffect, useState } from "react"

export default function Tables() {
    // load environment variables from .env file
    const SERVER_ADDRESS = process.env.REACT_APP_SERVER_ADDRESS;

    const [tables, setTables] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [searchedItems, setSearchedItems] = useState([]);
    const [editTableIndex, setEditTableIndex] = useState(-1);

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
        let temp = localStorage.getItem("tableData");
        if(temp === null || temp === undefined || temp.length === 0) {
            temp = [];
            localStorage.setItem("tableData", JSON.stringify(temp));
        } else {
            temp = JSON.parse(temp);
        }

        setTables(temp);
    }, []);

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
            state: "available"
        })

        setTables(temp);
        changeTableDataInLocalStorage(temp);
    }

    function changeTableDataInLocalStorage(temp){
        if(temp === null || temp === undefined || temp.length === 0) return;
        localStorage.setItem("tableData", JSON.stringify(temp));
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
                                                <div className="tableEditFormSearchList-item-button">
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
                            <div className="tableEditFormSearch-button">Bill</div>
                            <div className="tableEditFormSearch-button">Save</div>
                            <div className="tableEditFormSearch-button" onClick={() => setEditTableIndex(-1)}>Close</div>
                        </div>
                    </div>
                    <div id="tableEditForm-displayList">
                        {/* display the added items */}
                    </div>
                </div>
            }
        </div>
    )
}