import Header from "@/components/Header/Header";
import TopSellers from "@/components/Home/TopSellers";
import News from "@/components/Home/News"
import React from "react";
import Recommendations from "@/components/Home/Recommendations";
import HeaderAnsSearch from "@/components/Header/HeaderAndSearch";

export default function Home() {
  return (
    <>
      <HeaderAnsSearch />
      <div className="page-container"><TopSellers /></div>
      <div className="page-container"><News /></div>
      <div className="page-container"><Recommendations /></div>
    </>
  );
}
