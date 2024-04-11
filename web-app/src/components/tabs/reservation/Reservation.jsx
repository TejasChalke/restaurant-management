import { useCallback } from 'react';
import './Reservation.scss'
import { useEffect, useState } from "react"

export default function Reservation(){
    // load environment variables from .env file
    const SERVER_ADDRESS = process.env.REACT_APP_SERVER_ADDRESS;

    const [reservations, setReservations] = useState([]);

    const getAllReservations = useCallback(async () => {
        try {
            const response = await fetch(SERVER_ADDRESS + "/reservation/all-reservations", {
                method: "GET"
            })

            if (response.status < 200 || response.status > 299) {
                // If the response status is not in the range 200-299
                console.log(`Error while getting requested reservations. Status: ${response.status}`);
            } else {
                console.log("User reservations retrieved");
                setReservations(await response.json());
            }
        } catch (error) {
            // Network error or other exceptions
            console.error("Error making the API request:", error);
        }
    }, [SERVER_ADDRESS])

    useEffect(() => {
        getAllReservations();
    }, [getAllReservations]);

    async function updateReservation(reservation_id, new_status) {
        try {
            const data = {
                id: reservation_id,
                new_status: new_status
            }

            const response = await fetch(SERVER_ADDRESS + "/reservation/update-user-reservation", {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            if (response.status < 200 || response.status > 299) {
                // If the response status is not in the range 200-299
                console.log(`Error while updating reservation. Status: ${response.status}`);
            } else {
                console.log("Reservations updated");
                getAllReservations();
            }
        } catch (error) {
            // Network error or other exceptions
            console.error("Error making the API request:", error);
        }
    }

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
                        const currDate = reservation.date.split("T")[0];
                        return (
                            <div className={currClassName} key={idx}>
                                <div className="reservationItem-title">
                                    <div className='reservationItem-header'>
                                        {reservation.customerId !== 0 && <i className="fa-solid fa-user"></i>}
                                        <span>{reservation.user_name} ({reservation.seats})</span>
                                    </div>
                                    <div className='reservationItem-subheader'>
                                        <span>Date: {currDate}</span>
                                        <span>Time: {reservation.time}</span>
                                    </div>
                                </div>

                                <div className="reservationItem-buttons">
                                    {
                                        reservation.status !== "approved" &&
                                        <>
                                            <div className="reservationItem-button" onClick={() => updateReservation(reservation.id, "approved")}>
                                                Approve
                                            </div>
                                                <div className="reservationItem-button red" onClick={() => updateReservation(reservation.id, "rejected")}>
                                                Reject
                                            </div>
                                        </>
                                    }
                                    {
                                        reservation.status === "approved" &&
                                        <div className="reservationItem-button red" onClick={() => updateReservation(reservation.id, "cancelled")}>
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