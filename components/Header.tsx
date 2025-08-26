
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-violet-600 text-white p-4 shadow-md mb-4">
            <div className="container mx-auto">
                <h1 className="text-2xl font-bold">Expense & Profit Tracker</h1>
                <p className="text-sm text-violet-200">Track your rides, petrol expenses, and profits in Indian Rupees</p>
            </div>
        </header>
    );
};

export default Header;
