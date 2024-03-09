// load environment variables from .env file
const SERVER_ADDRESS = process.env.REACT_APP_SERVER_ADDRESS;

class DB {
    static async getAvailableMenuItems() {
        try {
            const response = await fetch(SERVER_ADDRESS + "/menu/get-available-menu", {
                method: "GET"
            })
    
            if (response.status < 200 || response.status > 299) {
                console.log(`Error getting available menu items from the database. Status: ${response.status}`);
                return null;
            } else {
                console.log("Menu values updated successfully");
                return await response.json();
            }
        } catch (error) {
            // Network error or other exceptions
            console.error("Error making the API request:", error);
            return null;
        }
    }
}

export default DB;