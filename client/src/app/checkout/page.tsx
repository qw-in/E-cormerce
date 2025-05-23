"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import CheckoutSuspense from "./checkoutSkeleton";

function CheckoutPage() {
    const options = {
        clientId:
            "AUWaNg2g7fs4ENySQuqtTyvXk1yI8eWxn-xcYQsnkA3xfYyoS0ulYW5-SGtTt2fPkmiu8yzBCvapR6uo",
    };
    return (
        <PayPalScriptProvider options={options}>
            <CheckoutSuspense />
        </PayPalScriptProvider>
    );
}

export default CheckoutPage;
