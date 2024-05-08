import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, LinearScale, CategoryScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { useCallback, useState, useEffect } from 'react';

ChartJS.register(LinearScale, CategoryScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard(){
    // load environment variables from .env file
    const SERVER_ADDRESS = process.env.REACT_APP_SERVER_ADDRESS;
    const [lineData, setLineData] = useState(
        {
            labels: ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
            datasets: [
                {
                    label: "Online Orders",
                    borderColor: "green",
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                },
                {
                    label: "Table Orders",
                    borderColor: "blue",
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }
            ]
        }
    );

    const options = {};

    const getLineData = useCallback(async () => {
        try {
            let onlineOrderMap = null, tableOrderMap = null
            const response1 = await fetch(SERVER_ADDRESS + "/order/get-online-orders-time-data");
            const response2 = await fetch(SERVER_ADDRESS + "/order/get-table-orders-time-data");

            if (response1.status < 200 || response1.status > 299) {
                // If the response status is not in the range 200-299
                console.log(`Error getting table order data from database. Status: ${response1.status}`);
            } else {
                const result = await response1.json();
                onlineOrderMap = getMap(result);
            }

            if (response2.status < 200 || response2.status > 299) {
                // If the response status is not in the range 200-299
                console.log(`Error getting table order data from database. Status: ${response2.status}`);
            } else {
                const result = await response2.json();
                tableOrderMap = getMap(result);
            }

            setLineData(prev => {
                let temp = JSON.parse(JSON.stringify(prev));
                if(onlineOrderMap !== null) temp.datasets[0].data = Object.keys(onlineOrderMap).map(key => onlineOrderMap[key]);
                if(tableOrderMap !== null) temp.datasets[1].data = Object.keys(tableOrderMap).map(key => tableOrderMap[key]);

                return temp;
            })
        } catch (error) {
            // Network error or other exceptions
            console.error("Error making the API request:", error);
        }
    }, [SERVER_ADDRESS]);
    
    useEffect(() => {
        getLineData();
    }, [getLineData])

    function getMap(result) {
        let currMap = {}
        for(let i=14; i<=22; i++) currMap[i.toString()] = 0;

        result.forEach(element => {
            let start = element.time.substring(0, 2);
            currMap[start.toString()] = currMap[start.toString()] + 1;
        });

        return currMap
    }

    console.log(lineData);

    return(
        <div id="bashboardContainer">
            <Line options={options} data={lineData}/>
            <div onClick={getLineData}>click</div>
        </div>
    )
}