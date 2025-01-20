import React, { useState, useContext } from 'react';
import { Button, Modal, notification, Input } from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
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

  const [orderId, setOrderId] = useState('');
  const [deliveryAgent, setDeliveryAgent] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Helper to group items by item_id
  const getConsolidatedItems = (items) => {
    return items.reduce((acc, item) => {
      if (!acc[item.item_id]) {
        acc[item.item_id] = { ...item, totalQuantity: item.quantity };
      } else {
        acc[item.item_id].totalQuantity += item.quantity;
      }
      return acc;
    }, {});
  };

  // Generate PDF with improved structure
  const generatePDF = (consolidatedItems) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Bill Receipt', 105, 20, { align: 'center' });

    // Add Order and Bill Details
    doc.setFontSize(12);
    doc.text(`Order ID: ${orderId || 'N/A'}`, 20, 40);
    doc.text(`Delivery Agent: ${deliveryAgent || 'N/A'}`, 20, 50);
    doc.text(`Total Amount: Rs. ${totalAmount.toFixed(2)}`, 20, 60);
    doc.text(`Discount: Rs. ${totalDiscount.toFixed(2)}`, 20, 70);
    doc.text(
      `Payable Amount (incl. tax): Rs. ${(((totalAmount * 105) / 100) - totalDiscount).toFixed(2)}`,
      20,
      80
    );

    // Add Table Header
    let yPosition = 100;
    doc.text('Items:', 20, yPosition);
    yPosition += 10;
    doc.text('No.', 20, yPosition);
    doc.text('Item Name', 40, yPosition);
    doc.text('Qty', 120, yPosition);
    doc.text('Unit Price', 140, yPosition);
    doc.text('Total', 180, yPosition);

    // Add Items Data
    yPosition += 10;
    Object.values(consolidatedItems).forEach((item, index) => {
      const totalPrice = (item.price * item.totalQuantity).toFixed(2);
      doc.text(`${index + 1}`, 20, yPosition);
      doc.text(`${item.name || ''}`, 40, yPosition);
      doc.text(`${item.totalQuantity}`, 120, yPosition);
      doc.text(`Rs.${parseFloat(item.price).toFixed(2)}`, 140, yPosition);
      doc.text(`Rs.${totalPrice}`, 180, yPosition);
      yPosition += 10;
    });

    // Save PDF
    doc.save('Bill_Receipt.pdf');
  };

  // Handle Add Order ID
  const handleSetOrderId = () => {
    setOrderId(orderId);
    setIsModalVisible(false);
  };

  // Handle Complete Payment
  const handleCompletePayment = async () => {
    const consolidatedItems = getConsolidatedItems(selectedItems);

    try {
      // Simulating API call
      const response = { ok: true }; // Replace with actual API call
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
          <strong>Order ID:</strong> {orderId || 'N/A'}
        </div>
        <div className="info-item">
          <strong>Bill Total:</strong> Rs.{totalAmount.toFixed(2)}
        </div>
        <div className="info-item">
          <strong>Tax Amount:</strong> Rs.{((totalAmount * 5) / 100).toFixed(2)}
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
      <button onClick={() => setIsModalVisible(true)} className="add-customer-btn">
        <PlusOutlined /> Add Order ID
      </button>
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
        disabled={!deliveryAgent || !orderId}
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
      <Modal
        title="Order ID"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Input
          placeholder="Enter your Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        <Button
          type="primary"
          onClick={handleSetOrderId}
          style={{ backgroundColor: '#414141', borderColor: 'black' }}
        >
          Add Order ID
        </Button>
      </Modal>
    </div>
  );
}
