import React, { useState } from 'react';

const Subscribe = () => {
  const [subscribing, setSubscribing] = useState(false);
  const [success, setSuccess] = useState(false);

  // Placeholder for Stripe integration
  const handleSubscribe = async () => {
    setSubscribing(true);
    // Here you would call your backend to create a Stripe Checkout session
    // and redirect the user to Stripe. For now, we simulate success.
    setTimeout(() => {
      setSubscribing(false);
      setSuccess(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-soft p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-primary-navy mb-4">Become a Member</h1>
        <p className="text-gray-600 mb-6">Unlock full access to member-only posts, support your favorite authors, and enjoy exclusive benefits.</p>
        <div className="mb-6">
          <div className="text-4xl font-bold text-primary-navy mb-2">₹199/month</div>
          <div className="text-gray-500">Billed monthly. Cancel anytime.</div>
        </div>
        {success ? (
          <div className="text-green-600 font-semibold mb-4">Subscription successful! Enjoy your membership.</div>
        ) : (
          <button
            onClick={handleSubscribe}
            disabled={subscribing}
            className="px-8 py-3 bg-primary-navy text-white rounded-xl font-medium hover:bg-opacity-90 transition-colors shadow-lg disabled:opacity-50"
          >
            {subscribing ? 'Processing...' : 'Subscribe with Stripe'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Subscribe; 