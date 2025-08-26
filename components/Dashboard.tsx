
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Transaction, Summary } from '../types';
import { formatIndianCurrency } from '../utils/formatters';
import StatCard from './StatCard';

interface DashboardProps {
    transactions: Transaction[];
    summary: Summary;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, summary }) => {

    const todayStats = useMemo(() => {
        const today = new Date().toDateString();
        let earnings = 0;
        let petrol = 0;
        let rides = 0;

        transactions.forEach(tx => {
            if (new Date(tx.date).toDateString() === today) {
                earnings += tx.amount;
                petrol += tx.petrolExpense;
                rides++;
            }
        });
        return { earnings, petrol, profit: earnings - petrol, rides };
    }, [transactions]);

    const chartData = useMemo(() => {
        const last7Days: { date: string; profit: number; expense: number }[] = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('en-CA'); // YYYY-MM-DD
            last7Days.push({ date: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }), profit: 0, expense: 0 });

            transactions.forEach(tx => {
                if(new Date(tx.date).toLocaleDateString('en-CA') === dateStr) {
                    last7Days[6-i].profit += tx.amount - tx.petrolExpense;
                    last7Days[6-i].expense += tx.petrolExpense;
                }
            });
        }
        return last7Days;
    }, [transactions]);
    
    const pieChartData = [
        { name: 'Total Earnings', value: summary.totalRidesAmount },
        { name: 'Petrol Expenses', value: summary.totalPetrolExpense },
    ];
    if (summary.netProfit > 0) {
        pieChartData.push({ name: 'Net Profit', value: summary.netProfit });
    }

    const COLORS = ['#818cf8', '#f87171', '#4ade80'];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Today's Earnings" value={formatIndianCurrency(todayStats.earnings)} description={`From ${todayStats.rides} rides`} />
                <StatCard title="Today's Petrol" value={formatIndianCurrency(todayStats.petrol)} colorClass="text-red-500" />
                <StatCard title="Today's Profit" value={formatIndianCurrency(todayStats.profit)} colorClass={todayStats.profit >= 0 ? 'text-green-500' : 'text-red-500'} />
                <StatCard title="Total Profit" value={formatIndianCurrency(summary.netProfit)} colorClass={summary.netProfit >= 0 ? 'text-green-500' : 'text-red-500'} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h2 className="text-lg font-semibold mb-4 text-slate-700">Profit vs Expenses (Last 7 Days)</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value: number) => `₹${value/1000}k`} />
                            <Tooltip formatter={(value: number) => formatIndianCurrency(value)} />
                            <Legend iconSize={10} />
                            <Bar dataKey="profit" fill="#4ade80" name="Profit" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="expense" fill="#f87171" name="Petrol Expense" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                 <div className="bg-white p-4 rounded-xl shadow-sm">
                    <h2 className="text-lg font-semibold mb-4 text-slate-700">Earnings Distribution</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                {pieChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => formatIndianCurrency(value)} />
                            <Legend iconSize={10} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
