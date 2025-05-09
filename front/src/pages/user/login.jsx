import Footer from "@/components/Footer/Footer";
import UserLoginFormik from "@/components/FormikComponents/Login/UserLoginFormik";
import HeaderAndSearch from "@/components/Header/HeaderAndSearch";
import React from "react";

export default function login() {
  return (
    <>
      <HeaderAndSearch />
      <UserLoginFormik />
      <Footer />
    </>
  );
}
