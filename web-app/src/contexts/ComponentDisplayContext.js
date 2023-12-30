import { createContext } from "react";
import Tables from "../components/tabs/tables/Tables";

export const ComponentDisplayContext = createContext({
    componentDisplayType: <Tables />,
    setComponentDisplayType: () => {}
})