import './Sidebar.scss'

export default function Sidebar(){
    return(
        <div id="sidebar">
            <div id="title">
                <i className="fa-solid fa-martini-glass-citrus"></i>
                <span>RESTRO</span>
            </div>
            <div className="sidebar-item active">Tables</div>
            <div className="sidebar-item">Reservations</div>
            <div className="sidebar-item">Online Orders</div>
            <div className="sidebar-item">Menu</div>
            <div className="sidebar-item">Dashboard</div>
        </div>
    )
}