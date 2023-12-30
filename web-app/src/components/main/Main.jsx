import './Main.scss'
import { useContext } from "react";
import { ComponentDisplayContext } from "../../contexts/ComponentDisplayContext";

export default function Main(){
    const componentDisplayContext = useContext(ComponentDisplayContext);

    return(
        <div id="main">
            { componentDisplayContext.componentDisplayType }
        </div>
    )
}