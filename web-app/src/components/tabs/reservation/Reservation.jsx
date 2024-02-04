import './Reservation.scss'
import { useEffect, useState } from "react"

export default function Reservation(){
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        let temp = [];
        const currDate = "2024-01-10";
        const d = new Date();
        const currHr = d.getHours();

        for(let i=0; i<6; i++){
            const currTime = currHr + Math.floor(Math.random() * (20 - currHr));
            const currMin = d.getMinutes() - 6;
            temp.push({
                customerName: "John Doe",
                customerId: Math.random() > 0.4 ? i : 0,
                dateTime: currDate.split("-").reverse().join("/") + " " + currTime + ":" + (currMin < 10 ? "0" + currMin : currMin),
                status: (i === 2 || i === 5) ? "pending" : "approved"
            })
        }
        
        setReservations(temp);
    }, []);

    function removeOldReservations() {

    }

    return(
        <div id="reservationContainer">
            <div className="tabTitle">
                <span>Reservations</span>
                <i
                    className="fa-solid fa-rotate"
                    onClick={removeOldReservations}
                    title='update reservations'
                ></i>
            </div>
            <div id="reservationsGrid">
                {
                    reservations.map((reservation, idx) => {
                        const currClassName = "reservationItem" + (reservation.customerId !== 0 ? " registered" : "");
                        const currDateTime = reservation.dateTime.split(" ");
                        return (
                            <div className={currClassName} key={idx}>
                                <div className="reservationItem-title">
                                    <div className='reservationItem-header'>
                                        {reservation.customerId !== 0 && <i className="fa-solid fa-user"></i>}
                                        <span>{reservation.customerName}</span>
                                    </div>
                                    <div className='reservationItem-subheader'>
                                        <span>Date: {currDateTime[0]}</span>
                                        <span>Time: {currDateTime[1]}</span>
                                    </div>
                                </div>

                                <div className="reservationItem-buttons">
                                    {
                                        reservation.status !== "approved" &&
                                        <>
                                            <div className="reservationItem-button">
                                                Approve
                                            </div>
                                                <div className="reservationItem-button red">
                                                Delete
                                            </div>
                                        </>
                                    }
                                    {
                                        reservation.status === "approved" &&
                                        <div className="reservationItem-button red">
                                            Cancel
                                        </div>
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