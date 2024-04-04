import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Footer from "../footer/Footer";
import './Reservations.scss'
import { UserDataContext } from "../../contexts/UserDataContext";

// load environment variables from .env file
const SERVER_ADDRESS = process.env.REACT_APP_SERVER_ADDRESS;
const LOCAL_STORAGE_ALIAS = process.env.REACT_APP_LOCAL_STORAGE_ALIAS;

export default function Reservations(){
    const { userData } = useContext(UserDataContext);
    const [reservations, setReservations] = useState([]);
    const [showReservationForm, setShowReservationForm] = useState(false);
    const countField = useRef();
    const dateField = useRef();
    const timeField = useRef();

    const getReservations = useCallback(async () => {
        const data = {
            user_id: userData.id
        }

        try {
            const tempStorage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ALIAS));
            const storageUsers = tempStorage.users;
            const accessToken = storageUsers.filter(user => user.id === userData.id)[0].accessToken;

            const response = await fetch(SERVER_ADDRESS + "/reservation/user-reservations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify(data),
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
    }, [userData.id])

    useEffect(() => {
        getReservations();
    }, [getReservations])


    function hideForm() {
        countField.current.value = "";
        timeField.current.value = ""

        dateField.current.type = "text";
        dateField.current.value = "";
        dateField.current.type = "date";

        setShowReservationForm(false);
    }

    async function bookReservation() {
        let seats = countField.current.value.trim();
        const reservationDate = dateField.current.value;
        let reservationTime = timeField.current.value;

        for(let c of seats) {
            if(c <= '0' || c >= '9') {
                console.log("Enter a valid seat number");
                return;
            }
        }

        if(reservationDate.length === 0 || reservationTime.length === 0) {
            console.log("Enter a valid date and time");
            return;
        }

        seats = parseInt(seats);
        reservationTime += ":00";
        
        const data = {
            seats: seats,
            time: reservationTime,
            date: reservationDate,
            user_id: userData.id
        }

        try {
            const tempStorage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ALIAS));
            const storageUsers = tempStorage.users;
            const accessToken = storageUsers.filter(user => user.id === userData.id)[0].accessToken;

            const response = await fetch(SERVER_ADDRESS + "/reservation/new-reservation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify(data),
            })
            
            if (response.status < 200 || response.status > 299) {
                // If the response status is not in the range 200-299
                console.log(`Error adding reservation to the database. Status: ${response.status}`);
            } else {
                console.log("Reservation requested.");
                
                getReservations();
                // close the form
                hideForm();
            }
        } catch (error) {
            // Network error or other exceptions
            console.error("Error making the API request:", error);
        }
    }

    const reservationFormClass = showReservationForm ? "active" : "";
    console.log(reservations);

    return(
        <div id="reservationsContainer">
            <div className="tabTitle">
                <div className="big">Reservations</div>
            </div>
            <div id="addReservationButton" onClick={() => setShowReservationForm(true)}>
                <i className="fa-solid fa-plus"></i>
                <span>Book Table</span>
            </div>
            <ul id="reservationsList">
                <li id="reservationListTitle">Your Reservations</li>
                {
                    reservations.map((item, index) => {
                        return (
                            <li className="reservationListItem" key={index}>
                                <div className="reservationListItem-header">
                                    <div className="reservationListItem-title">
                                        REID{item.id}
                                    </div>
                                    <i className="fa-solid fa-ban"></i>
                                </div>
                                <div className="reservationListItem-cell">
                                    <span className="reservationListItem-bold">Seats</span>
                                    <span>{item.seats}</span>
                                </div>
                                <div className="reservationListItem-cell">
                                    <span className="reservationListItem-bold">Status</span>
                                    <span>{item.status}</span>
                                </div>
                                <div className="reservationListItem-cell">
                                    <span className="reservationListItem-bold">Date</span>
                                    <span>{item.date.split("T")[0]}</span>
                                </div>
                                <div className="reservationListItem-cell">
                                    <span className="reservationListItem-bold">Time</span>
                                    <span>{item.time}</span>
                                </div>
                            </li>
                        )
                    })
                }
                {
                    reservations.length === 0 &&
                    <div id="reservationListEmpty">
                        You have no booked reservations.
                    </div>
                }
            </ul>

            <div id="reservationForm" className={reservationFormClass}>
                <div id="reservationFormTitle">Add Details</div>
                <div className="reservationFormGroup">
                    <span>Table for: </span>
                    <input type="text" ref={countField} />
                </div>
                <div className="reservationFormGroup">
                    <span>Date: </span>                    
                    <input type="date" ref={dateField} />
                </div>
                <div className="reservationFormGroup">
                    <span>Time: </span>
                    <input type="time" ref={timeField} />
                </div>

                <div id="reservationFormButtons">
                    <div className="reservationFormButton" onClick={bookReservation}>
                        Submit
                    </div>
                    <div className="reservationFormButton" onClick={hideForm}>
                        Cancel
                    </div>
                </div>
            </div>
            <Footer tab="reservations" />
        </div>
    )
}