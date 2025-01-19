import React, { useState, useContext } from 'react';
import { Button, Input, notification } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { HomeContext } from '../../../Context/HomeContext';
import jsPDF from 'jspdf';
import './PaymentMethod.css';

export default function PaymentMethods() {
  const {
    totalAmount,
    totalDiscount,
    selectedItems,
    resetTransaction,
    setRightContent,
  } = useContext(HomeContext);

  const [deliveryAgent, setDeliveryAgent] = useState('');

  // Helper to group items by item_id
  const getConsolidatedItems = (items) => {
    const groupedItems = items.reduce((acc, item) => {
      if (!acc[item.item_id]) {
        acc[item.item_id] = { ...item, totalQuantity: item.quantity };
      } else {
        acc[item.item_id].totalQuantity += item.quantity;
      }
      return acc;
    }, {});
    return Object.values(groupedItems);
  };

  // Generate PDF
  const generatePDF = (consolidatedItems) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Bill Receipt', 20, 20);

    // Add Bill Details
    doc.setFontSize(12);
    doc.text(`Total Amount: Rs. ${totalAmount.toFixed(2)}`, 20, 40);
    doc.text(`Discount: Rs. ${totalDiscount.toFixed(2)}`, 20, 50);
    doc.text(
      `Payable Amount: Rs. ${(((totalAmount * 105) / 100) - totalDiscount).toFixed(2)}`,
      20,
      60
    );
    doc.text(`Delivery Agent: ${deliveryAgent || 'N/A'}`, 20, 70);

    // Add Items
    let yPosition = 90;
    doc.text('Items:', 20, yPosition);
    yPosition += 10;

    consolidatedItems.forEach((item, index) => {
      const totalPrice = (item.price * item.totalQuantity).toFixed(2);
      const price = parseFloat(item.price); // Ensure price is a number
      doc.text(
        `${index + 1}. ${item.name || ''} - ${item.item_id}: Rs.${price.toFixed(
          2
        )} x ${item.totalQuantity} = Rs.${totalPrice}`,
        20,
        yPosition
      );
      yPosition += 10;
    });

    // Save PDF
    doc.save('Bill_Receipt.pdf');
  };

  // Handle Complete Payment
  const handleCompletePayment = async () => {
    const consolidatedItems = getConsolidatedItems(selectedItems);

    try {
      // Simulating API call
      const response = { ok: true }; // Replace this with actual API call
      if (response.ok) {
        notification.success({
          message: 'Bill Created',
          description: 'The bill has been created successfully!',
          duration: 3,
        });

        // Generate and download the PDF
        generatePDF(consolidatedItems);

        // Reset transaction and UI
        resetTransaction();
        setRightContent('RightContent');
      } else {
        throw new Error('Failed to create bill');
      }
    } catch (error) {
      console.error('Error creating bill:', error);
      notification.error({
        message: 'Error',
        description: 'There was an error creating the bill.',
        duration: 3,
      });
    }
  };

  // Render Payment Info
  const renderPaymentInfo = () => (
    <div className="payment-info-container">
      <h3 className="sub-topic">Bill Information</h3>
      <div className="payment-info">
        <div className="info-item">
          <strong>Bill Total:</strong> Rs.{totalAmount.toFixed(2)}
        </div>
        <div className="info-item">
          <strong>Bill After Tax:</strong> Rs.{((totalAmount * 105) / 100).toFixed(2)}
        </div>
        <div className="info-item">
          <strong>Discount:</strong> Rs.{totalDiscount.toFixed(2)}
        </div>
        <div className="info-item">
          <strong>Payable Amount:</strong>{' '}
          Rs.{(((totalAmount * 105) / 100) - totalDiscount).toFixed(2)}
        </div>
        <div className="info-item">
          <strong>Delivery Agent:</strong> {deliveryAgent || 'N/A'}
        </div>
      </div>
    </div>
  );

  // Render Transport Methods
  const renderTransportMethods = () => (
    <div className="payment-methods-container">
      <h3 className="sub-topic">Transport Methods</h3>
      <div className="payment-method-buttons">
        {['Thalabath', 'Outlet', 'Noon', 'Kaath', 'Nanban'].map((agent) => (
          <Button
            key={agent}
            className="payment-button"
            type="primary"
            onClick={() => setDeliveryAgent(agent)}
          >
            {agent}
          </Button>
        ))}
      </div>
      <Button
        type="primary"
        className="complete-payment"
        onClick={handleCompletePayment}
        disabled={!deliveryAgent}
      >
        Complete Payment
      </Button>
    </div>
  );

  return (
    <div className="payment-methods">
      <div className="header">
        <h2 className="payment-summary">Payment Summary</h2>
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => setRightContent('RightContent')}
          className="back-button"
        >
          Back to Items
        </Button>
      </div>
      <div className="payment-container">
        {renderPaymentInfo()}
        {renderTransportMethods()}
      </div>
    </div>
  );
}
