import React from 'react';
import './App.css';
import AddAmt from './components/AddAmt';
import TopExpData from './components/TopExpData';

const App = () => {
    return (
        <div>
            <header>
                <h1>Expense Tracker</h1>
            </header>
            <section className='expense-data'>
                <AddAmt />
            </section>
            <section className='top-expense-data'>
                <TopExpData />
            </section>
        </div>
    );
};

export default App;