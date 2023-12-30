import { useContext, useState } from 'react'
import './Sidebar.scss'
import { ComponentDisplayContext } from '../../contexts/ComponentDisplayContext'
import Tables from '../tabs/tables/Tables';
import Reservation from '../tabs/reservation/Reservation';
import OnlineOrders from '../tabs/online orders/OnlineOrders';
import Menu from '../tabs/menu/Menu';
import Dashboard from '../tabs/dashboard/Dashboard';

export default function Sidebar(){
    const componentDisplayContext = useContext(ComponentDisplayContext);
    const [tablesClass, setTablesClass] = useState("sidebar-item active");
    const [reservationsClass, setReservationsClass] = useState("sidebar-item");
    const [onlineOrdersClass, setOnlineOrdersClass] = useState("sidebar-item");
    const [menuClass, setMenuClass] = useState("sidebar-item");
    const [dashboardClass, setDashboardClass] = useState("sidebar-item");
    
    function changeTab(type){
        // reset the active tab
        setTablesClass("sidebar-item");
        setReservationsClass("sidebar-item");
        setOnlineOrdersClass("sidebar-item");
        setMenuClass("sidebar-item");
        setDashboardClass("sidebar-item");
        
        // change the active tab
        switch(type){
            case "Tables":
                componentDisplayContext.setComponentDisplayType(<Tables />);
                setTablesClass("sidebar-item active");
                break;
            case "Reservations":
                componentDisplayContext.setComponentDisplayType(<Reservation />);
                setReservationsClass("sidebar-item active");
                break;
            case "Online Orders":
                componentDisplayContext.setComponentDisplayType(<OnlineOrders />);
                setOnlineOrdersClass("sidebar-item active");
                break;
            case "Menu":
                componentDisplayContext.setComponentDisplayType(<Menu />);
                setMenuClass("sidebar-item active");
                break;
            case "Dashboard":
                componentDisplayContext.setComponentDisplayType(<Dashboard />);
                setDashboardClass("sidebar-item active");
                break;
            default:
                break;
        }
    }

    return(
        <div id="sidebar">
            <div id="title">
                <i className="fa-solid fa-martini-glass-citrus"></i>
                <span>RESTRO</span>
            </div>
            <div className={tablesClass} onClick={() => changeTab("Tables")}>Tables</div>
            <div className={reservationsClass} onClick={() => changeTab("Reservations")}>Reservations</div>
            <div className={onlineOrdersClass} onClick={() => changeTab("Online Orders")}>Online Orders</div>
            <div className={menuClass} onClick={() => changeTab("Menu")}>Menu</div>
            <div className={dashboardClass} onClick={() => changeTab("Dashboard")}>Dashboard</div>
        </div>
    )
}