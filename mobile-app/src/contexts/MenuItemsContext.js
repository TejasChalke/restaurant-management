import { createContext } from "react";

export const MenuItemsContext = createContext({
    menuItems: [],
    setMenuItems: () => {}
});