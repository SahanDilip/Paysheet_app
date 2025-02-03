import React, { useState, useContext } from 'react';
import { Button, Modal, notification, Input } from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { HomeContext } from '../../../Context/HomeContext';
import jsPDF from 'jspdf';
import './PaymentMethod.css';
import { logos } from './../../../assets/assets';
import { delivary_agents } from './../../../assets/assets';

export default function PaymentMethods() {
  const {
    totalAmount,
    totalDiscount,
    selectedItems,
    resetTransaction,
    setRightContent,
    setTotalDiscount
  } = useContext(HomeContext);

  const [orderId, setOrderId] = useState('');
  const [deliveryAgent, setDeliveryAgent] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDiscountModalVisible, setIsDiscountModalVisible] = useState(false);

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

  const generatePDF = (consolidatedItems) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const centerX = pageWidth / 2;


    // Add Image (Ensure it's a Base64 string or a valid local file path)
    const imgWidth = 50; // Adjust image width
    const imgHeight = 20; // Adjust image height
    const imgX = centerX - imgWidth / 2; // Center align
    const imgY = 10; // Adjust Y position

    // Add Full Page Border
    const borderMargin = 5; // Adjust margin for the border
    doc.rect(borderMargin, borderMargin, pageWidth - 2 * borderMargin, pageHeight - 2 * borderMargin);
    
    doc.addImage(logos.gray_kitchen_logo, 'PNG', imgX, imgY, imgWidth, imgHeight); // Replace with actual image source

    // Title
    doc.setFontSize(16);
    doc.text('Gray Kitchen Restaurant LLC', centerX, 40, { align: 'center' });

    // Contact Info
    doc.setFontSize(12);
    doc.text('TEL: +971501184002', centerX, 50, { align: 'center' });
    doc.text('Web: https://www.graykitchens.com', centerX, 60, { align: 'center' });
    doc.text('Email: accounts@graykitchens.com', centerX, 70, { align: 'center' });
    doc.text('VAT NO: 100021452500003', centerX, 80, { align: 'center' });

    // Bill Details
    doc.setFontSize(14);
    doc.text('Bill Receipt', centerX, 90, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Delivery Agent:`, 60, 100);
    doc.text(`${deliveryAgent || 'N/A'}`, 100, 100);
    doc.text(`Order ID:`, 60, 110);
    doc.text(`${orderId || 'N/A'}`, 100, 110);

    // Items Section
    let yPosition = 130;
    doc.text('Items:', 20, yPosition);
    yPosition += 10;

    Object.values(consolidatedItems).forEach((item, index) => {
      const totalPrice = (item.price * item.totalQuantity).toFixed(2);
      doc.text(
        `${index + 1}. ${item.name} - ${item.price} AED x ${item.totalQuantity}`,
        centerX - 70,
        yPosition
      );
      doc.text(`= ${totalPrice} AED`, 150, yPosition);
      yPosition += 10;
    });

    // Financial Summary
    yPosition += 10;
    const xLabel = 60;
    const xEqual = 105;
    const xValue = 120;

    const vat = totalAmount * 0.05;
    const totdiscount = (totalAmount * totalDiscount) / 100;
    const amountWithVAT = totalAmount + vat;
    const discountAmount = (totalDiscount / 100) * amountWithVAT;
    const payableAmount = amountWithVAT - discountAmount;
    
    doc.text('Amount:', xLabel, yPosition);
    doc.text('=', xEqual, yPosition);
    doc.text(`${totalAmount.toFixed(2)} AED`, xValue, yPosition);
    yPosition += 10;
    
    doc.text('VAT:', xLabel, yPosition);
    doc.text('=', xEqual, yPosition);
    doc.text(`${vat.toFixed(2)} AED`, xValue, yPosition);
    yPosition += 10;
    
    doc.text('Amount with VAT:', xLabel, yPosition);
    doc.text('=', xEqual, yPosition);
    doc.text(`${amountWithVAT.toFixed(2)} AED`, xValue, yPosition);
    yPosition += 10;
    
    doc.text('Discount:', xLabel, yPosition);
    doc.text('=', xEqual, yPosition);
    doc.text(`${discountAmount.toFixed(2)} AED`, xValue, yPosition);
    yPosition += 10;
    
    doc.text('Payable Amount:', xLabel, yPosition);
    doc.text('=', xEqual, yPosition);
    doc.text(`${payableAmount.toFixed(2)} AED`, xValue, yPosition);
    
    // Thank You Message
    yPosition += 20;
    doc.setFontSize(14);
    doc.text('Thank You', centerX, yPosition, { align: 'center' });
    
    doc.save('Bill_Receipt.pdf');
    
  };

  const handleSetOrderId = () => {
    if (orderId.trim()) {
      setIsModalVisible(false);
    }
  };

  const applyDiscountAndGeneratePDF = () => {
    setIsDiscountModalVisible(false);
    const consolidatedItems = getConsolidatedItems(selectedItems);
    try {
      // Generate and download the PDF
      generatePDF(consolidatedItems);

      notification.success({
        message: 'Bill Created',
        description: 'The bill has been created successfully!',
        duration: 3,
      });

      // Reset transaction and UI
      resetTransaction();
      setRightContent('RightContent');
    } catch (error) {
      console.error('Error creating bill:', error);
      notification.error({
        message: 'Error',
        description: 'There was an error creating the bill.',
        duration: 3,
      });
    }
  };

  const handleCompletePayment = () => {
    setIsDiscountModalVisible(true);
  };

  const renderPaymentInfo = () => {
    const vatAmount = (totalAmount * 0.05);
    const totalWithVat = totalAmount + vatAmount;
    const finalAmount = totalWithVat - (totalWithVat*totalDiscount)/100;

    return (
      <div className="payment-info-container">
        <h3 className="sub-topic">Bill Information</h3>
        <div className="payment-info">
          <div className="info-item">
            <strong>Order ID:</strong> {orderId || 'N/A'}
          </div>
          <div className="info-item">
            <strong>Bill Total:</strong> AED {totalAmount.toFixed(2)}
          </div>
          <div className="info-item">
            <strong>Tax Amount:</strong> AED {vatAmount.toFixed(2)}
          </div>
          <div className="info-item">
            <strong>Bill After Tax:</strong> AED {totalWithVat.toFixed(2)}
          </div>
          <div className="info-item">
            <strong>Discount:</strong> AED {(totalWithVat.toFixed(2)*totalDiscount.toFixed(2))/100 || '0'}
          </div>
          <div className="info-item">
            <strong>Payable Amount:</strong> AED {finalAmount.toFixed(2)}
          </div>
          <div className="info-item">
            <strong>Delivery Agent:</strong> {deliveryAgent || 'N/A'}
          </div>
        </div>
      </div>
    );
  };

  const renderTransportMethods = () => (
    <div className="payment-methods-container">
      <h3 className="sub-topic">Transport Methods</h3>
      <div className="payment-method-buttons">
          {['Talabat', 'Outlet', 'Noon', 'Diliveroo', 'Careem'].map((agent) => {
            // Normalize agent name to match keys in `delivary_agents`
            const agentKey = agent.toLowerCase() + '_logo';

            return (
              <Button
                key={agent}
                className={`payment-button ${deliveryAgent === agent ? 'selected' : ''}`}
                type={deliveryAgent === agent ? 'primary' : 'default'}
                onClick={() => setDeliveryAgent(agent)}
                style={{
                  backgroundImage: `url(${delivary_agents[agentKey]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  width: '80px', // Adjust width
                  height: '80px', // Adjust height
                  color: 'white', // Ensure text contrast
                  border: deliveryAgent === agent ? '2px solid #000' : '1px solid #ccc',
                }}
              >
              </Button>
            );
          })}
        </div>;
      <Button
        onClick={() => setIsModalVisible(true)}
        className="add-customer-btn"
        icon={<PlusOutlined />}
      >
        Add Order ID
      </Button>
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

      <Modal
        title="Apply Discount"
        open={isDiscountModalVisible}
        onCancel={() => setIsDiscountModalVisible(false)}
        footer={null}
      >
        <Input
          placeholder="Enter Discount Amount"
          value={totalDiscount}
          type="number"
          onChange={(e) => setTotalDiscount(parseFloat(e.target.value))}
          style={{ marginBottom: '10px' }}
        />
        <Button
          type="primary"
          onClick={applyDiscountAndGeneratePDF}
          style={{ backgroundColor: '#414141', borderColor: 'black' }}
        >
          Apply Discount & Generate PDF
        </Button>
      </Modal>
    </div>
  );
}