// src/pages/Support.jsx
import React from "react";
import WhatsAppButton from "../components/WhatsAppButton";

export default function Support(){
  return (
    <main className="container">
      <h1>Support</h1>
      <p>If you need help, use the chat or WhatsApp button below.</p>
      <WhatsAppButton />
      {/* or embed your chat UI here */}
    </main>
  );
}

