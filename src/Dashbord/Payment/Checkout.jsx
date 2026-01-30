import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useContext, useEffect, useState } from "react";
import { AuthContex } from "../../Providers/AuthProvider";
import Swal from "sweetalert2";
import { Loader2, CheckCircle } from "lucide-react";
import instance from "../../api/axios";

const Checkout = ({ course }) => {
  const stripe = useStripe();      
  const elements = useElements();  
  const { user } = useContext(AuthContex);

  const [clientSecret, setClientSecret] = useState("");
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState("");
  const [success, setSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  const price = parseFloat(course?.price || 0);

  useEffect(() => {
    if (price > 0) {
      instance
        .post("/pay/create-payment-intent", { price })
        .then((res) => {
          if (res.data?.clientSecret) {
            setClientSecret(res.data.clientSecret);
          }
        })
        .catch((err) => console.error("Intent error:", err));
    }
  }, [price]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extra safety
    if (!stripe || !elements) {
      setCardError("Stripe is still loading. Please wait...");
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) return;
    console.log(card);
    setProcessing(true);
    setCardError("");

    const { error } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setCardError(error.message);
      setProcessing(false);
      return;
    }

    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          email: user?.email || "anonymous@example.com",
          name: user?.displayName || "Anonymous",
        },
      },
    });

    setProcessing(false);

    if (confirmError) {
      setCardError(confirmError.message);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      setSuccess(true);
      setTransactionId(paymentIntent.id);

      const paymentData = {
        email: user?.email,
        transaction: paymentIntent.id,
        couresId: course?.cartId,
        date: new Date().toISOString(),
        price,
        courseName: course?.name,
      };

      instance.post("/pay/payments", paymentData).then((res) => {
        if (res.data?.insertedId) {
          Swal.fire({
            icon: "success",
            title: "Payment Successful!",
            text: `Enrolled in "${course.name}"`,
            timer: 3000,
            showConfirmButton: false,
          });
        }
      });
    }
  };

  

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label className="block text-lg font-medium text-gray-700 mb-3">
          Card Information
        </label>

        {/* Improved container for better CardElement visibility */}
        <div className="p-5 border border-gray-300 rounded-xl bg-white focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-100 transition-all min-h-[70px]">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "18px",
                  color: "#1f2937",
                  "::placeholder": { color: "#9ca3af" },
                },
                invalid: { color: "#ef4444" },
              },
            }}
          />
        </div>
      </div>

      {cardError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {cardError}
        </div>
      )}

      {success && (
        <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-green-800 text-center">
          <CheckCircle size={48} className="mx-auto mb-3 text-green-600" />
          <p className="text-xl font-bold">Payment Successful!</p>
          <p className="mt-2">Transaction ID:</p>
          <p className="font-mono text-sm bg-white px-3 py-1 rounded mt-1 inline-block">
            {transactionId}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={processing || success}
        className="w-full py-5 px-8 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold text-xl rounded-xl shadow-lg hover:shadow-2xl transition-all flex items-center justify-center gap-3"
      >
        {processing ? (
          <>
            <Loader2 className="animate-spin" size={28} />
            Processing...
          </>
        ) : success ? (
          <>
            <CheckCircle size={28} />
            Payment Complete
          </>
        ) : (
          <>Pay ${price.toFixed(2)}</>
        )}
      </button>
    </form>
  );
};

export default Checkout;