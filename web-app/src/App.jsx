import { useState } from 'react';
import './App.scss';
import Main from './components/main/Main';
import Sidebar from './components/sidebar/Sidebar';
import Tables from './components/tabs/tables/Tables';
import { ComponentDisplayContext } from './contexts/ComponentDisplayContext';

function App() {
  const [componentDisplayType, setComponentDisplayType] = useState(<Tables />);

  return (
    <div className="App">
      <ComponentDisplayContext.Provider value={{componentDisplayType, setComponentDisplayType}}>
        <Sidebar />
        <Main />
      </ComponentDisplayContext.Provider>
    </div>
  );
}

export default App;

// https://dribbble.com/shots/22643265-Admin-Dashboard?utm_source=Clipboard_Shot&utm_campaign=ismailkhan1122&utm_content=Admin%20Dashboard&utm_medium=Social_Share&utm_source=Clipboard_Shot&utm_campaign=ismailkhan1122&utm_content=Admin%20Dashboard&utm_medium=Social_Share

// tables (tab):
//  can be occupied, free
//  each table will have seating capactiy
//  each table will have orders

// reservations (tab):
//  for managing reservations

// orders:
//  orders will consist of items, price and quantity
//  each item will belong to a cuisine/type of food
//  add debouncing for searching the item
//  once the bill is generated the order details will be stored inside database
//  the bill will also consist of QR code that will lead to a mobile website where customers can enter rating for the ordered items

// online orders (tab):
//  create a mobile version for online orders
//  it will just place orders from mobile
//  orders can be accepted or rejected by the website

// menu (tab):
//  change availability or add or remove items
//  change today's special

// dashboard (tab):
//  will consist of statistics related to popular cuisine/food based on number of orders
//  also rating of food based on reviews submited for a particular item
//  stats related to peak hours based on occupied or reserved tables