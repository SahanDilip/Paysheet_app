import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { HomeContext } from '../../../Context/HomeContext';
import './Leftcontent.css';
import baseUrl from '../../../../apiConfig';
import {assets} from '../../../assets/assets'

export default function LeftContent() {
  const { handleAddItem , isAuthenticated} = useContext(HomeContext);
  const [categories] = useState([
    { category_id: 1, category_name: 'Soup' },
    { category_id: 2, category_name: 'Salad' },
    { category_id: 3, category_name: 'Cold Appetizers' },
    { category_id: 4, category_name: 'Hot Appetizers' },
    { category_id: 5, category_name: 'Daily Dish - Beef & Lamb' },
    { category_id: 6, category_name: 'Daily Dish - Chicken' },
    { category_id: 7, category_name: 'Side Dishes' },
    { category_id: 8, category_name: 'Desserts' },
    { category_id: 9, category_name: 'Juices & Drinks' },
    { category_id: 10, category_name: 'Boxes' }, // Added Boxes
  ]);
  const [selectedCategory, setSelectedCategory] = useState(
    categories.length > 0 ? categories[0].category_id : null
  );
  const [foodItems, setFoodItems] = useState([]);

  const categoryData = {
    'Soup': [
      { item_id: 1, name: 'Lentil Soup', price: '14.00' },
      { item_id: 2, name: 'French Onion Soup', price: '14.00' },
      { item_id: 3, name: 'Freekeh Soup', price: '14.00' },
      { item_id: 4, name: 'Potato & Leek Soup', price: '14.00' },
      { item_id: 5, name: 'Creamy Chicken Mushroom Soup', price: '18.00' },
    ],
    'Salad': [
      { item_id: 6, name: 'Caesar Salad', price: '19.00' },
      { item_id: 7, name: 'Rocca & Zaatar', price: '19.00' },
      { item_id: 8, name: 'Tabouleh', price: '19.00' },
      { item_id: 9, name: 'Mediterranean Quinoa Salad', price: '19.00' },
      { item_id: 10, name: 'Grilled Eggplant Salad', price: '19.00' },
      { item_id: 11, name: 'Fattoush', price: '22.00' },
      { item_id: 12, name: 'Greek Salad', price: '22.00' },
    ],
    'Cold Appetizers': [
      { item_id: 13, name: 'Hummus', price: '19.00' },
      { item_id: 14, name: 'Mutabal', price: '21.00' },
    ],
    'Hot Appetizers': [
      { item_id: 15, name: 'Fried Kibbeh - By Piece', price: '7.00' },
      { item_id: 16, name: 'Chicken Rolls - 3 Pieces', price: '18.00' },
      { item_id: 17, name: 'Hummus With Meat', price: '35.00' },
    ],
    'Daily Dish - Beef & Lamb': [
      { item_id: 18, name: 'Kibbeh Bil Laban', price: '45.00' },
      { item_id: 19, name: 'Spinach Stew', price: '45.00' },
      { item_id: 20, name: 'Loubieh Bil Lahme', price: '45.00' },
      { item_id: 21, name: 'Bazella Bil Lahme', price: '45.00' },
      { item_id: 22, name: 'Bamieh Bil Lahme', price: '45.00' },
      { item_id: 23, name: 'Daoud Basha', price: '45.00' },
      { item_id: 24, name: 'Kafta & Batata', price: '45.00' },
      { item_id: 25, name: 'Kibbeh Bil Saynieh', price: '50.00' },
      { item_id: 26, name: 'Oriental Lamb Shank', price: '58.00' },
    ],
    'Daily Dish - Chicken': [
      { item_id: 27, name: 'Chicken Tawouk Plate', price: '45.00' },
      { item_id: 28, name: 'Riz A Djej', price: '45.00' },
      { item_id: 29, name: 'Grilled Chicken Breast', price: '45.00' },
      { item_id: 30, name: 'Kebab Plate', price: '45.00' },
      { item_id: 31, name: 'Djej W Batata', price: '45.00' },
      { item_id: 32, name: 'Penne Mushroom Cream', price: '45.00' },
    ],
    'Side Dishes': [
      { item_id: 33, name: 'Mashed Potato', price: '12.00' },
      { item_id: 34, name: 'French Fries & Ketchup', price: '12.00' },
      { item_id: 35, name: 'Wedges Potato & Ketchup', price: '12.00' },
      { item_id: 36, name: 'Vermicelli Rice', price: '12.00' },
      { item_id: 37, name: 'Mansaf Rice', price: '12.00' },
      { item_id: 38, name: 'Freekih', price: '14.00' },
      { item_id: 39, name: 'Burgul Vermicelli', price: '14.00' },
      { item_id: 40, name: 'Oriental Rice', price: '15.00' },
    ],
    'Desserts': [
      { item_id: 41, name: 'Chocolate Cake Jar', price: '22.00' },
      { item_id: 42, name: 'Baklawa & Fresh Kashta, sugar syrup', price: '22.00' },
      { item_id: 43, name: 'Kunafa & pistachio cheesecake', price: '22.00' },
      { item_id: 44, name: 'Apricots Mouhalabiah', price: '22.00' },
    ],
    'Juices & Drinks': [
      { item_id: 45, name: 'Fresh Orange Juice', price: '18.00' },
      { item_id: 46, name: 'Fresh Lemon Mint Juice', price: '16.00' },
      { item_id: 47, name: 'Laban Ayran', price: '9.00' },
      { item_id: 48, name: 'Pepsi', price: '7.00' },
      { item_id: 49, name: 'Diet Pepsi', price: '7.00' },
      { item_id: 50, name: 'Mirinda', price: '7.00' },
      { item_id: 51, name: '7 Up', price: '7.00' },
      { item_id: 52, name: 'Mountain Dew', price: '7.00' },
      { item_id: 53, name: 'Diet 7up', price: '7.00' },
      { item_id: 54, name: 'Sparkling Water', price: '13.00' },
    ],
    'Boxes': [
      { item_id: 55, name: 'Grilled Chicken Breast', price: '55.00' },
      { item_id: 56, name: 'Chicken Taouk Plate', price: '55.00' },
      { item_id: 57, name: 'Warak Enab & Koussa', price: '60.00' },
      { item_id: 58, name: 'Bamieh Bil Lahme', price: '55.00' },
      { item_id: 59, name: 'Riz a Djej', price: '55.00' },
      { item_id: 60, name: 'Penne Mushroom Cream', price: '55.00' },
      { item_id: 61, name: 'Bazella Bil Lahme', price: '55.00' },
      { item_id: 62, name: 'Koussa Mahshi', price: '58.00' },
      { item_id: 63, name: 'Jordanian Manssaf', price: '85.00' },
      { item_id: 64, name: 'Loubieh Bil Lahme', price: '55.00' },
      { item_id: 65, name: 'Oriental Lamb Shank', price: '65.00' },
      { item_id: 66, name: 'Kebab Plate', price: '55.00' },
      { item_id: 67, name: 'Kibbeh Bil Saynieh', price: '60.00' },
      { item_id: 68, name: 'Daoud Basha', price: '55.00' },
      { item_id: 69, name: 'Kafta & Betata', price: '55.00' },
      { item_id: 70, name: 'Kibbeh Bil Laban', price: '60.00' },
      { item_id: 71, name: 'Spinach Stew', price: '55.00' },
      { item_id: 72, name: 'Djej W Batata', price: '55.00' },
    ]
  };

  const getImageSrc = (item) => {
    if (assets[`food_${item.item_id}`]) {
      return assets[`food_${item.item_id}`];
    } else if (assets['food_10']) {
      return assets['food_14'];
    } else {
      return 'placeholder.png';
    }
  };
  

  
  const fetchToken = async () => {
    return localStorage.getItem('accessToken');
  };

  useEffect(() => {
    if (categories.length > 0 && selectedCategory === null) {
      setSelectedCategory(categories[0].category_id);
    }
  }, [categories, selectedCategory]);
  
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (selectedCategory !== null) {
          const categoryName = categories.find(cat => cat.category_id === selectedCategory)?.category_name;
          if (categoryName) {
            setFoodItems(categoryData[categoryName] || []);
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
  
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [selectedCategory, isAuthenticated, categories]);
  

  const handleCategoryClick = (category) => {
    setSelectedCategory(category.category_id);
  };

  return (
    <div className='content-left'>
      <div className='top-rectangle'>
        <div className='category-buttons'>
          {categories.length > 0 ? (
            categories.map((category) => (
              <button
                key={category.category_id}
                onClick={() => handleCategoryClick(category)}
                className={selectedCategory === category.category_id ? 'selected' : ''}
              >
                {category.category_name}
              </button>
            ))
          ) : (
            <p>No categories available.</p>
          )}
        </div>
      </div>
      <div className='food-cards'>
        {foodItems.length > 0 ? (
          foodItems.map((item, index) => (
            <div className='food-card' key={index} onClick={() => handleAddItem(item)}>
              {/* <img 
                src={ assets[`food_${item.item_id}`] || 'placeholder.png'}  
                alt={item.item_name || 'Food item'} 
              /> */}
              <img 
                  src={getImageSrc(item)} 
                  alt={item.name || 'Food item'} 
                />      
              <div className='food-details'>
                <div className='food-name'>{item.name || 'Unknown item'}</div>
                <div className='food-price'>
                  {item.price ? ` AED. ${item.price}` : 'Price not available'} 
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No food items available.</p>
        )}
      </div>
    </div>
  );
}