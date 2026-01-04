"use client"

import { useAuth } from "@/lib/auth-context"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PaymentButton } from "@/components/pricing/payment-button"

export function PricingSection() {
  const { user, signInWithGoogle } = useAuth();
  
  const pricingPlans = [
    {
      id: "basic-plan",
      name: "Basic",
      price: "$144",
      priceInCents: 14400,
      period: "/year",
      type: "subscription",
      description: "Perfect for getting started with AI image generation",
      features: [
        "1,800 credits per year",
        "= 76 high-quality images/month",
        "Basic AI models",
        "Standard support",
        "Commercial license included",
        "Cancel anytime"
      ],
      buttonText: "Get Started with Basic",
      popular: false
    },
    {
      id: "pro-plan",
      name: "Pro",
      price: "$234",
      priceInCents: 23400,
      period: "/year",
      type: "subscription",
      description: "Most popular for professionals and creators",
      features: [
        "9,600 credits per year",
        "= 400 high-quality images/month",
        "Advanced AI models",
        "Priority support",
        "Batch generation",
        "Commercial license included",
        "Cancel anytime",
        "Image editing tools (Coming in October)"
      ],
      buttonText: "Get Started with Pro",
      popular: true
    },
    {
      id: "max-plan",
      name: "Max",
      price: "$480",
      priceInCents: 48000,
      period: "/year",
      type: "subscription",
      description: "For power users and businesses with high volume needs",
      features: [
        "19,200 credits per year",
        "= 800 high-quality images/month",
        "Fastest generation speed",
        "Dedicated account manager",
        "Priority queue access",
        "Commercial license included",
        "Cancel anytime",
        "Professional editing suite (Coming in October)"
      ],
      buttonText: "Get Started with Max",
      popular: false
    }
  ]

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">Simple, transparent pricing</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your creative needs. All plans include our core image editing features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card key={index} className={`flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20 hover:border-2 hover:border-primary border`}>
              <CardHeader>
                {plan.popular && (
                  <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4 w-fit animate-pulse">
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
                <PaymentButton 
                  planId={plan.id}
                  planName={plan.name}
                  planType="subscription"
                  amount={plan.priceInCents}
                />
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
    </section>
  )
}