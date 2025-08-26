
import React from 'react';
import { Tab } from '../types';

interface TabsProps {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
}

const TabButton: React.FC<{ tabName: Tab; activeTab: Tab; onClick: (tab: Tab) => void; children: React.ReactNode }> = ({ tabName, activeTab, onClick, children }) => {
    const isActive = activeTab === tabName;
    return (
        <button
            onClick={() => onClick(tabName)}
            className={`px-4 py-3 text-sm md:text-base font-medium transition-colors duration-200 ${
                isActive
                    ? 'border-b-2 border-violet-600 text-violet-600'
                    : 'text-gray-500 hover:text-violet-500'
            }`}
        >
            {children}
        </button>
    );
};

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-2 md:space-x-4" aria-label="Tabs">
                <TabButton tabName="dashboard" activeTab={activeTab} onClick={setActiveTab}>
                    Dashboard
                </TabButton>
                <TabButton tabName="data" activeTab={activeTab} onClick={setActiveTab}>
                    Data Entry
                </TabButton>
                <TabButton tabName="records" activeTab={activeTab} onClick={setActiveTab}>
                    Records
                </TabButton>
            </nav>
        </div>
    );
};

export default Tabs;
