import Header from "@/components/Header/Header";
import TopSellers from "@/components/Home/TopSellers";
import News from "@/components/Home/News"
import React from "react";

export default function Home() {
  return (
    <>
      <Header />
      <div className="page-container"><TopSellers /></div>
      <div className="page-container"><News /></div>
    </>
  );
}
