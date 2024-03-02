import { useLocation } from 'react-router-dom'
import './Profile.scss'

export default function Profile(){
    const {state} = useLocation();
    console.log(state);
    return(
        <div id="profileContainer">
            Profile
            {state.name}
            {state.address}
        </div>
    )
}