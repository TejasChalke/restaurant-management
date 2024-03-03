import { useNavigate } from 'react-router-dom';
import './Footer.scss'

export default function Footer(props){
    const navigate = useNavigate();
    const menuClass = props.tab === "menu" ? "footerOption selected" : "footerOption";
    const cartClass = props.tab === "cart" ? "footerOption selected" : "footerOption";
    const reservationClass = props.tab === "reservations" ? "footerOption selected" : "footerOption";
    const profileClass = props.tab === "profile" ? "footerOption selected" : "footerOption";

    return(
        <div id="footerContainer">
            <div className={menuClass}>
                <i className="fa-solid fa-book-open" onClick={() => navigate("/menu")}></i>
                <div className="small">
                    Menu
                </div>
            </div>
            <div className={cartClass}>
                <i className="fa-solid fa-cart-shopping" onClick={() => navigate("/cart")}></i>
                <div className="small">
                    Cart
                </div>
            </div>
            <div className={reservationClass}>
                <i className="fa-solid fa-calendar-days" onClick={() => navigate("/reservations")}></i>
                <div className="small">
                    Reservations
                </div>
            </div>
            <div className={profileClass}>
                <i className="fa-solid fa-user" onClick={() => navigate("/profile")}></i>
                <div className="small">
                    Profile
                </div>
            </div>
            
        </div>
    )
}