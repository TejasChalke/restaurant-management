import './Profile.scss'
import Footer from '../footer/Footer';
import { useContext } from 'react';
import { UserDataContext } from '../../contexts/UserDataContext';

export default function Profile(){
    const {userData} = useContext(UserDataContext);
    console.log(userData);
    return(
        <div id="profileContainer">
            <div className="tabTitle">
                <div className="big">Profile</div>
            </div>
            <div id="profileForm">
                <div className="profileOption">
                    <div className="profileOption-header">
                        <span>Name</span>
                        <i className="fa-solid fa-pen"></i>
                    </div>
                    <div className="info">
                        {userData.name}
                    </div>
                </div>
                <div className="profileOption">
                    <div className="profileOption-header">
                        <span>Contact</span>
                        <i className="fa-solid fa-pen"></i>
                    </div>
                    <div className="info">
                        {userData.contact === "" ? "Please enter a mobile number" : userData.contact}
                    </div>
                </div>
                <div className="profileOption">
                    <div className="profileOption-header">
                        <span>Email</span>
                        <i className="fa-solid fa-pen"></i>
                    </div>
                    <div className="info">
                        {userData.email}
                    </div>
                </div>
                <div className="profileOption">
                    <div className="profileOption-header">
                        <span>Address</span>
                        <i className="fa-solid fa-pen"></i>
                    </div>
                    <div className="info">
                        {userData.address === "" ? "Please enter an address" : userData.address}
                    </div>
                </div>
                <div className="profileButton">
                    Save Changes
                </div>
            </div>
            <Footer tab="profile" />
        </div>
    )
}