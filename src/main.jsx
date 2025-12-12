// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import ErrorCatcher from "./ErrorCatcher";
import "./index.css";

const rootEl = document.getElementById("root");
if (!rootEl) {
    throw new Error("Could not find #root element in index.html");
}

const root = createRoot(rootEl);

root.render(
    <React.StrictMode>
         <BrowserRouter>
         <ErrorCatcher>
            <WishlistProvider>
                <CartProvider>
                    <App />
                </CartProvider>
            </WishlistProvider>
         </ErrorCatcher>
         </BrowserRouter>
    </React.StrictMode>
)


