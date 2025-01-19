import React, { useState, useContext, useEffect } from 'react';
import { Modal, Input, Button } from 'antd';
import { PlusOutlined, MinusOutlined, CloseOutlined, CheckOutlined, ArrowRightOutlined, PauseOutlined, QrcodeOutlined } from "@ant-design/icons";
import axios from 'axios';
import { notification } from 'antd';
import { HomeContext } from '../../../Context/HomeContext';
import './rightcontent.css';
import baseUrl from '../../../../apiConfig';
// import WebcamQrScanner from "react-webcam-qr-scanner";




export default function RightContent() {
  const {isQRCodeVisible,
    setIsQRCodeVisible,
    searchValue,
    setSearchValue,
    selectedItems, 
    removeItem, 
    increaseQuantity, 
    decreaseQuantity, 
    customerDetails, 
    customerSelected, 
    handleCustomerSelection, 
    resetCustomerSelection, 
    setRightContent, 
    resetTransaction,
    setTotalAmount,
    setTotalDiscount,
    holdBillData,
    increaseQuantityHold,
    decreaseQuantityHold,
    removeItemHold,
  } = useContext(HomeContext);
  
  const [totalAmount, setLocalTotalAmount] = useState(0);
  const [totalDiscount, setLocalTotalDiscount] = useState(0); 
  const [loading, setLoading] = useState(false); 
  


  useEffect(() => {
    let amount = 0;
    let discountSum = 0;
  
    selectedItems.forEach(item => {
      const price = item.price || 0; 
      const quantity = item.quantity || 1;
      const discountPerItem = (item.discount || 0) * quantity;
      discountSum += discountPerItem;
      amount += price * quantity;
    });
  
    setLocalTotalAmount(amount);
    setLocalTotalDiscount(discountSum);
    setTotalAmount(amount);
    setTotalDiscount(discountSum);
  
  }, [selectedItems, holdBillData, setTotalAmount, setTotalDiscount]);

  const handleProceed = () => {
    setRightContent('PaymentMethods');
  };

  const handleHoldPayment = async () => {
    const billData = {
      payment_method: 'on-hold', 
      total_amount: totalAmount,
      items_list: selectedItems.map(item => ({
        item_id: item.item_id,
        category_id: item.category_id,
        price: item.price,
        quantity: item.quantity || 1,
      })),
      loyalty_points_redeemed: 0,  
      discount: totalDiscount,
      received: 0,
      notes: 'payment on hold', 
      customer_phone: customerDetails.phoneNumber,
      status: false,
    };

    try {

      const token = await fetchToken();
      const response = await fetch(`${baseUrl}:3003/cashier/bill/new-bill`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(billData),
      });
      
      if (response.ok) {
        notification.success({
          message: 'Bill got hold',
          description: 'The bill has been hold!',
          duration: 3, 
        });
        resetTransaction();
        setRightContent('RightContent');
      } else {
        alert('Error creating bill');
      }
    } catch (error) {
      console.error('Error creating bill:', error);
      alert('Error creating bill');
    }
  };

  return (
    <div className='content-right'>
      <div className='add-customer'>
        Cart Items
      </div>
      <div className='selected-items'>
            <div>
              {selectedItems.map((item, index) => {
                const price = item.price || 0; 
                const quantity = item.quantity || 1;
                const discountPerItem = (item.discount || 0) * quantity;
                const total = (quantity * price).toFixed(2);

                return (
                  <div className='selected-item-card' key={index}>
                    <div className='item-name'>{item.name}</div>
                    <div className='item-details'>
                      <span className='item-price'>
                        {isNaN(price) ? 'Invalid Price' : `${item.price} / unit`}
                      </span>
                      <div className='quantity-controls'>
                        <button onClick={() => decreaseQuantity(index)}><MinusOutlined /></button>
                        <span>{quantity}</span>
                        <button onClick={() => increaseQuantity(index)}><PlusOutlined /></button>
                      </div>
                      <span className='item-discount'>
                        {`Discount: Rs.${discountPerItem.toFixed(2)}`}
                      </span>
                      <span className='item-total'>
                        {isNaN(total) ? 'Invalid Total' : `Rs.${total}`}
                      </span>
                    </div>
                    <button className='remove-item' onClick={() => removeItem(index)}><CloseOutlined /></button>
                  </div>
                );
              })}
            </div>
    </div>
        <div className='order-summary'>
          <div className='summary-row'>
            <span>Bill Total:</span>
            <span>Rs.{totalAmount.toFixed(2)}</span>
          </div>
        </div>
        <div className='order-actions'>
          <button className='proceed' onClick={handleProceed}><CheckOutlined /> Proceed</button>
        </div>
    </div>
  );
}