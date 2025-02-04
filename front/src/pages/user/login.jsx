import UserLoginFormik from "@/components/FormikComponents/Login/UserLoginFormik";
import Header from "@/components/Header/Header";
import React from "react";

export default function login() {
  return (
    <>
      <Header />
      <UserLoginFormik />
    </>
  );
}
