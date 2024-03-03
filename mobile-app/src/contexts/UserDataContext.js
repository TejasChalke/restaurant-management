import { createContext } from "react";

export const UserDataContext = createContext({
    userData: {
        id: -1,
        name: "",
        contact: "",
        email: "",
        address: ""
    },
    setUserData: () => {}
});