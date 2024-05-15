import { Line, Pie } from 'react-chartjs-2'
import { Chart as ChartJS, LinearScale, CategoryScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { useCallback, useState, useEffect } from 'react';

ChartJS.register(LinearScale, CategoryScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const backgroundColors = ["#FFC107", "#2196F3", "#4CAF50", "#FF5722", "#9C27B0", "#FF9800", "#03A9F4", "#8BC34A", "#FFEB3B", "#673AB7"];
const borderColors = ["#b30f04", "#b30436", "#9c6609", "#9c6609", "#306905", "#190569", "#07703b", "#07703b", "#3f065c", "#4b5904"];

export default function Dashboard(){
    // load environment variables from .env file
    const SERVER_ADDRESS = process.env.REACT_APP_SERVER_ADDRESS;
    const [lineData, setLineData] = useState(
        {
            labels: [],
            datasets: []
        }
    );

    const [pieData, setPieData] = useState({
        labels: [],
        datasets: []
    });

    const options = {};

    async function getPieData() {
        try {
            const response = await fetch(SERVER_ADDRESS + "/order/get-menu-items-order-count?limit=8");
            
            if (response.status < 200 || response.status > 299) {
                // If the response status is not in the range 200-299
                console.log(`Error getting menu items data from database. Status: ${response.status}`);
            } else {
                const result = await response.json();
                
                let temp = {
                    labels: [],
                    datasets: [
                        {
                            label: "Menu Items",
                            data: [],
                            backgroundColor: [],
                            borderColor: [],
                            borderWidth: 1
                        }
                    ]
                }

                result.forEach((obj, index) => {
                    temp.labels.push(obj["name"]);
                    temp.datasets[0].data.push(obj["count"]);
                    temp.datasets[0].backgroundColor.push(backgroundColors[index]);
                    temp.datasets[0].borderColor.push(borderColors[index]);
                });

                setPieData(temp);
            }
        } catch (error) {
            // Network error or other exceptions
            console.error("Error making the API request:", error);
        }
    }

    async function getLineData() {
        try {
            let onlineOrderMap = null, tableOrderMap = null
            const response1 = await fetch(SERVER_ADDRESS + "/order/get-online-orders-time-data");
            const response2 = await fetch(SERVER_ADDRESS + "/order/get-table-orders-time-data");

            if (response1.status < 200 || response1.status > 299) {
                // If the response status is not in the range 200-299
                console.log(`Error getting online order data from database. Status: ${response1.status}`);
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
            
            let temp = {
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
            };

            if(onlineOrderMap !== null) temp.datasets[0].data = Object.keys(onlineOrderMap).map(key => onlineOrderMap[key]);
            if(tableOrderMap !== null) temp.datasets[1].data = Object.keys(tableOrderMap).map(key => tableOrderMap[key]);
            
            setLineData(temp);
        } catch (error) {
            // Network error or other exceptions
            console.error("Error making the API request:", error);
        }
    }
    
    const memoizedGetLineData = useCallback(getLineData, [SERVER_ADDRESS]);
    const memoizedGetPieData = useCallback(getPieData, [SERVER_ADDRESS]);
    
    useEffect(() => {
        memoizedGetLineData();
        memoizedGetPieData();
    }, [memoizedGetLineData, memoizedGetPieData])

    function getMap(result) {
        let currMap = {}
        for(let i=14; i<=22; i++) currMap[i.toString()] = 0;

        result.forEach(element => {
            let start = element.time.substring(0, 2);
            currMap[start.toString()] = currMap[start.toString()] + 1;
        });

        return currMap
    }

    // function getData() {
    //     getLineData();
    //     getPieData();
    // }

    return(
        <div id="bashboardContainer">
            {/* <div onClick={getData}>click</div>  */}
            <Line options={options} data={lineData} />
            <Pie options={options} data={pieData} />
        </div>
    )
}