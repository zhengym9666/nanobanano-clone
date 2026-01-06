import { Metadata } from "next"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export const metadata: Metadata = {
  title: "Terms of Service - Nano Banana",
  description: "Nano Banana Terms of Service - Terms and conditions governing the use of our AI image editing services.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: January 2025</p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using Nano Banana&apos;s AI image editing services (&quot;Services&quot;), 
              you accept and agree to be bound by the terms and provisions of this agreement. 
              If you do not agree to abide by these terms, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground">
              Nano Banana provides an AI-powered image editing platform that allows users to transform 
              images using text prompts. The service includes access to AI models for image generation 
              and editing, subject to availability and these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts and Registration</h2>
            <p className="text-muted-foreground mb-4">
              To use certain features of our Services, you must create an account using Google OAuth. 
              You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
            <p className="text-muted-foreground mb-4">You agree NOT to use our Services to:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Generate, upload, or share illegal, harmful, or offensive content</li>
              <li>Create content that infringes on intellectual property rights</li>
              <li>Generate deepfakes, misinformation, or deceptive content</li>
              <li>Attempt to reverse engineer, copy, or modify our AI models</li>
              <li>Use automated systems to access our Services beyond allowed limits</li>
              <li>Share account credentials or resell access to the Services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Subscription and Payments</h2>
            <p className="text-muted-foreground mb-4">
              Some aspects of our Services require payment. By subscribing, you agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Pay all fees associated with your chosen subscription plan</li>
              <li>Automatic renewal of subscriptions unless cancelled before the renewal date</li>
              <li>Creem as our payment processor for handling transactions securely</li>
              <li>Refund terms as specified in our refund policy</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Credits and Usage</h2>
            <p className="text-muted-foreground">
              Subscription plans include monthly credits for image generation. Credits do not roll over 
              to the next billing cycle unless otherwise specified. Unused credits are forfeited at the 
              end of each billing period.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property Rights</h2>
            <p className="text-muted-foreground mb-4">
              <strong>Your Content:</strong> You retain ownership of images and content you upload. 
              By uploading content, you grant us a license to process it using our AI services.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>Generated Content:</strong> You own the images generated using our Services, 
              subject to these Terms. A commercial license is included with paid plans.
            </p>
            <p className="text-muted-foreground">
              <strong>Our Technology:</strong> Nano Banana, our logo, and all related technologies 
              are protected by intellectual property laws. You may not use our trademarks without 
              prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Disclaimers</h2>
            <p className="text-muted-foreground mb-4">
              <strong>No Warranty:</strong> Our Services are provided &quot;as is&quot; and &quot;as available&quot; 
              without any warranties of any kind, either express or implied.
            </p>
            <p className="text-muted-foreground mb-4">
              <strong>AI Limitations:</strong> AI-generated content may not always meet expectations. 
              We do not guarantee specific results from using our AI models.
            </p>
            <p className="text-muted-foreground">
              <strong>Service Availability:</strong> While we strive to maintain service availability, 
              we do not guarantee uninterrupted access to our Services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              To the maximum extent permitted by law, Nano Banana shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages, or any loss of profits or revenues, 
              whether incurred directly or indirectly, or any loss of data, use, goodwill, or other 
              intangible losses resulting from your use of our Services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Cancellation and Termination</h2>
            <p className="text-muted-foreground mb-4">
              <strong>By You:</strong> You may cancel your subscription at any time through your account settings. 
              Cancellation takes effect at the end of the current billing period.
            </p>
            <p className="text-muted-foreground">
              <strong>By Us:</strong> We may suspend or terminate your access to Services if you violate 
              these Terms, engage in fraudulent activity, or abuse the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Refund Policy</h2>
            <p className="text-muted-foreground">
              We offer a 30-day money-back guarantee for new subscriptions. If you are not satisfied 
              with our Services, contact support@nanobananalab.shop within 30 days of your purchase 
              for a full refund. Refunds for renewed subscriptions are at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these Terms at any time. We will notify users of any 
              material changes by posting the new Terms on this page and updating the &quot;Last updated&quot; date. 
              Continued use of Services after changes constitutes acceptance of new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms shall be governed by and construed in accordance with applicable laws, 
              without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">14. Contact Information</h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-muted-foreground mt-2 font-medium">
              support@nanobananalab.shop
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
