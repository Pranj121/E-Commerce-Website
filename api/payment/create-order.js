import Razorpay from "razorpay";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  console.log('[create-order] start', new Date().toISOString());
  console.log('[create-order] method:', req.method);
  console.log('[create-order] headers:', {
    host: req.headers.host,
    origin: req.headers.origin,
    'user-agent': req.headers['user-agent'],
  });
  console.log('[create-order] body:', req.body);
  console.log('[create-order] RAZORPAY_KEY_ID present:', !!process.env.RAZORPAY_KEY_ID);

  function maskKey(k) {
    if (!k) return null;
    if (k.length <= 8) return k;
    return `${k.slice(0, 4)}...${k.slice(-4)}`;
  }

  // Log auth details (key_id shown in full; secret masked by default)
  console.log('[create-order] Razorpay key_id:', process.env.RAZORPAY_KEY_ID);
  console.log('[create-order] Razorpay key_secret (masked):', maskKey(process.env.RAZORPAY_KEY_SECRET));
  if (process.env.LOG_RAZORPAY_SECRET === 'true') {
    console.warn('[create-order] WARNING: LOG_RAZORPAY_SECRET=true — logging full secret to console');
    console.log('[create-order] Razorpay key_secret (FULL):', process.env.RAZORPAY_KEY_SECRET);
  }
  console.log('[create-order] NODE_ENV:', process.env.NODE_ENV);

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    console.log('[create-order] creating Razorpay instance');

    const options = {
      amount: 50000, // ₹500 in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    console.log('[create-order] order options:', {
      amount: options.amount,
      currency: options.currency,
      receipt: options.receipt,
    });
    // Log the HTTP request details that will be sent to Razorpay.
    const razorpayUrl = "https://api.razorpay.com/v1/orders";
    const rpMethod = "POST";
    const rpBody = JSON.stringify(options);
    const id = process.env.RAZORPAY_KEY_ID || "";
    const secret = process.env.RAZORPAY_KEY_SECRET || "";
    const authPreview = `${id}:${maskKey(secret)}`;
    const authFullBase64 = Buffer.from(`${id}:${secret}`).toString("base64");
    const authPreviewBase64 = Buffer.from(authPreview).toString("base64");

    console.log('[create-order] Razorpay HTTP request ->', {
      url: razorpayUrl,
      method: rpMethod,
      headers: {
        Authorization:
          process.env.LOG_RAZORPAY_SECRET === 'true'
            ? `Basic ${authFullBase64}`
            : `Basic ${authPreviewBase64}`,
        'Content-Type': 'application/json',
      },
      body: JSON.parse(rpBody),
    });

    const order = await razorpay.orders.create(options);
    console.log('[create-order] order created:', order && order.id ? { id: order.id } : order);

    return res.status(200).json(order);
  } catch (error) {
    console.error('[create-order] error:', error);
    const payload = { message: "Order creation failed" };
    if (process.env.NODE_ENV !== "production") {
      payload.error = error.message;
      payload.stack = error.stack;
    }
    return res.status(500).json(payload);
  }
}
