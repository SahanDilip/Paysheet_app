import React, {useContext, useEffect} from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import "./landing.css"; 
import { HomeContext } from '../../Context/HomeContext';


const Landing = () => {
  
  const navigate = useNavigate();
  const { isAuthenticated , setIsAuthenticated} = useContext(HomeContext);

  // setIsAuthenticated(true);

  

  const handleLoginClick = () => {
    console.log("isAuthenticated", isAuthenticated);
    if (isAuthenticated) {

      navigate("/dashboard");
    }
    else {
      navigate("/login");
    }
  };



  return (
    <div
      className="landing-page"
      // style={{
      //   backgroundImage:"./assets/food_9.png" 
      // }}
    >
      <div className="full-overlay">
        <div className="overlay">
          <h1 className="title">Revolutionize Your Sales Experience with PointMaster</h1>
          <h2 className="subtitle">
            Streamline Transactions, Enhance Efficency, and Grow Your Business With Ease
          </h2>
          <Button type="primary" className="login-button" onClick={handleLoginClick}>
            Login as Cashier
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;