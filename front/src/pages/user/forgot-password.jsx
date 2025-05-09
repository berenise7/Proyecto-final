import Footer from "@/components/Footer/Footer";
import ForgotPasswordFormik from "@/components/FormikComponents/ForgotPassword/ForgotPasswordFormik";
import HeaderAndSearch from "@/components/Header/HeaderAndSearch";
import React from "react";

export default function ForgotPassword() {
  return (
    <>
      <HeaderAndSearch />
      <ForgotPasswordFormik />
      <Footer />
    </>
  );
}
