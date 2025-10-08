import React, { useContext, useState, useEffect } from "react";
import ResortList from "../components/ResortList";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { user } = useContext(AuthContext);
  const [showAuth, setShowAuth] = useState(!user);

  useEffect(() => {
    if (user) setShowAuth(false);
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 via-purple-50 to-pink-50">
      <Header />
      <main className="flex-grow">
        <ResortList />
      </main>
      <Footer />
    </div>
  );
}
