'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CancellationPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onLoginClick={() => {}}
        userLocation={null}
        onLocationChange={() => {}}
      />
      
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Cancellation Policy (After Booking)</h1>
            
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-8">
                At Fixigo, we value your time and our service professionals' commitment. We understand that plans may change, which is why we provide a fair and transparent cancellation policy.
              </p>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Free Cancellation Period</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>You are entitled to cancel your booking within 1 hour of placing the order at no cost.</li>
                  <li>This grace period ensures that you have flexibility immediately after booking in case of accidental orders or sudden changes in your plans.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Cancellation After 1 Hour of Booking</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>If you cancel your booking after 1 hour of placing the order, a 10% cancellation fee will be charged on the total service value.</li>
                  <li>This fee helps compensate the professional whose time has been reserved exclusively for your service and who may not be able to accept another booking for that slot.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Professional Not Assigned</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>If no service professional has been assigned to your order at the time of cancellation, no cancellation fee will be charged, regardless of when you cancel.</li>
                  <li>This ensures that you are only charged a fee if your cancellation directly impacts a professional's ability to work.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Why a Cancellation Fee is Charged</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Our service professionals commit their time and availability to your booking.</li>
                  <li>By charging a small cancellation fee, we ensure fairness to them while maintaining service reliability and platform efficiency.</li>
                  <li>The collected fee is transferred to the professional as a token for reserving their time.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Refund of Balance Amount</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>If you have prepaid for the service, the refundable balance (after deducting the applicable cancellation fee) will be processed back to your original payment method.</li>
                  <li>Refund timelines may vary depending on your bank or payment provider but are typically completed within 5–7 business days.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Exceptions</h2>
                <p className="text-gray-600 mb-3">No cancellation fee is charged if:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>The booking is cancelled within 1 hour of placing the order.</li>
                  <li>No professional has been assigned to your booking.</li>
                  <li>The cancellation is due to an error or unavailability on Fixigo's side (e.g., technician unavailability, double booking).</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}