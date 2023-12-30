import './Tables.scss'
import { useEffect, useState } from "react"

export default function Tables(){
    const [tables, setTables] = useState([]);

    useEffect(() => {
        let temp = [];

        for(let i=0; i<20; i++){
            temp.push({
                number: i+1,
                capacity: Math.floor(Math.random() * 4 + 2),
                state: "free"
            })
        }

        setTables(temp);
    }, []);

    console.log(tables);

    return(
        <div id="tablesContainer">
            <div className="tabTitle">
                <span>Tables</span>
                <i className="fa-solid fa-plus"></i>
            </div>
            <div id="tablesGrid">
                {
                    tables.map((table, idx) => {
                        let currClassName = "tableItem " + table.state;
                        return(
                            <div className={currClassName} key={idx}>
                                <div className="tableItem-title">
                                    <span>Table {table.number}</span>
                                    <i className="fa-solid fa-pen-to-square"></i>
                                </div>
                                <span>Table for: {table.capacity}</span>

                                <span className='tableItem-middle-title'>Set as:</span>
                                <div className="buttons">
                                    <div className="button">Occupied</div>
                                    <div className="button">Reserved</div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}