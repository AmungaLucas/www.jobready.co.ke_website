"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import {
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiArrowRight,
  FiShoppingBag,
  FiShield,
  FiClock,
} from "react-icons/fi";

// ─── Step Constants ──────────────────────────────────────
const STEPS = {
  DETAILS: "details",
  SUMMARY: "summary",
  PAYMENT: "payment",
  SUCCESS: "success",
  ERROR: "error",
};

// ─── Service type to DB mapping ─────────────────────────
const SERVICE_TYPE_MAP = {
  "cv-writing": "CV_WRITING",
  "cover-letter": "COVER_LETTER",
  "linkedin": "LINKEDIN_PROFILE",
};

// ─── Tier name to DB enum mapping (fallback for legacy data) ──
const TIER_MAP = {
  basic: "BASIC",
  standard: "BASIC",
  professional: "PROFESSIONAL",
  premium: "PREMIUM",
};

// Resolve the DB tier enum from the selected tier object.
// With dynamic DB data, selectedTier.tier already holds the enum value
// ("BASIC", "PROFESSIONAL", "PREMIUM"). The TIER_MAP is kept as
// a fallback for legacy mock-data tier objects that only have a name.
function resolveServiceType(service) {
  return SERVICE_TYPE_MAP[service.id] || service.serviceType || service.id.toUpperCase();
}

function resolveTier(selectedTier) {
  // Prefer the direct DB enum field
  if (selectedTier.tier && selectedTier.tier in { BASIC: 1, PROFESSIONAL: 1, PREMIUM: 1 }) {
    return selectedTier.tier;
  }
  // Fallback: map from the display name
  return TIER_MAP[selectedTier.name?.toLowerCase()] || selectedTier.name?.toUpperCase() || "BASIC";
}

