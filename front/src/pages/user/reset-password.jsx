import Footer from "@/components/Footer/Footer";
import ResetPasswordFormik from "@/components/FormikComponents/ForgotPassword/ResetPasswordFormik";
import HeaderAndSearch from "@/components/Header/HeaderAndSearch";
import React from "react";

export default function ResetPassword() {
  return (
    <div>
      <HeaderAndSearch />
      <ResetPasswordFormik />
      <Footer />
    </div>
  );
}
