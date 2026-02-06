import { useState, useRef } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { validateContactForm } from "@/lib/analyzer";
import { 
  HelpCircle, MapPin, Play, Pause,
  Send, CheckCircle, AlertCircle, Navigation, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function About() {
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle contact form
  const handleContactChange = (field: keyof typeof contactForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setContactForm(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error on change
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateContactForm(contactForm.name, contactForm.email, contactForm.message);
    
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    // Simulate form submission
    setFormSubmitted(true);
    setContactForm({ name: "", email: "", message: "" });
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  // Geolocation API
  const handleGetLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoadingLocation(false);
      },
      (error) => {
        let errorMessage = "Unable to get your location.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access was denied. Please enable it in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        setLocationError(errorMessage);
        setIsLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Video controls
  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen py-12 bg-background">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary mb-4">
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Help & About</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              About <span className="text-primary">Resume Analyzer</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Learn how to use our tool effectively and get in touch with us.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Video Tutorial */}
            <Card className="shadow-elevated animate-slide-up overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-primary" />
                  Video Tutorial
                </CardTitle>
                <CardDescription>
                  Watch how to get the most out of Resume Analyzer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group">
                  {/* HTML5 Video Element */}
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    poster="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80"
                    onEnded={() => setIsVideoPlaying(false)}
                  >
                    <source 
                      src="https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4" 
                      type="video/mp4" 
                    />
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* Play/Pause Overlay */}
                  <button
                    onClick={toggleVideo}
                    className={cn(
                      "absolute inset-0 flex items-center justify-center bg-foreground/20 transition-opacity",
                      isVideoPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
                    )}
                  >
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-glow">
                      {isVideoPlaying ? (
                        <Pause className="w-8 h-8 text-primary-foreground" />
                      ) : (
                        <Play className="w-8 h-8 text-primary-foreground ml-1" />
                      )}
                    </div>
                  </button>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  This tutorial covers: entering your resume, adding job descriptions, and understanding your analysis results.
                </p>
              </CardContent>
            </Card>

            {/* Find Career Centers */}
            <Card className="shadow-elevated animate-slide-up animation-delay-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Find Career Centers Near You
                </CardTitle>
                <CardDescription>
                  Discover local resources to help with your job search
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleGetLocation}
                  disabled={isLoadingLocation}
                  className="w-full mb-4 bg-gradient-primary hover:opacity-90"
                >
                  {isLoadingLocation ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Getting Location...
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4 mr-2" />
                      Get My Location
                    </>
                  )}
                </Button>

                {location && (
                  <div className="p-4 bg-success/10 rounded-lg border border-success/20 animate-scale-in">
                    <p className="text-sm font-medium text-success mb-1">Location Found!</p>
                    <p className="text-sm text-muted-foreground">
                      Latitude: {location.lat.toFixed(6)}
                      <br />
                      Longitude: {location.lng.toFixed(6)}
                    </p>
                    <a
                      href={`https://www.google.com/maps/search/career+center/@${location.lat},${location.lng},14z`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                    >
                      <MapPin className="w-4 h-4" />
                      Search career centers nearby
                    </a>
                  </div>
                )}

                {locationError && (
                  <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20 animate-scale-in">
                    <p className="text-sm text-destructive flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {locationError}
                    </p>
                  </div>
                )}

                {!location && !locationError && (
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Click the button above to find career centers, job fairs, and employment resources near your current location.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Form - Full Width */}
          <Card className="shadow-elevated animate-slide-up animation-delay-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" />
                Contact Us
              </CardTitle>
              <CardDescription>
                Have questions or feedback? We'd love to hear from you!
              </CardDescription>
            </CardHeader>
            <CardContent>
              {formSubmitted ? (
                <div className="text-center py-8 animate-scale-in">
                  <div className="w-16 h-16 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-success" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground">
                    Thank you for reaching out. We'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitContact} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Your Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={contactForm.name}
                        onChange={handleContactChange("name")}
                        placeholder="John Doe"
                        className={cn(
                          "transition-all duration-300",
                          formErrors.name && "border-destructive focus:ring-destructive"
                        )}
                      />
                      {formErrors.name && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {formErrors.name}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email Address <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactForm.email}
                        onChange={handleContactChange("email")}
                        placeholder="john@example.com"
                        className={cn(
                          "transition-all duration-300",
                          formErrors.email && "border-destructive focus:ring-destructive"
                        )}
                      />
                      {formErrors.email && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">
                      Message <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      value={contactForm.message}
                      onChange={handleContactChange("message")}
                      placeholder="Tell us what's on your mind..."
                      className={cn(
                        "min-h-[150px] transition-all duration-300",
                        formErrors.message && "border-destructive focus:ring-destructive"
                      )}
                    />
                    {formErrors.message && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary hover:opacity-90 shadow-soft hover:shadow-glow transition-all duration-300"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
