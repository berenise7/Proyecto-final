import AddBookFormik from "@/components/FormikComponents/AddBookFormik/AddBookFormik";
import HeaderAndSearch from "@/components/Header/HeaderAndSearch";
import React from "react";

export default function addBook() {
  return (
    <div>
      <HeaderAndSearch />
      <AddBookFormik />
    </div>
  );
}
