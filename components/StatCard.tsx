
import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    description?: string;
    colorClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, colorClass = 'text-slate-800' }) => {
    return (
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="text-sm text-slate-500">{title}</div>
            <div className={`text-2xl font-bold my-1 ${colorClass}`}>{value}</div>
            {description && <div className="text-xs text-slate-400">{description}</div>}
        </div>
    );
};

export default StatCard;
