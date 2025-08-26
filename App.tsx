
import React, { useState, useMemo } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { Transaction, Tab } from './types';
import Header from './components/Header';
import Tabs from './components/Tabs';
import Dashboard from './components/Dashboard';
import DataEntry from './components/DataEntry';
import Records from './components/Records';

const App: React.FC = () => {
    const [transactions, setTransactions] = useLocalStorage<Transaction[]>('expenseData', []);
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');

    const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
        setTransactions(prev => [...prev, { ...newTx, id: new Date().toISOString() + Math.random() }]);
        setActiveTab('records'); 
    };

    const handleDeleteTransaction = (id: string) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            setTransactions(prev => prev.filter(tx => tx.id !== id));
        }
    };

    const handleClearTransactions = () => {
        if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            setTransactions([]);
        }
    };

    const summary = useMemo(() => {
        const totalRidesAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);
        const totalPetrolExpense = transactions.reduce((sum, tx) => sum + tx.petrolExpense, 0);
        const netProfit = totalRidesAmount - totalPetrolExpense;
        return { totalRidesAmount, totalPetrolExpense, netProfit };
    }, [transactions]);


    return (
        <div className="bg-slate-50 min-h-screen text-slate-800 pb-24">
            <Header />
            <main className="container mx-auto px-4">
                <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

                <div className="mt-4">
                    {activeTab === 'dashboard' && <Dashboard transactions={transactions} summary={summary} />}
                    {activeTab === 'data' && <DataEntry onAddTransaction={handleAddTransaction} onClearTransactions={handleClearTransactions} summary={summary} />}
                    {activeTab === 'records' && <Records transactions={transactions} onDeleteTransaction={handleDeleteTransaction} summary={summary} />}
                </div>
            </main>
            <button
                onClick={() => setActiveTab('data')}
                className="fixed bottom-6 right-6 w-14 h-14 bg-violet-600 text-white rounded-2xl shadow-lg hover:bg-violet-700 active:bg-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50 flex items-center justify-center transition-transform transform hover:scale-105"
                aria-label="Add new entry"
            >
                <span className="material-icons text-3xl">add</span>
            </button>
        </div>
    );
};

export default App;
