import React, { useState } from 'react';

export default function Salad() {
  // Dummy data for food items
  const foodItems = [
    { id: 1, name: 'Greek Salad', price: 5.0 },
    { id: 2, name: 'Caesar Salad', price: 7.5 },
    { id: 3, name: 'Garden Salad', price: 6.0 },
    { id: 4, name: 'Pasta Salad', price: 8.0 },
  ];

  const [bill, setBill] = useState([]);

  // Function to handle quantity change
  const handleQuantityChange = (item, quantity) => {
    const qty = parseInt(quantity) || 0;
    const existingItem = bill.find((b) => b.id === item.id);

    if (qty > 0) {
      if (existingItem) {
        // Update the quantity and total price if the item is already in the bill
        setBill(
          bill.map((b) =>
            b.id === item.id ? { ...b, quantity: qty, total: qty * item.price } : b
          )
        );
      } else {
        // Add new item to the bill
        setBill([...bill, { ...item, quantity: qty, total: qty * item.price }]);
      }
    } else {
      // Remove the item from the bill if the quantity is 0
      setBill(bill.filter((b) => b.id !== item.id));
    }
  };

  // Calculate total price
  const totalPrice = bill.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="flex flex-col md:flex-row justify-between p-6 bg-gray-100 min-h-screen">
      {/* Food Items Section */}
      <div className="w-full md:w-2/3 bg-white p-6 shadow-md rounded-md">
        <h2 className="text-2xl font-semibold text-green-600 mb-4">Talabath Salad</h2>
        {foodItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b py-4"
          >
            <span className="text-lg font-medium">{item.name}</span>
            <span className="text-green-600 font-semibold">${item.price.toFixed(2)}</span>
            <input
              type="number"
              min="0"
              placeholder="Qty"
              className="w-16 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => handleQuantityChange(item, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Bill Section */}
      <div className="w-full md:w-1/3 bg-white p-6 shadow-md rounded-md mt-6 md:mt-0 md:ml-6">
        <h2 className="text-2xl font-semibold text-green-600 mb-4">Bill</h2>
        {bill.length > 0 ? (
          <>
            {bill.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b py-4"
              >
                <span className="text-lg">
                  {item.name} x {item.quantity}
                </span>
                <span className="text-green-600 font-semibold">
                  ${item.total.toFixed(2)}
                </span>
              </div>
            ))}
            <hr className="my-4" />
            <h3 className="text-xl font-bold">
              Total: <span className="text-green-600">${totalPrice.toFixed(2)}</span>
            </h3>
          </>
        ) : (
          <p className="text-gray-500">No items in the bill</p>
        )}
      </div>
    </div>
  );
}
