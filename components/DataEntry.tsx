
import React, { useState } from 'react';
import { Transaction, Summary } from '../types';
import StatCard from './StatCard';
import { formatIndianCurrency } from '../utils/formatters';

interface DataEntryProps {
    onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    onClearTransactions: () => void;
    summary: Summary;
}

const DataEntry: React.FC<DataEntryProps> = ({ onAddTransaction, onClearTransactions, summary }) => {
    const [name, setName] = useState('');
    const [petrolExpense, setPetrolExpense] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !petrolExpense || !amount || !date) {
            alert('Please fill out all fields.');
            return;
        }
        onAddTransaction({
            name,
            petrolExpense: parseFloat(petrolExpense),
            amount: parseFloat(amount),
            date,
        });
        // Reset form
        setName('');
        setPetrolExpense('');
        setAmount('');
        setDate(new Date().toISOString().split('T')[0]);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold mb-4 text-slate-700 border-b pb-3">Add New Entry</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                         <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Driver Name</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500" placeholder="Enter driver name" />
                        </div>
                        <div>
                            <label htmlFor="petrolExpense" className="block text-sm font-medium text-gray-700 mb-1">Petrol Expense (₹)</label>
                            <input type="number" id="petrolExpense" value={petrolExpense} onChange={e => setPetrolExpense(e.target.value)} required step="0.01" min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500" placeholder="e.g., 500.00" />
                        </div>
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Ride Amount (₹)</label>
                            <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} required step="0.01" min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500" placeholder="e.g., 1250.50" />
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500" />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 pt-2">
                        <button type="submit" className="px-6 py-2.5 bg-violet-600 text-white font-medium text-sm leading-tight uppercase rounded-full shadow-md hover:bg-violet-700 hover:shadow-lg focus:bg-violet-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-violet-800 active:shadow-lg transition duration-150 ease-in-out">Add Entry</button>
                        <button type="button" onClick={onClearTransactions} className="px-6 py-2.5 bg-transparent text-red-600 font-medium text-sm leading-tight uppercase rounded-full border border-red-600 hover:bg-red-50 focus:outline-none focus:ring-0 transition duration-150 ease-in-out">Clear All Data</button>
                    </div>
                </form>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold mb-4 text-slate-700 border-b pb-3">Overall Summary</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <StatCard title="Total Rides Amount" value={formatIndianCurrency(summary.totalRidesAmount)} />
                    <StatCard title="Total Petrol Expense" value={formatIndianCurrency(summary.totalPetrolExpense)} colorClass="text-red-500" />
                    <StatCard title="Net Profit" value={formatIndianCurrency(summary.netProfit)} colorClass={summary.netProfit >= 0 ? 'text-green-500' : 'text-red-500'} />
                </div>
            </div>
        </div>
    );
};

export default DataEntry;
