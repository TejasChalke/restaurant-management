import { useEffect, useRef, useState } from "react";
import Footer from "../footer/Footer";
import './Reservations.scss'

export default function Reservations(){
    const [reservations, setReservations] = useState([]);
    const [showReservationForm, setShowReservationForm] = useState(false);
    const countField = useRef();
    const dateField = useRef();
    const timeField = useRef();

    useEffect(() => {
        setReservations([])
    }, [])

    function hideForm() {
        countField.current.value = "";
        timeField.current.value = ""

        dateField.current.type = "text";
        dateField.current.value = "";
        dateField.current.type = "date";

        setShowReservationForm(false);
    }

    function bookReservation() {

    }

    const reservationFormClass = showReservationForm ? "active" : "";

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
                            <li className="reservationListItem">
                                <div className="reservationListItem-header">
                                    <div className="reservationListItem-title">
                                        REID{item.id}
                                    </div>
                                    <i className="fa-solid fa-ban"></i>
                                </div>
                                {item}
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