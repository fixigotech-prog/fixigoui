'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RefundPolicyPage() {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Refund Policy – Fixigo Services</h1>
            
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6">
                At Fixigo Services Pvt. Ltd., customer satisfaction is our top priority. We aim to deliver reliable and professional home services including appliance repair, cleaning, pest control, handyman work, and other home needs. However, we understand that situations may arise where refunds are requested.
              </p>
              <p className="text-gray-600 mb-8">
                This Refund Policy outlines the conditions under which customers may be eligible for a refund.
              </p>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Service Not Provided</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>If Fixigo is unable to provide the booked service due to reasons such as unavailability of service providers, technical issues in our platform, or other unforeseen circumstances, the customer will be entitled to a 100% full refund.</li>
                  <li>Refunds will also apply in cases where the service provider fails to arrive at the scheduled time without proper rescheduling or notice.</li>
                  <li>In such cases, customers are encouraged to contact our customer support team immediately so we can verify and process the refund quickly.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Cancellation Within 2 Hours of Booking</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>If a customer cancels a service request within 2 hours of placing the booking, a full refund will be issued with no deductions.</li>
                  <li>This policy applies whether the service was prepaid online or booked through the app/website.</li>
                  <li>The refund will be processed to the original mode of payment (e.g., UPI, card, wallet, or net banking).</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Cancellation After 2 Hours of Booking</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>If a customer cancels the booking after 2 hours, a 10% cancellation fee will be deducted, and the balance will be refunded.</li>
                  <li>This deduction covers administrative, scheduling, and communication costs already incurred by Fixigo.</li>
                  <li>If a service provider has already been dispatched and is enroute, an additional visit charge may apply as per the service category.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Service Quality Issues</h2>
                <p className="text-gray-600 mb-3">If a customer is not satisfied with the quality of the service, Fixigo will:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>First, attempt to resolve the issue by arranging a free re-service by the same or a different provider.</li>
                  <li>If the issue remains unresolved, a partial or full refund may be approved after verification by our quality assurance team.</li>
                  <li>Refunds in such cases will be decided based on the extent of work completed and the validity of the complaint.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Refund Requests Process</h2>
                <p className="text-gray-600 mb-3">All refund requests must be raised through Fixigo Customer Support via:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>📧 Email: support@fixigo.com</li>
                  <li>📞 Phone: 040 - 32324256</li>
                </ul>
                <p className="text-gray-600 mt-4 mb-3">Customers must provide:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Booking ID</li>
                  <li>Reason for refund request</li>
                  <li>Supporting evidence (if applicable) such as photos, videos, or description of the issue.</li>
                </ul>
                <p className="text-gray-600 mt-4">Refund requests are usually processed within 7–10 working days after validation.</p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Refund Eligibility</h2>
                <p className="text-gray-600 mb-3">Refunds are only applicable under the following conditions:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>The customer has paid for the service in advance.</li>
                  <li>The service was cancelled within the permitted timeframe.</li>
                  <li>Service quality complaints were validated by Fixigo's quality assurance team.</li>
                </ul>
                <p className="text-gray-600 mt-4 mb-3">Refunds will not be applicable in the following situations:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Incorrect or incomplete address/contact details provided by the customer.</li>
                  <li>Customer denial of service after the provider arrives at the location.</li>
                  <li>Damages caused due to customer's mishandling of appliances or misuse of chemicals/products.</li>
                  <li>Additional expenses (e.g., transportation, third-party costs) not booked through Fixigo.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Refund Disputes</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>If a customer's refund request is denied and they believe it is unfair, they may submit a dispute for further review.</li>
                  <li>The case will be escalated to Fixigo's Dispute Resolution Team, which will investigate impartially.</li>
                  <li>Customers will receive a final resolution within 10 working days.</li>
                  <li>If disputes remain unresolved, they may be referred to arbitration as per Fixigo's Terms and Conditions.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Special Cases</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li><strong>Prepaid Packages or Subscriptions:</strong> If a customer cancels before using the services, refunds will be processed after deducting administrative charges.</li>
                  <li><strong>Spare Parts and Consumables:</strong> Refunds for parts (AC gas, filters, pest control chemicals, etc.) will only be processed if they are unused, undamaged, and not tampered with.</li>
                  <li><strong>Force Majeure Events:</strong> No refunds will be provided if services are disrupted due to natural calamities, strikes, or government restrictions.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Policy Updates</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Fixigo reserves the right to modify or update this Refund Policy at any time.</li>
                  <li>Changes will be effective immediately upon posting on our website/app.</li>
                  <li>Customers are encouraged to review the Refund Policy regularly.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Contact Us</h2>
                <p className="text-gray-600 mb-3">For any questions, assistance, or refund-related concerns, please contact us at:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>📧 Email: support@fixigo.com</li>
                  <li>📞 Phone: 040 - 32324256</li>
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