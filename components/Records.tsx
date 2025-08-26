
import React from 'react';
import { Transaction, Summary } from '../types';
import { formatIndianCurrency, formatDate } from '../utils/formatters';
import { exportToPdf, exportToCsv } from '../services/exportService';

interface RecordsProps {
    transactions: Transaction[];
    onDeleteTransaction: (id: string) => void;
    summary: Summary;
}

const Records: React.FC<RecordsProps> = ({ transactions, onDeleteTransaction, summary }) => {
    
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 border-b pb-3">
                <h2 className="text-lg font-semibold text-slate-700 mb-2 sm:mb-0">All Records</h2>
                <div className="flex space-x-2">
                    <button onClick={() => exportToPdf(sortedTransactions, summary)} className="px-4 py-2 text-xs font-medium text-violet-600 bg-violet-100 border border-transparent rounded-full hover:bg-violet-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition">
                        Export PDF
                    </button>
                    <button onClick={() => exportToCsv(sortedTransactions, summary)} className="px-4 py-2 text-xs font-medium text-violet-600 bg-violet-100 border border-transparent rounded-full hover:bg-violet-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition">
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Petrol Expense</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ride Amount</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedTransactions.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No records found. Add a new entry to get started!</td>
                            </tr>
                        ) : (
                            sortedTransactions.map(tx => {
                                const profit = tx.amount - tx.petrolExpense;
                                return (
                                    <tr key={tx.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tx.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(tx.date)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatIndianCurrency(tx.petrolExpense)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatIndianCurrency(tx.amount)}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {formatIndianCurrency(profit)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => onDeleteTransaction(tx.id)} className="text-red-500 hover:text-red-700">
                                                <span className="material-icons text-xl">delete_outline</span>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end mt-4">
                <div className="bg-violet-100 text-violet-800 font-bold p-3 rounded-lg text-sm">
                    Grand Total Profit: {formatIndianCurrency(summary.netProfit)}
                </div>
            </div>
        </div>
    );
};

export default Records;
