import { jsPDF } from 'jspdf';
// FIX: Switched to functional usage of jspdf-autotable to resolve module augmentation error.
import autoTable from 'jspdf-autotable';
import { Transaction, Summary } from '../types';
import { formatIndianCurrency, formatDate } from '../utils/formatters';

// FIX: The module augmentation is no longer required and was causing the error.
// declare module 'jspdf' {
//   interface jsPDF {
//     autoTable: (options: any) => jsPDF;
//   }
// }

export const exportToPdf = (transactions: Transaction[], summary: Summary) => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Expense & Profit Report', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 14, 29);

    doc.setFontSize(14);
    doc.text('Summary', 14, 45);
    doc.setFontSize(11);
    doc.text(`Total Rides Amount: ${formatIndianCurrency(summary.totalRidesAmount)}`, 14, 52);
    doc.text(`Total Petrol Expense: ${formatIndianCurrency(summary.totalPetrolExpense)}`, 14, 59);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Net Profit: ${formatIndianCurrency(summary.netProfit)}`, 14, 66);
    doc.setFont('helvetica', 'normal');

    const tableData = transactions.map(item => {
        const profit = item.amount - item.petrolExpense;
        return [
            item.name,
            formatDate(item.date),
            formatIndianCurrency(item.petrolExpense),
            formatIndianCurrency(item.amount),
            formatIndianCurrency(profit),
        ];
    });

    // FIX: Switched to functional call of autoTable to resolve module augmentation error.
    autoTable(doc, {
        startY: 75,
        head: [['Driver Name', 'Date', 'Petrol Expense', 'Ride Amount', 'Profit']],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: [109, 40, 217], // violet-600
            textColor: [255, 255, 255],
            fontStyle: 'bold',
        },
        styles: {
            cellPadding: 3,
            fontSize: 9,
        },
    });

    doc.save('expense_report.pdf');
};

export const exportToCsv = (transactions: Transaction[], summary: Summary) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Driver Name,Date,Petrol Expense (INR),Ride Amount (INR),Profit (INR)\n";

    transactions.forEach(item => {
        const profit = item.amount - item.petrolExpense;
        const row = [item.name, formatDate(item.date), item.petrolExpense, item.amount, profit].join(",");
        csvContent += row + "\r\n";
    });

    csvContent += "\r\n";
    csvContent += "Summary\r\n";
    csvContent += `Total Rides Amount,${summary.totalRidesAmount}\r\n`;
    csvContent += `Total Petrol Expense,${summary.totalPetrolExpense}\r\n`;
    csvContent += `Net Profit,${summary.netProfit}\r\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "expense_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
