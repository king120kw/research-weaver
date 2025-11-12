import { useNavigate } from "react-router-dom";
import { Check, Crown, Sparkles, Zap, Shield, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Premium = () => {
  const navigate = useNavigate();

  const benefits = [
    { icon: Zap, title: "Unlimited Access", description: "Access all courses and teachers" },
    { icon: Clock, title: "Instant Booking", description: "Skip the wait, book instantly" },
    { icon: Shield, title: "Priority Support", description: "Get help when you need it" },
    { icon: Sparkles, title: "Exclusive Content", description: "Premium-only lessons and materials" },
  ];

  const plans = [
    {
      name: "Monthly",
      price: 9.99,
      period: "month",
      savings: null,
      popular: false,
    },
    {
      name: "Annual",
      price: 4.99,
      period: "month",
      originalPrice: 9.99,
      savings: "Save 50%",
      popular: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 pb-12">
      {/* Header */}
      <header className="border-b border-border bg-card/95 backdrop-blur-sm px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="ml-2 text-lg font-semibold">Premium</h1>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center animate-fade-in">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-gradient-to-br from-warning to-primary p-4">
              <Crown className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="mb-3 text-4xl font-bold text-foreground">
            Go Premium
          </h1>
          <p className="text-lg text-muted-foreground">
            Get unlimited access to all features
          </p>
          <p className="text-muted-foreground">
            When you subscribe, you'll get instant unlimited access
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="animate-fade-in rounded-2xl border border-border bg-card p-6 text-center"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="mb-2 font-semibold text-foreground">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Pricing Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`animate-scale-in relative rounded-3xl border-2 p-8 transition-all hover:shadow-xl ${
                plan.popular
                  ? "border-primary bg-gradient-to-br from-primary/5 to-secondary/5"
                  : "border-border bg-card"
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary">
                  Most Popular
                </Badge>
              )}

              <div className="mb-6 text-center">
                <h3 className="mb-2 text-2xl font-bold text-foreground">{plan.name}</h3>
                {plan.savings && (
                  <Badge variant="secondary" className="mb-2">
                    {plan.savings}
                  </Badge>
                )}
                <div className="flex items-baseline justify-center gap-1">
                  {plan.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      ${plan.originalPrice}
                    </span>
                  )}
                  <span className="text-5xl font-bold text-primary">${plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                {plan.name === "Annual" && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Billed as ${(plan.price * 12).toFixed(2)} per year
                  </p>
                )}
              </div>

              <ul className="mb-6 space-y-3">
                {[
                  "Unlimited lesson bookings",
                  "Access to all teachers",
                  "Priority customer support",
                  "Exclusive learning materials",
                  "Ad-free experience",
                  "Download lessons offline",
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-5 w-5 shrink-0 text-success" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                size="lg"
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.popular ? "Get Started" : "Choose Plan"}
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="mb-1 font-semibold text-foreground">
                Can I cancel anytime?
              </h3>
              <p className="text-sm text-muted-foreground">
                Yes, you can cancel your subscription at any time. No questions asked.
              </p>
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-foreground">
                What payment methods do you accept?
              </h3>
              <p className="text-sm text-muted-foreground">
                We accept all major credit cards, PayPal, and other popular payment methods.
              </p>
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-foreground">
                Is there a free trial?
              </h3>
              <p className="text-sm text-muted-foreground">
                Yes! New users get a 7-day free trial to explore all premium features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;
