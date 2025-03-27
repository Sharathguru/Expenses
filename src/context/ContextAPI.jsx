import React, { createContext, useState, useEffect } from 'react';

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
    const [walletBalance, setWalletBalance] = useState(() => {
        const savedBalance = localStorage.getItem('walletBalance');
        return savedBalance ? JSON.parse(savedBalance) : 5000;
    });
    const [totalExpenses, setTotalExpenses] = useState(() => {
        const savedExpenses = localStorage.getItem('totalExpenses');
        return savedExpenses ? JSON.parse(savedExpenses) : 0;
    });
    const [expenses, setExpenses] = useState(() => {
        const savedExpenses = localStorage.getItem('expenses');
        return savedExpenses ? JSON.parse(savedExpenses) : [];
    });
    const [showIncomeModal, setShowIncomeModal] = useState(false);
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);

    useEffect(() => {
        localStorage.setItem('walletBalance', JSON.stringify(walletBalance));
    }, [walletBalance]);

    useEffect(() => {
        localStorage.setItem('totalExpenses', JSON.stringify(totalExpenses));
    }, [totalExpenses]);

    useEffect(() => {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }, [expenses]);

    const addIncome = (amount) => {
        setWalletBalance(walletBalance + amount);
    };

    const addExpense = (expense) => {
        setExpenses([...expenses, { ...expense, id: Date.now() }]);
        setTotalExpenses(totalExpenses + expense.amount);
        setWalletBalance(walletBalance - expense.amount);
    };

    const updateExpense = (updatedExpense) => {
        const previousExpense = expenses.find(expense => expense.id === updatedExpense.id);
        const updatedExpenses = expenses.map(expense =>
            expense.id === updatedExpense.id ? updatedExpense : expense
        );
        setExpenses(updatedExpenses);
        setTotalExpenses(updatedExpenses.reduce((acc, expense) => acc + expense.amount, 0));
        const balanceAdjustment = updatedExpense.amount - previousExpense.amount;
        setWalletBalance(walletBalance - balanceAdjustment);
    };

    const deleteExpense = (expenseId) => {
        const updatedExpenses = expenses.filter(expense => expense.id !== expenseId);
        setExpenses(updatedExpenses);
        setTotalExpenses(updatedExpenses.reduce((acc, expense) => acc + expense.amount, 0));
        setWalletBalance(5000 - updatedExpenses.reduce((acc, expense) => acc + expense.amount, 0));
    };

    const handleOpenIncomeModal = () => {
        setShowIncomeModal(true);
    };

    const handleCloseIncomeModal = () => {
        setShowIncomeModal(false);
    };

    const handleOpenExpenseModal = () => {
        if (walletBalance > 0 || editingExpense) {
            setShowExpenseModal(true);
        } else {
            alert("You can't add expenses when the wallet balance is 0.");
        }
    };

    const handleEditExpenseModal = (expense) => {
        setEditingExpense(expense);
        setShowExpenseModal(true);
    };

    const handleCloseExpenseModal = () => {
        setShowExpenseModal(false);
        setEditingExpense(null);
    };

    return (
        <ExpenseContext.Provider value={{
            walletBalance, totalExpenses, expenses, addIncome, addExpense, updateExpense, deleteExpense,
            showIncomeModal, showExpenseModal, handleOpenIncomeModal, handleCloseIncomeModal,
            handleOpenExpenseModal, handleCloseExpenseModal, editingExpense, setEditingExpense,
            handleEditExpenseModal
        }}>
            {children}
        </ExpenseContext.Provider>
    );
};
