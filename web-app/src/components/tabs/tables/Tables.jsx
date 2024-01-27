import './Tables.scss'
import { useEffect, useState } from "react"

export default function Tables(){
    const [tables, setTables] = useState([]);

    useEffect(() => {
        let temp = localStorage.getItem("tableData");
        if(temp === null || temp === undefined || temp.length === 0) {
            temp = [];
            for(let i=0; i<10; i++){
                temp.push({
                    number: i+1,
                    capacity: Math.floor(Math.random() * 4 + 2),
                    state: "available"
                })
            }
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
            capacity: Math.floor(Math.random() * 4 + 2),
            state: "available"
        })

        setTables(temp);
        changeTableDataInLocalStorage(temp);
    }

    function changeTableDataInLocalStorage(temp){
        if(temp === null || temp === undefined || temp.length === 0) return;
        localStorage.setItem("tableData", JSON.stringify(temp));
    }

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
                                    <i className="fa-solid fa-pen-to-square"></i>
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
                                            >Add Items</div>
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
        </div>
    )
}