export default function OrderModal({ isOpen, onClose, service, selectedTier }) {
  const [step, setStep] = useState(STEPS.DETAILS);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("PENDING");
  const [pollCount, setPollCount] = useState(0);
  const [error, setError] = useState(null);
  const pollRef = useRef(null);
  const modalRef = useRef(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep(STEPS.DETAILS);
      setFormData({ fullName: "", email: "", phone: "", notes: "" });
      setErrors({});
      setIsSubmitting(false);
      setOrderData(null);
      setPaymentData(null);
      setPaymentStatus("PENDING");
      setPollCount(0);
      setError(null);
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    }
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === "Escape" && step !== STEPS.PAYMENT) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, step, onClose]);

  // Minimum polls before we show error — prevents showing false failures
  // from STK Query returning 4999 or transient errors before user enters PIN
  const GRACE_POLLS = 5; // ~15 seconds grace period (5 polls × 3 seconds)

  // Poll payment status — uses STK Query (direct Safaricom check) as primary mechanism
  const pollPaymentStatus = useCallback(async (paymentId, checkoutRequestId, currentPollCount) => {
    if (!paymentId || !checkoutRequestId) return;

    const nextPoll = currentPollCount + 1;
    setPollCount(nextPoll);
    pollCountRef.current = nextPoll; // Keep ref in sync for interval closure

    // Timeout after 120 seconds (40 polls × 3 seconds)
    if (nextPoll >= 40) {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      setError("Payment timed out. The M-Pesa prompt may have expired. Please try again.");
      setStep(STEPS.ERROR);
      return;
    }

    try {
      // Primary: Query Safaricom directly via STK Query API
      const queryRes = await fetch("/api/payments/stk-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkoutRequestId,
          paymentId,
        }),
      });

      if (queryRes.ok) {
        const queryData = await queryRes.json();
        setPaymentStatus(queryData.status);

        if (queryData.status === "SUCCESS") {
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
          // Fetch full payment data for success page
          const payRes = await fetch(`/api/payments/${paymentId}`);
          if (payRes.ok) {
            setPaymentData(await payRes.json());
          }
          setStep(STEPS.SUCCESS);
          return;
        } else if (
          queryData.status === "FAILED" ||
          queryData.status === "CANCELLED" ||
          queryData.status === "TIMEOUT"
        ) {
          // During grace period, don't show errors — the user may not have
          // entered their PIN yet, and Safaricom may return transient statuses
          if (nextPoll < GRACE_POLLS) {
            console.log(
              `[Payment] Ignoring ${queryData.status} during grace period (poll ${nextPoll}/${GRACE_POLLS}): ${queryData.resultDesc}`
            );
            return;
          }
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
          setError(queryData.resultDesc || "Payment failed. Please try again.");
          setStep(STEPS.ERROR);
          return;
        }
      }

      // Fallback: Check DB directly (callback may have updated it)
      const res = await fetch(`/api/payments/${paymentId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.status === "SUCCESS") {
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
          setPaymentData(data);
          setStep(STEPS.SUCCESS);
        } else if (
          (data.status === "FAILED" || data.status === "CANCELLED" || data.status === "TIMEOUT") &&
          nextPoll >= GRACE_POLLS
        ) {
          // Only show DB failure after grace period
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
          setError(data.resultDesc || "Payment failed. Please try again.");
          setStep(STEPS.ERROR);
        }
      }
    } catch (err) {
      console.error("Payment poll error:", err);
    }
  }, []);

  // Track poll count in a ref so the interval callback always sees latest value
  const pollCountRef = useRef(0);

  // Start polling when payment step is reached
  useEffect(() => {
    if (step === STEPS.PAYMENT && paymentData?.paymentId && paymentData?.checkoutRequestId) {
      pollCountRef.current = 0;

      // Initial poll after 8 seconds (give user time to see the M-Pesa prompt
      // and start entering PIN — reduces false FAILED from 4999 responses)
      const initialTimeout = setTimeout(() => {
        pollCountRef.current = 0;
        pollPaymentStatus(paymentData.paymentId, paymentData.checkoutRequestId, pollCountRef.current);
      }, 8000);

      // Continue polling every 3 seconds after the initial delay
      pollRef.current = setInterval(() => {
        pollPaymentStatus(paymentData.paymentId, paymentData.checkoutRequestId, pollCountRef.current);
      }, 3000);

      return () => {
        clearTimeout(initialTimeout);
        if (pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
      };
    }

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [step, paymentData, pollPaymentStatus]);

  // ─── Form Handlers ──────────────────────────────────
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Step 1: Review Summary ────────────────────────
  const goToSummary = () => {
    if (!validateForm()) return;
    setStep(STEPS.SUMMARY);
  };

  // ─── Step 2: Initiate Payment ──────────────────────
  const handlePayment = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Create order
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          fullName: formData.fullName,
          notes: formData.notes,
          items: [
            {
              serviceType: resolveServiceType(service),
              tier: resolveTier(selectedTier),
            },
          ],
        }),
      });

      const orderResult = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderResult.error || "Failed to create order");
      }

      setOrderData(orderResult.order);

      // 2. Initiate STK Push
      const stkRes = await fetch("/api/payments/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderResult.order.id,
          phoneNumber: formData.phone,
        }),
      });

      const stkResult = await stkRes.json();

      if (!stkRes.ok) {
        throw new Error(stkResult.error || "Failed to initiate payment");
      }

      setPaymentData(stkResult);
      setStep(STEPS.PAYMENT);
    } catch (err) {
      console.error("Payment initiation error:", err);
      setError(err.message || "Something went wrong. Please try again.");
      setStep(STEPS.ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Retry ─────────────────────────────────────────
  const handleRetry = () => {
    setError(null);
    if (orderData) {
      // Retry payment for existing order
      setStep(STEPS.SUMMARY);
    } else {
      setStep(STEPS.DETAILS);
    }
  };

  const handleClose = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl
                   md:max-w-[520px] max-w-full mx-auto z-10"
      >
        {/* ─── Blue Gradient Header ─── */}
        <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white px-6 py-5 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            disabled={step === STEPS.PAYMENT}
          >
            <FiX size={16} />
          </button>

          {step === STEPS.DETAILS && (
            <>
              <h2 className="text-xl font-bold">Place Your Order</h2>
              <p className="text-sm opacity-80 mt-1">{service.name} — {selectedTier.name}</p>
            </>
          )}
          {step === STEPS.SUMMARY && (
            <>
              <h2 className="text-xl font-bold">Order Summary</h2>
              <p className="text-sm opacity-80 mt-1">Review your order details</p>
            </>
          )}
          {step === STEPS.PAYMENT && (
            <>
              <h2 className="text-xl font-bold">Processing Payment</h2>
              <p className="text-sm opacity-80 mt-1">Waiting for M-Pesa confirmation...</p>
            </>
          )}
          {step === STEPS.SUCCESS && (
            <>
              <h2 className="text-xl font-bold">Payment Successful!</h2>
              <p className="text-sm opacity-80 mt-1">Your order has been confirmed</p>
            </>
          )}
          {step === STEPS.ERROR && (
            <>
              <h2 className="text-xl font-bold">Payment Issue</h2>
              <p className="text-sm opacity-80 mt-1">Something went wrong</p>
            </>
          )}
        </div>

        {/* ─── Content ─── */}
        <div className="p-6">
          {/* ── Step 1: Customer Details ── */}
          {step === STEPS.DETAILS && (
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="e.g. John Kamau"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm transition-colors
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      ${errors.fullName ? "border-red-300 bg-red-50" : "border-gray-300"}`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="e.g. john@email.com"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm transition-colors
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      ${errors.email ? "border-red-300 bg-red-50" : "border-gray-300"}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  M-Pesa Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="e.g. 0712345678"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm transition-colors
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                      ${errors.phone ? "border-red-300 bg-red-50" : "border-gray-300"}`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Enter the phone number linked to your M-Pesa account
                </p>
              </div>

              {/* CV Upload Note */}
              <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <FiFileText className="text-amber-600 size-5 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">
                  You can share your current CV via WhatsApp after ordering. Our team will reach out to you within 30 minutes.
                </p>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Target Job / Notes <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="e.g. Applying for a Senior Accountant role at KCB..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm transition-colors
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              {/* Continue Button */}
              <button
                onClick={goToSummary}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg
                         bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors"
              >
                Review Order
                <FiArrowRight size={16} />
              </button>
            </div>
          )}

          {/* ── Step 2: Order Summary ── */}
          {step === STEPS.SUMMARY && (
            <div className="space-y-4">
              {/* Service Details */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FiShoppingBag className="text-blue-600" size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{service.name}</p>
                    <p className="text-xs text-gray-500">{selectedTier.name} Package</p>
                  </div>
                </div>
                {selectedTier.features && selectedTier.features.length > 0 && (
                  <ul className="space-y-1 mb-3">
                    {selectedTier.features.slice(0, 4).map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                        <FiCheckCircle className="text-green-500 shrink-0" size={12} />
                        {f}
                      </li>
                    ))}
                    {selectedTier.features.length > 4 && (
                      <li className="text-xs text-gray-400 pl-5">
                        +{selectedTier.features.length - 4} more features
                      </li>
                    )}
                  </ul>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-600">Total</span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(selectedTier.price)}
                  </span>
                </div>
              </div>

              {/* Customer Summary */}
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Customer Details
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <FiUser className="text-gray-400" size={14} />
                    <span className="text-gray-700">{formData.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FiMail className="text-gray-400" size={14} />
                    <span className="text-gray-700">{formData.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FiPhone className="text-gray-400" size={14} />
                    <span className="text-gray-700">{formData.phone}</span>
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <FiShield className="text-green-500" size={14} />
                  Secure Payment
                </span>
                <span className="flex items-center gap-1">
                  <FiClock className="text-blue-500" size={14} />
                  24hr Delivery
                </span>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(STEPS.DETAILS)}
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 text-sm font-bold text-gray-700
                           hover:border-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePayment}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                           bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <FiRefreshCw className="animate-spin" size={16} />
                      Processing...
                    </>
                  ) : (
                    `Pay ${formatCurrency(selectedTier.price)}`
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Payment Processing ── */}
          {step === STEPS.PAYMENT && (
            <div className="space-y-5 text-center">
              {/* M-Pesa Icon */}
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <div className="text-3xl font-bold text-green-700">M</div>
              </div>

              <div>
                <p className="text-sm text-gray-600">
                  An M-Pesa prompt has been sent to
                </p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {formData.phone}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <FiRefreshCw className={`size-4 ${paymentStatus === "PENDING" ? "animate-spin" : ""}`} />
                {paymentStatus === "PENDING"
                  ? "Please enter your M-Pesa PIN when prompted..."
                  : "Checking payment status..."}
              </div>

              {/* Progress bar — approximate: 8s initial + 40 polls × 3s = ~128s total */}
              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((pollCount / 40) * 100, 100)}%` }}
                />
              </div>

              <p className="text-xs text-gray-400">
                {pollCount < GRACE_POLLS
                  ? "Waiting for you to enter your M-Pesa PIN..."
                  : "Checking payment status... Do not close this window."}
              </p>
            </div>
          )}

          {/* ── Step 4: Success ── */}
          {step === STEPS.SUCCESS && (
            <div className="space-y-5 text-center">
              {/* Green checkmark */}
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <FiCheckCircle className="text-green-600" size={40} />
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900">Payment Received!</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Your order has been confirmed. We&apos;ll be in touch shortly.
                </p>
              </div>

              {/* Order Details */}
              <div className="border border-gray-200 rounded-lg p-4 text-left">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Order Number</span>
                    <span className="font-mono font-semibold text-gray-900">
                      {orderData?.orderNumber || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Amount Paid</span>
                    <span className="font-bold text-green-700">
                      {formatCurrency(paymentData?.amount || selectedTier.price)}
                    </span>
                  </div>
                  {paymentData?.mpesaReceiptNumber && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">M-Pesa Receipt</span>
                      <span className="font-mono font-semibold text-gray-900">
                        {paymentData.mpesaReceiptNumber}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Service</span>
                    <span className="text-gray-700">{service.name} — {selectedTier.name}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Link
                  href="/dashboard/billing"
                  onClick={handleClose}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                           border-2 border-gray-200 text-sm font-bold text-gray-700
                           hover:border-gray-300 transition-colors no-underline"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 rounded-lg
                           bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}

          {/* ── Error State ── */}
          {step === STEPS.ERROR && (
            <div className="space-y-5 text-center">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                <FiAlertCircle className="text-red-600" size={40} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900">Payment Failed</h3>
                <p className="text-sm text-gray-500 mt-2">{error || "Something went wrong."}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRetry}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                           bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors"
                >
                  <FiRefreshCw size={16} />
                  Try Again
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 rounded-lg
                           border-2 border-gray-200 text-sm font-bold text-gray-700
                           hover:border-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>

              {/* WhatsApp fallback */}
              <p className="text-xs text-gray-400">
                Having trouble?{" "}
                <a
                  href="https://wa.me/254700000000?text=Hi%20JobReady%2C%20I%20need%20help%20with%20my%20payment"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 font-medium hover:underline"
                >
                  Chat with us on WhatsApp
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
