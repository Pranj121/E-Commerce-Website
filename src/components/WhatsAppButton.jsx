// src/components/WhatsAppButton.jsx
import React from "react";

function WhatsAppButton() {
  // Your WhatsApp number (ONLY digits)
  const phoneNumber = "918082052523";  // <-- replace with your number

  // Prefilled message
  const message = encodeURIComponent("Hi! I have a question about BookBazaar 📚");

  // Final WhatsApp link
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  const handleClick = () => {
    window.open(whatsappUrl, "_blank");
  };

  return (
    <button className="whatsapp-fab" onClick={handleClick}>
      💬 Chat on WhatsApp
    </button>
  );
}

export default WhatsAppButton;
