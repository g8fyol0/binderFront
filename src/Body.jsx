import React from "react";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

const Body = () => {
  return (
    <div>
      <NavBar />
      {/* any childern routes of body will render here  */}
      <Outlet />
      <Footer> </Footer>
    </div>
  );
};

export default Body;
