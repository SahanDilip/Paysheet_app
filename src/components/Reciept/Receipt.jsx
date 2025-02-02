import React from 'react';
import jsPDF from 'jspdf';

const ReceiptPDF = ({items,orderId,deliveryAgent,totalAmount,totalDiscount,}) => {
const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Gray Kitchen Restaurant LLC', 105, 20, { align: 'center' });

    // Contact Info
    doc.setFontSize(12);
    doc.text('TEL: +971501184002', 20, 30);
    doc.text('Web: https://www.graykitchens.com', 20, 40);
    doc.text('Email: accounts@graykitchens.com', 20, 50);
    doc.text('VAT NO: 100021452500003', 20, 60);

    // Bill Receipt Title
    doc.setFontSize(14);
    doc.text('Bill Receipt', 105, 80, { align: 'center' });

    // Add Order and Delivery Details
    doc.text(`Delivery Agent: ${deliveryAgent || 'N/A'}`, 20, 100);
    doc.text(`Order ID: ${orderId || 'N/A'}`, 20, 110);

    // Add Items Section
    let yPosition = 130;
    doc.text('Items:', 20, yPosition);
    yPosition += 10;

    items.forEach((item, index) => {
      const totalPrice = (item.price * item.quantity).toFixed(2);
      doc.text(
        `${index + 1}. ${item.name} - ${item.price} AED x ${item.quantity} = ${totalPrice} AED`,
        20,
        yPosition
      );
      yPosition += 10;
    });

    // Add Financial Summary
    yPosition += 10;
    doc.text(`Amount: ${totalAmount.toFixed(2)} AED`, 20, yPosition);
    yPosition += 10;
    doc.text(`Discount: ${totalDiscount.toFixed(2)} AED`, 20, yPosition);
    yPosition += 10;
    const vat = (totalAmount * 0.05).toFixed(2);
    doc.text(`VAT: ${vat} AED`, 20, yPosition);
    yPosition += 10;
    const payable = (totalAmount + parseFloat(vat) - totalDiscount).toFixed(2);
    doc.text(`Payable Amount: ${payable} AED`, 20, yPosition);

    // Thank You Message
    yPosition += 20;
    doc.setFontSize(14);
    doc.text('Thank You', 105, yPosition, { align: 'center' });

    // Save PDF
    doc.save('Bill_Receipt.pdf');
  };
};

export default ReceiptPDF;
