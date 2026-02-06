import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Target, TrendingUp, History, Sparkles, ArrowRight, CheckCircle } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Smart Resume Parsing",
    description: "Paste your resume and watch as we extract key skills using advanced pattern matching.",
  },
  {
    icon: Target,
    title: "Job Description Matching",
    description: "Input any job posting and see how well your resume aligns with the requirements.",
  },
  {
    icon: TrendingUp,
    title: "Gap Analysis",
    description: "Identify missing skills and get actionable suggestions to improve your match rate.",
  },
  {
    icon: History,
    title: "Track Your Progress",
    description: "Save analyses locally and track your improvement over time with persistent storage.",
  },
];

const steps = [
  { step: 1, title: "Input Resume", description: "Paste your resume content" },
  { step: 2, title: "Add Job Description", description: "Enter the target job details" },
  { step: 3, title: "Get Analysis", description: "View your match percentage" },
  { step: 4, title: "Improve & Track", description: "Follow suggestions and save results" },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero min-h-screen flex items-center pt-24 -mt-16">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float animation-delay-300" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 backdrop-blur-sm rounded-full text-primary-foreground mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Free Resume Analysis Tool</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-5xl md:text-7xl font-bold text-primary-foreground mb-6 animate-slide-up">
              Match Your{" "}
              <span className="relative inline-block">
                <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Resume
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 10C50 2 150 2 198 10" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>{" "}
              to Your Dream Job
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto animate-slide-up animation-delay-100">
              Analyze your resume against any job description. Discover skill gaps and get personalized suggestions to stand out.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animation-delay-200">
              <Button 
                asChild 
                size="lg" 
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow transform hover:scale-105 transition-all duration-300"
              >
                <Link to="/resume">
                  Start Analyzing
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="border-primary-foreground/50 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 backdrop-blur-sm"
              >
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>

      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Powerful <span className="text-primary">Features</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to optimize your resume for any job application.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={feature.title}
                  className="group border-2 border-transparent hover:border-primary/20 transition-all duration-500 hover:shadow-elevated transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center mb-4 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                      <Icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              How It <span className="text-primary">Works</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Four simple steps to your perfect resume match.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {steps.map((item, index) => (
                <div 
                  key={item.step}
                  className="relative text-center group"
                >
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-primary to-transparent" />
                  )}
                  
                  {/* Step number */}
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center text-2xl font-bold text-primary-foreground mb-4 transform transition-all duration-500 group-hover:scale-110 shadow-soft group-hover:shadow-glow">
                    {item.step}
                  </div>
                  
                  <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                Stand Out From{" "}
                <span className="text-primary">The Crowd</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                In today's competitive job market, a tailored resume is essential. Our analyzer helps you understand exactly what employers are looking for.
              </p>
              
              <ul className="space-y-4">
                {[
                  "Identify skill gaps instantly",
                  "Get personalized improvement suggestions",
                  "Track your progress over time",
                  "Works 100% offline with local storage",
                ].map((benefit, index) => (
                  <li 
                    key={index}
                    className="flex items-center gap-3 text-foreground"
                  >
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <Button 
                asChild 
                size="lg" 
                className="mt-8 bg-gradient-primary hover:opacity-90 shadow-soft hover:shadow-glow transition-all duration-300"
              >
                <Link to="/resume">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>

            <div className="relative">
              {/* Decorative card stack */}
              <div className="absolute -top-4 -left-4 w-full h-full bg-secondary/50 rounded-2xl transform rotate-3" />
              <div className="absolute -top-2 -left-2 w-full h-full bg-primary/20 rounded-2xl transform rotate-1" />
              <Card className="relative shadow-elevated">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-primary flex items-center justify-center mb-6">
                      <span className="text-4xl font-bold text-primary-foreground">87%</span>
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-2">Match Score</h3>
                    <p className="text-muted-foreground mb-6">Your resume matches 87% of the job requirements!</p>
                    
                    <div className="space-y-3 text-left">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-success" />
                        <span className="text-sm">12 skills matched</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-accent" />
                        <span className="text-sm">3 skills to improve</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span className="text-sm">5 suggestions generated</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-primary-foreground/80 text-xl mb-10 max-w-2xl mx-auto">
            Start analyzing your resume today. It's free, fast, and works entirely in your browser.
          </p>
          <Button 
            asChild 
            size="lg" 
            className="bg-primary-foreground dark:text-background text-foreground hover:bg-primary-foreground/90 shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <Link to="/resume">
              Start Free Analysis
              <Sparkles className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
