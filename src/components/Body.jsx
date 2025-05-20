import React, { useEffect } from "react";
import NavBar from "./NavBar";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector, useStore } from "react-redux";
import { addUser } from "../utils/userSlice";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //for preventing frequent api calls on page loads like /porfile etc due to fetchuser
  const userData = useSelector((store) => {
    store.user;
  });

  const fetchUser = async () => {
    if (userData) return;
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });

      dispatch(addUser(res.data));
    } catch (err) {
      if (err.status === 401) {
        navigate("/login");
      }
      console.error(err);
    }
  };
  //when componet loads we will fetch the user
  useEffect(() => {
    fetchUser();
  }, []);
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
