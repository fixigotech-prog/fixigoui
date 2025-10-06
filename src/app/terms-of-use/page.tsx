'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsOfUsePage() {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Use – Fixigo Services</h1>
            
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-8">
                Welcome to Fixigo Services. These Terms of Use govern your access to and use of our website, mobile application, and services. By using our platform, you agree to comply with these terms.
              </p>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>By accessing or using Fixigo services, you agree to be bound by these Terms of Use</li>
                  <li>If you do not agree to these terms, please do not use our services</li>
                  <li>We may update these terms at any time without prior notice</li>
                  <li>Continued use of our services constitutes acceptance of updated terms</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Platform Description</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Fixigo is an online platform connecting customers with service providers</li>
                  <li>We facilitate home services including repairs, cleaning, and maintenance</li>
                  <li>We are not the direct provider of services but act as an intermediary</li>
                  <li>Service quality and delivery are the responsibility of individual service providers</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Registration</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>You must provide accurate and complete information during registration</li>
                  <li>You are responsible for maintaining the confidentiality of your account</li>
                  <li>You must notify us immediately of any unauthorized use of your account</li>
                  <li>One person may not maintain multiple accounts</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Acceptable Use</h2>
                <p className="text-gray-600 mb-3">You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Use the platform for any illegal or unauthorized purpose</li>
                  <li>Violate any laws in your jurisdiction</li>
                  <li>Transmit any harmful or malicious code</li>
                  <li>Interfere with or disrupt the platform's functionality</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use automated systems to access the platform</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Service Booking</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>All bookings are subject to service provider availability</li>
                  <li>Prices displayed are estimates and may vary based on actual requirements</li>
                  <li>You must provide accurate service location and contact information</li>
                  <li>Additional charges may apply for extra services or materials</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Payment Terms</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Payment is due as per the terms specified during booking</li>
                  <li>We accept various payment methods including cards, UPI, and digital wallets</li>
                  <li>All payments are processed securely through our payment partners</li>
                  <li>You are responsible for any applicable taxes or fees</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>All content on our platform is owned by Fixigo or our licensors</li>
                  <li>You may not copy, modify, or distribute our content without permission</li>
                  <li>Our trademarks and logos are protected intellectual property</li>
                  <li>User-generated content remains your property but you grant us usage rights</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Privacy and Data Protection</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Your privacy is important to us and is governed by our Privacy Policy</li>
                  <li>We collect and use your data as described in our Privacy Policy</li>
                  <li>You consent to the collection and use of your information</li>
                  <li>We implement appropriate security measures to protect your data</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Disclaimers</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Our platform is provided "as is" without warranties of any kind</li>
                  <li>We do not guarantee uninterrupted or error-free service</li>
                  <li>We are not responsible for service provider actions or omissions</li>
                  <li>You use our services at your own risk</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Our liability is limited to the maximum extent permitted by law</li>
                  <li>We are not liable for indirect, incidental, or consequential damages</li>
                  <li>Our total liability shall not exceed the amount paid for the specific service</li>
                  <li>Some jurisdictions do not allow limitation of liability</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Indemnification</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>You agree to indemnify and hold us harmless from any claims</li>
                  <li>This includes claims arising from your use of our services</li>
                  <li>You are responsible for your interactions with service providers</li>
                  <li>We reserve the right to assume defense of any claim</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Termination</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>We may terminate your access to our services at any time</li>
                  <li>You may terminate your account by contacting customer support</li>
                  <li>Termination does not affect existing bookings or obligations</li>
                  <li>Certain provisions of these terms survive termination</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">13. Governing Law</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>These terms are governed by the laws of India</li>
                  <li>Any disputes will be resolved in the courts of Hyderabad, Telangana</li>
                  <li>If any provision is found invalid, the remainder remains in effect</li>
                  <li>These terms constitute the entire agreement between us</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">14. Contact Information</h2>
                <p className="text-gray-600 mb-3">For questions about these Terms of Use, contact us at:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>📧 Email: support@fixigo.com</li>
                  <li>📞 Phone: 040 - 32324256</li>
                  <li>📍 Address: Fixigo Services Pvt. Ltd., Hyderabad, India</li>
                </ul>
              </section>

              <div className="text-center mt-12 pt-8 border-t border-gray-200">
                <p className="text-gray-600 mb-4">Last updated: January 2025</p>
                <p className="text-gray-600">© 2025 Fixigo Services Pvt. Ltd. All Rights Reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}