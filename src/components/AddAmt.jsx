import React, { useState, Fragment, useContext, useEffect } from 'react';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import { ExpenseContext } from '../context/ContextAPI';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddAmt = () => {
    const {
        walletBalance, totalExpenses, expenses, addIncome, addExpense, updateExpense,
        showIncomeModal, showExpenseModal, handleOpenIncomeModal, handleCloseIncomeModal,
        handleOpenExpenseModal, handleCloseExpenseModal, editingExpense
    } = useContext(ExpenseContext);

    const [inputAmount, setInputAmount] = useState('');
    const [expenseTitle, setExpenseTitle] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [expenseCategory, setExpenseCategory] = useState('food');
    const [expenseDate, setExpenseDate] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (editingExpense) {
            setExpenseTitle(editingExpense.title);
            setExpenseAmount(editingExpense.amount);
            setExpenseCategory(editingExpense.category);
            setExpenseDate(editingExpense.date);
        } else {
            setExpenseTitle('');
            setExpenseAmount('');
            setExpenseCategory('select_category'); // Set default value to 'select_category'
            setExpenseDate('');
        }
    }, [editingExpense]);

    const handleAddIncome = () => {
        if (!inputAmount) {
            setError('Please enter an amount.');
            return;
        }
        addIncome(parseInt(inputAmount));
        setInputAmount('');
        setError('');
        handleCloseIncomeModal();
    };

    const handleAddExpense = () => {
        if (!expenseTitle || !expenseAmount || !expenseCategory || !expenseDate) {
            setError('Please fill in all fields.');
            return;
        }
        const expenseAmt = parseInt(expenseAmount);
        const currentDate = new Date();
        const expenseDateObj = new Date(expenseDate);
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(currentDate.getDate() - 3);

        if (expenseDateObj > currentDate || expenseDateObj < threeDaysAgo) {
            toast.error("You can only add expenses for today or the past three days.");
            return;
        }

        const newExpense = {
            title: expenseTitle,
            amount: expenseAmt,
            category: expenseCategory,
            date: expenseDate
        };

        let newWalletBalance = walletBalance;
        if (editingExpense) {
            const previousAmount = editingExpense.amount;
            if (expenseAmt > previousAmount && (expenseAmt - previousAmount) > walletBalance) {
                toast.error("You can't increase the expense amount beyond the available wallet balance.");
                return;
            }
            updateExpense({ ...newExpense, id: editingExpense.id });
            newWalletBalance -= (expenseAmt - previousAmount);
        } else {
            if (expenseAmt > walletBalance) {
                toast.error("You can't add an expense greater than the wallet balance.");
                return;
            }
            addExpense(newExpense);
            newWalletBalance -= expenseAmt;
        }
        setExpenseTitle('');
        setExpenseAmount('');
        setExpenseCategory('food');
        setExpenseDate('');
        setError('');
        handleCloseExpenseModal();

        if (newWalletBalance === 0) {
            toast.warn("Warning: You have spent your entire wallet balance.");
        } else if (newWalletBalance < 1000) {
            toast.warn(`Warning: Your wallet balance is less than ₹1000. Current balance: ₹${newWalletBalance}`);
        } else if (totalExpenses + expenseAmt < 1000) {
            toast.warn(`Warning: Your total expenses are less than ₹1000. Current total expenses: ₹${totalExpenses + expenseAmt}`);
        }
    };

    const handleInputChange = (e) => {
        setInputAmount(e.target.value);
    };

    const handleExpenseTitleChange = (e) => {
        setExpenseTitle(e.target.value);
    };

    const handleExpenseAmountChange = (e) => {
        setExpenseAmount(e.target.value);
    };

    const handleExpenseCategoryChange = (e) => {
        setExpenseCategory(e.target.value);
    };

    const handleExpenseDateChange = (e) => {
        setExpenseDate(e.target.value);
    };

    const COLORS = {
        food: '#ED213A',
        bills: '#606c88',
        entertainment: '#56CCF2',
        transport: '#FDC830',
        '(U,G,S,O)': 'blue', 
        healthcare: '#8A2BE2',
        education: '#FFD700'
    };

    const data = expenses.reduce((acc, expense) => {
        const existingCategory = acc.find(item => item.name === expense.category);
        if (existingCategory) {
            existingCategory.value += expense.amount;
        } else {
            acc.push({ name: expense.category, value: expense.amount });
        }
        return acc;
    }, []);

    const sortedData = [...data].sort((a, b) => b.value - a.value);

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

        return (
            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <Fragment>
           <section className='bothAmt'>   
                <aside className='data-feed addAmt'>
                    <p style={{color:"blue"}}>Wallet Balance: <strong>&#8377;{walletBalance}</strong></p>
                    <button className='amt-btn btn-add' onClick={handleOpenIncomeModal}>Add Income</button>
                </aside>

                <aside className='data-feed addExpense'>
                    <p style={{color:"red"}}>Expense: <strong>&#8377;{totalExpenses}</strong></p>
                    <button className='amt-btn btn-exp' onClick={handleOpenExpenseModal}>Add Expense</button>
                </aside>
           </section>

            <div className={`modal ${showIncomeModal ? 'show' : ''}`} style={{ display: showIncomeModal ? 'block' : 'none' }}>
                <div className="modal-content">
                    <span className="close" onClick={handleCloseIncomeModal}>&times;</span>
                    <div className="modal-title">Add Amount</div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <input 
                        type="number" 
                        className="modal-input" 
                        placeholder="Enter amount" 
                        value={inputAmount} 
                        onChange={handleInputChange} 
                    />
                    <div className="modal-buttons">
                        <button className="modal-button add" onClick={handleAddIncome}>Add</button>
                        <button className="modal-button cancel" onClick={handleCloseIncomeModal}>Cancel</button>
                    </div>
                </div>
            </div>

            <div className={`modal ${showExpenseModal ? 'show' : ''}`} style={{ display: showExpenseModal ? 'block' : 'none' }}>
                <div className="modal-content">
                    <span className="close" onClick={handleCloseExpenseModal}>&times;</span>
                    <div className="modal-title">{editingExpense ? 'Edit Expense' : 'Add Expense'}</div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <input 
                        type="text" 
                        className="modal-input" 
                        placeholder="Enter title" 
                        value={expenseTitle} 
                        onChange={handleExpenseTitleChange} 
                    />
                    <input 
                        type="number" 
                        className="modal-input" 
                        placeholder="Enter amount" 
                        value={expenseAmount} 
                        onChange={handleExpenseAmountChange} 
                    />
                    <select 
                        className="modal-input" 
                        value={expenseCategory} 
                        onChange={handleExpenseCategoryChange}
                        style={{ backgroundColor: 'white', color: 'black' }}
                    >
                        <option value="select_category">Select Category</option>
                        <option value="food">Food</option>
                        <option value="bills">Bills</option> 
                        <option value="entertainment">Entertainment</option>
                        <option value="transport">Transport</option>
                        <option value="(U,G,S,O)">(U,G,S,O)</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="education">Education</option>
                    </select>
                    <input 
                        type="date" 
                        className="modal-input" 
                        value={expenseDate} 
                        onChange={handleExpenseDateChange} 
                        style={{ backgroundColor: 'white', color: 'black' }}
                    />
                    <div className="modal-buttons">
                        <button className="modal-button add" onClick={handleAddExpense}>{editingExpense ? 'Update Expense' : 'Add Expense'}</button>
                        <button className="modal-button cancel" onClick={handleCloseExpenseModal}>Cancel</button>
                    </div>
                </div>
            </div>

            <div className="chart-container">
                <PieChart width={280} height={280}>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="55%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius="85%"
                        fill="#8884d8"
                        dataKey="value"
                        className='pie-data'
                        stroke="none" 
                        strokeWidth={0}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name]} stroke="none" strokeWidth={0} />
                        ))}
                    </Pie>
                    <Legend verticalAlign="bottom" />
                </PieChart>
            </div>
            <ToastContainer />
        </Fragment>
    );
};

export default AddAmt;