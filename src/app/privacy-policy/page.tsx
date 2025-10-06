'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPolicyPage() {
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
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy – Fixigo Services</h1>
            
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-8">
                At Fixigo Services Pvt. Ltd., we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.
              </p>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Personal Information</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                  <li>Name, email address, phone number</li>
                  <li>Address and location information</li>
                  <li>Payment information and billing details</li>
                  <li>Account credentials and preferences</li>
                </ul>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Service Information</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Service requests and booking details</li>
                  <li>Communication records with service providers</li>
                  <li>Feedback, ratings, and reviews</li>
                  <li>Photos and videos related to service requests</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>To provide and improve our services</li>
                  <li>To process bookings and payments</li>
                  <li>To communicate with you about your services</li>
                  <li>To match you with appropriate service providers</li>
                  <li>To ensure quality and safety of services</li>
                  <li>To comply with legal obligations</li>
                  <li>To send promotional offers and updates (with consent)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
                <p className="text-gray-600 mb-3">We may share your information with:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li><strong>Service Providers:</strong> To fulfill your service requests</li>
                  <li><strong>Payment Processors:</strong> To process transactions securely</li>
                  <li><strong>Legal Authorities:</strong> When required by law or to protect rights</li>
                  <li><strong>Business Partners:</strong> For legitimate business purposes (with consent)</li>
                </ul>
                <p className="text-gray-600 mt-4">We do not sell your personal information to third parties.</p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>We use industry-standard encryption and security measures</li>
                  <li>Regular security audits and updates</li>
                  <li>Secure data storage and transmission protocols</li>
                  <li>Limited access to personal information on need-to-know basis</li>
                  <li>Employee training on data protection practices</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
                <p className="text-gray-600 mb-3">You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate or incomplete data</li>
                  <li>Delete your account and personal information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Request data portability</li>
                  <li>Withdraw consent for data processing</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Cookies and Tracking</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>We use cookies to improve user experience</li>
                  <li>Analytics cookies help us understand usage patterns</li>
                  <li>You can control cookie preferences in your browser</li>
                  <li>Some features may not work properly without cookies</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>We retain personal information as long as necessary for service provision</li>
                  <li>Account information is kept until account deletion</li>
                  <li>Transaction records are retained for legal and tax purposes</li>
                  <li>You can request data deletion at any time</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Children's Privacy</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Our services are not intended for children under 18</li>
                  <li>We do not knowingly collect information from minors</li>
                  <li>Parents should supervise children's online activities</li>
                  <li>Contact us if you believe we have collected child information</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">9. International Transfers</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Data may be transferred to countries with different privacy laws</li>
                  <li>We ensure adequate protection through appropriate safeguards</li>
                  <li>Transfers comply with applicable data protection regulations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Policy Updates</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>We may update this policy periodically</li>
                  <li>Changes will be posted on our website</li>
                  <li>Significant changes will be communicated directly</li>
                  <li>Continued use constitutes acceptance of updates</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
                <p className="text-gray-600 mb-3">For privacy-related questions or concerns, contact us at:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>📧 Email: privacy@fixigo.com</li>
                  <li>📞 Phone: 040 - 32324256</li>
                  <li>📍 Address: Fixigo Services Pvt. Ltd., Hyderabad, India</li>
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