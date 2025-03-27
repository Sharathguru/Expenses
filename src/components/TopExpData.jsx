import React, { Fragment, useContext, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ExpenseContext } from '../context/ContextAPI';
import { FaUtensils, FaReceipt, FaFilm, FaCar, FaQuestion, FaTools, FaEdit, FaTrash, FaHeartbeat, FaBook } from 'react-icons/fa';

const TopExpData = () => {
    const { expenses, deleteExpense, handleEditExpenseModal } = useContext(ExpenseContext);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const data = expenses.reduce((acc, expense) => {
        const existingCategory = acc.find(item => item.name === expense.category);
        if (existingCategory) {
            existingCategory.amount += expense.amount;
        } else {
            acc.push({ name: expense.category, amount: expense.amount });
        }
        return acc;
    }, []).sort((a, b) => b.amount - a.amount);

    const COLORS = {
        food: '#ED213A',
        bills: '#606c88',
        entertainment: '#56CCF2',
        transport: '#FDC830',
        '(U,G,S,O)': 'blue', 
        healthcare: '#8A2BE2',
        education: '#FFD700'
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip" style={{ backgroundColor: 'white', color: 'black', padding: '5px', borderRadius: '5px' }}>
                    <p className="label">{`${payload[0].payload.name} : ₹${payload[0].payload.amount}`}</p>
                </div>
            );
        }
        return null;
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(expenses.length / itemsPerPage);
    const currentExpenses = expenses
        .sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            const today = new Date().setHours(0, 0, 0, 0);
            if (dateA.setHours(0, 0, 0, 0) === today && dateB.setHours(0, 0, 0, 0) !== today) {
                return -1;
            }
            if (dateA.setHours(0, 0, 0, 0) !== today && dateB.setHours(0, 0, 0, 0) === today) {
                return 1;
            }
            return dateB - dateA;
        })
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'food':
                return <FaUtensils color={COLORS.food} />;
            case 'bills':
                return <FaReceipt color={COLORS.bills} />;
            case 'entertainment':
                return <FaFilm color={COLORS.entertainment} />;
            case 'transport':
                return <FaCar color={COLORS.transport} />;
            case '(U,G,S,O)':
                return <FaTools color={COLORS['(U,G,S,O)']} />;
            case 'healthcare':
                return <FaHeartbeat color={COLORS.healthcare} />;
            case 'education':
                return <FaBook color={COLORS.education} />;
            default:
                return <FaQuestion color='#000' />;
        }
    };

    const handleEdit = (expense) => {
        handleEditExpenseModal(expense);
    };

    const handleDelete = (expenseId) => {
        deleteExpense(expenseId);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <Fragment>
            <section className='recent-expenses'>
                <h2 style={{textAlign:"left"}}>Recent Transactions</h2>
                {currentExpenses.length > 0 ? (
                    <main id='expense-list'>
                        {currentExpenses.map((expense, index) => (
                            <div key={index} className='expense-card'>
                                <aside className='CTD'>
                                    <div className='category-icon'>
                                        {getCategoryIcon(expense.category)}
                                    </div>
                                    <div className='expense-details'>
                                        <article>{expense.title}</article>
                                        <p style={{fontSize:"0.8rem",color:"gray"}}>{formatDate(expense.date)}</p>
                                    </div>
                                </aside>
                                <aside className='ExpEditDel'>
                                    <b>₹{expense.amount}</b>
                                    <button style={{background:"rgb(248, 93, 15)"}} onClick={() => handleEdit(expense)}><FaEdit /></button>
                                    <button onClick={() => handleDelete(expense.id)}><FaTrash /></button>
                                </aside>
                            </div>
                        ))}
                    </main>
                ) : (
                    <div style={{ backgroundColor: 'white', color: 'black', padding: '3rem 1rem', textAlign: 'center', borderRadius: '0.6rem' }}>
                        No expense to show
                    </div>
                )}
                {expenses.length > itemsPerPage && (
                    <div className="pagination">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button key={index} onClick={() => handlePageChange(index + 1)} className={currentPage === index + 1 ? 'active' : ''}>
                                {index + 1}
                            </button>
                        ))}
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                            Next
                        </button>
                    </div>
                )}
            </section>
            <section className='top-expense-graph'>
            <h2>Top Expenses</h2>
            {data.length > 0 ? (
                <div className="bar-chart-container">
                    <ResponsiveContainer width="90%" height={250}>
                        <BarChart data={data} layout="vertical" margin={{ top: 20, right:0, left: 60, bottom: 5 }}>
                            <CartesianGrid stroke="none" />
                            <XAxis type="number" dataKey="amount" stroke="black" />
                            <YAxis type="category" dataKey="name" stroke="black" />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="amount" fill="#8884d8" barSize={20}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div style={{ backgroundColor: 'white', color: 'black', padding: ' 2rem 1rem', textAlign: 'center', borderRadius: '0.6rem' }}>
                    No expense data available
                </div>
            )}
            </section>
        </Fragment>
    );
};

export default TopExpData;
