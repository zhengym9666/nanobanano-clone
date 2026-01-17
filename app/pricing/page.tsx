"use client"

import { useAuth } from "@/lib/auth-context"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { PaymentButton } from "@/components/pricing/payment-button"

export default function PricingPage() {
  const { user } = useAuth();
  
  const pricingPlans = [
    {
      id: "basic-plan",
      name: "Basic Plan",
      price: "$1",
      priceInCents: 100,
      period: "/month",
      type: "subscription",
      description: "Perfect for getting started with AI image generation",
      features: [
        "100 credits per month",
        "= 4 high-quality images/month",
        "Basic AI models",
        "Standard support",
        "Commercial license included",
        "Cancel anytime"
      ],
      buttonText: "Get Started",
      popular: true
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto py-16 px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Simple, transparent pricing</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan for your creative needs. All plans include our core image editing features.
            </p>
          </div>

          <div className="grid md:grid-cols-1 gap-8 max-w-2xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`flex flex-col ${plan.popular ? 'border-2 border-primary shadow-lg' : ''}`}>
                <CardHeader>
                  {plan.popular && (
                    <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4 w-fit">
                      Most Popular
                    </div>
                  )}
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {plan.type === 'free' ? (
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? "default" : "outline"}
                      size="lg"
                      onClick={() => {
                        // Handle free plan signup or redirect
                        if (user) {
                          window.location.href = '/dashboard';
                        } else {
                          window.location.href = '/auth';
                        }
                      }}
                    >
                      {plan.buttonText}
                    </Button>
                  ) : (
                    <PaymentButton 
                      planId={plan.id}
                      planName={plan.name}
                      planType="subscription"
                      amount={plan.priceInCents}
                    />
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Can I change my plan later?</h3>
                <p className="text-muted-foreground">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-muted-foreground">
                  We accept all major credit cards, PayPal, and various other payment methods through our secure payment processor Creem.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Is there a free trial?</h3>
                <p className="text-muted-foreground">
                  Yes, all paid plans come with a 14-day free trial. No credit card required to start your trial.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">How does the image generation work?</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes your image and prompt to generate high-quality edits. The Pro plan includes our latest model for the best results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}