import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Mr. Panda",
  description:
    "Read the Terms & Conditions governing the use of our restaurant website and services.",
};

const CONTACT = {
  email: "support@mrpanda.com",
  phone: "+880 1835474397",
  address: "Agrabad Commercial Area, Chittagong, Bangladesh",
} as const;

export default function TermsAndConditionsPage(): React.JSX.Element {
  return (
    <main className="max-w-5xl mx-auto px-6 pb-16 pt-24 lg:pt-28">
      <div className="space-y-10">
        <header>
          <h1 className="text-4xl font-bold">Terms & Conditions</h1>
          <p className="mt-3 text-gray-500">Last Updated: June 28, 2026</p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>

          <p>
            By accessing or using our website, mobile application, or services,
            you agree to be bound by these Terms & Conditions. If you do not
            agree with any part of these terms, please discontinue using our
            services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Eligibility</h2>

          <p>
            You must be at least 18 years old or have permission from a parent
            or legal guardian to use our services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. User Accounts</h2>

          <ul className="list-disc space-y-2 pl-6">
            <li>Provide accurate and up-to-date information.</li>
            <li>Keep your login credentials confidential.</li>
            <li>You are responsible for all activity under your account.</li>
            <li>Notify us immediately if you suspect unauthorized access.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">4. Food Orders</h2>

          <ul className="list-disc space-y-2 pl-6">
            <li>All orders are subject to confirmation.</li>
            <li>Menu items may change without prior notice.</li>
            <li>Prices may be updated at any time.</li>
            <li>Availability depends on stock and restaurant capacity.</li>
            <li>Special requests cannot always be guaranteed.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">5. Table Reservations</h2>

          <ul className="list-disc space-y-2 pl-6">
            <li>Reservations are subject to availability.</li>
            <li>Please arrive on time.</li>
            <li>
              Late arrivals may result in cancellation of your reservation.
            </li>
            <li>
              We reserve the right to cancel reservations due to unforeseen
              circumstances.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">6. Payments</h2>

          <p>
            Payments must be completed using one of our accepted payment
            methods. Payment processing is handled securely by trusted
            third-party payment providers.
          </p>

          <p>
            We do not store your complete credit or debit card details on our
            servers.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            7. Cancellation & Refund Policy
          </h2>

          <ul className="list-disc space-y-2 pl-6">
            <li>
              Orders may only be cancelled before food preparation begins.
            </li>
            <li>
              Refund eligibility depends on the circumstances of the order.
            </li>
            <li>
              Approved refunds will be processed using the original payment
              method whenever possible.
            </li>
            <li>
              Delivery charges may not be refundable unless required by law.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            8. Promotions & Discount Codes
          </h2>

          <ul className="list-disc space-y-2 pl-6">
            <li>Promotions may have expiration dates.</li>
            <li>Discount codes may not be combined.</li>
            <li>Offers are subject to availability.</li>
            <li>
              We reserve the right to modify or discontinue promotions at any
              time.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">9. Prohibited Activities</h2>

          <p>You agree not to:</p>

          <ul className="list-disc space-y-2 pl-6">
            <li>Use the website for unlawful purposes.</li>
            <li>Attempt unauthorized access to our systems.</li>
            <li>Distribute malware or harmful software.</li>
            <li>Interfere with website functionality.</li>
            <li>Submit false or misleading information.</li>
            <li>Abuse promotional offers.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">10. Intellectual Property</h2>

          <p>
            All website content, including text, images, logos, graphics,
            designs, icons, menus, and software, is owned by or licensed to us
            and is protected by applicable intellectual property laws.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            11. Limitation of Liability
          </h2>

          <p>
            To the fullest extent permitted by law, we are not liable for any
            indirect, incidental, special, or consequential damages arising from
            the use of our website or services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">12. Indemnification</h2>

          <p>
            You agree to indemnify and hold us harmless from any claims,
            liabilities, damages, losses, or expenses resulting from your use of
            our services or violation of these Terms & Conditions.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">13. Third-Party Services</h2>

          <p>
            Our website may integrate with third-party services such as payment
            providers, authentication providers, analytics tools, and map
            services. We are not responsible for their content or privacy
            practices.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">14. Termination</h2>

          <p>
            We reserve the right to suspend or terminate your account or access
            to our services at our sole discretion if you violate these Terms &
            Conditions.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">15. Changes to These Terms</h2>

          <p>
            We may update these Terms & Conditions from time to time. Continued
            use of our services after changes become effective constitutes your
            acceptance of the revised terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">16. Governing Law</h2>

          <p>
            These Terms & Conditions shall be governed by and interpreted in
            accordance with the laws applicable in the jurisdiction where our
            restaurant operates.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">17. Contact Us</h2>

          <div className="rounded-lg border p-6 space-y-2">
            <p>
              <strong>Email:</strong> {CONTACT.email}
            </p>

            <p>
              <strong>Phone:</strong> {CONTACT.phone}
            </p>

            <p>
              <strong>Address:</strong> {CONTACT.address}
            </p>
          </div>
        </section>

        <footer className="border-t pt-8">
          <p className="text-sm text-gray-500">
            By accessing or using our website, you acknowledge that you have
            read, understood, and agree to be bound by these Terms & Conditions.
          </p>
        </footer>
      </div>
    </main>
  );
}
