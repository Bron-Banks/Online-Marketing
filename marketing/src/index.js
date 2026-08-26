import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import AllPosts from "./components/Posts";
import ProfilePosts from "./components/Profile";
import NotFound from "./components/NotFound";

import ListPosts from "./components/posts/ListPosts";
import AddPost from "./components/posts/AddPost";
import EditPost from "./components/posts/EditPost";

import Signin from "./components/auth/Signin";
import Register from "./components/auth/Register";

import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css"
import "./index.css";

import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/js/all.min.js"

import PrivateRoute from "./components/auth/PrivateRoute";
/*lucky changes*/
import PostDetails from './components/PostDetails';
import "bootstrap/dist/css/bootstrap.min.css";
import Cart from "./components/ShoppingCart.js";
import ShippingDetails from "./components/shippingForm";
import Payment from "./components/payment";
import EditProfile from "./components/auth/EditProfile";
import AnswerPage from './components/posts/AnswerPage.js';
import { CartProvider } from "./context/CartContext";


export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route path="/" element={<AllPosts />} />
          <Route path="/posts/get/:id" element={<PostDetails />} />
          <Route path="posts/list" element={<ListPosts />} />
          <Route path="posts/add" element={ 
            <PrivateRoute>
              <AddPost />
            </PrivateRoute>} />
          <Route path="posts/edit/:id" element={
            <PrivateRoute>
              <EditPost />
            </PrivateRoute>} />
          <Route path="profile" element={
            <PrivateRoute>
              <ProfilePosts />
            </PrivateRoute>} />
          <Route path="users/signin" element={<Signin />} />
          <Route path="users/register" element={<Register />} />
          <Route path="/users/edit/:id" element={<EditProfile />} />
          <Route path="/questions/answer/:id" element={<AnswerPage />} />
          <Route path="*" element={<NotFound />} />
          <Route path="cart" element={<Cart />} />
          <Route path="shipping" element={<ShippingDetails />} />
          <Route path="payment" element={<Payment />} />
        </Route>
      </Routes>
      <Footer/>
      </CartProvider>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);