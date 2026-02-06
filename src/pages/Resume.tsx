import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { saveResumeDraft, getResumeDraft, clearResumeDraft } from "@/lib/storage";
import { validateResumeContent } from "@/lib/analyzer";
import { FileText, Save, Trash2, ArrowRight, CheckCircle, AlertCircle, Clock, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Resume() {
  const navigate = useNavigate();
  const [resumeText, setResumeText] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [validation, setValidation] = useState<ReturnType<typeof validateResumeContent> | null>(null);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load draft on mount
  useEffect(() => {
    const draft = getResumeDraft();
    if (draft) {
      setResumeText(draft.content);
      setCharCount(draft.content.length);
      setLastSaved(draft.lastSaved);
    }
  }, []);

  // Real-time character count and validation
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setResumeText(text);
    setCharCount(text.length);
    
    // Validate content with regex
    if (text.length > 50) {
      setValidation(validateResumeContent(text));
    } else {
      setValidation(null);
    }
  };

  // Save draft to localStorage
  const handleSaveDraft = () => {
    saveResumeDraft(resumeText);
    setLastSaved(new Date().toISOString());
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 2000);
  };

  // Clear draft
  const handleClearDraft = () => {
    if (window.confirm("Are you sure you want to clear your resume draft?")) {
      clearResumeDraft();
      setResumeText("");
      setCharCount(0);
      setLastSaved(null);
      setValidation(null);
    }
  };

  // Proceed to job description
  const handleContinue = () => {
    if (resumeText.trim().length > 100) {
      saveResumeDraft(resumeText);
      navigate("/job");
    }
  };

  // Format date for display
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <Layout>
      <div className="min-h-screen py-12 bg-background">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary mb-4">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Step 1 of 3</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Enter Your <span className="text-primary">Resume</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Paste your resume content below. We'll extract key information and skills using pattern matching.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Input Card */}
            <div className="lg:col-span-2">
              <Card className="shadow-elevated border-2 hover:border-primary/20 transition-colors duration-300 animate-scale-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Resume Content
                  </CardTitle>
                  <CardDescription>
                    Copy and paste your resume text. Include contact info, experience, and skills.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Textarea
                      ref={textareaRef}
                      value={resumeText}
                      onChange={handleTextChange}
                      placeholder="Paste your resume here...

Example:
John Doe
john.doe@email.com | (555) 123-4567

PROFESSIONAL SUMMARY
Experienced software developer with 5+ years in web development...

SKILLS
JavaScript, React, TypeScript, Node.js, Python, SQL, AWS...

EXPERIENCE
Senior Developer at TechCorp (2020-Present)
- Led development of React-based applications
- Implemented CI/CD pipelines using Jenkins..."
                      className="min-h-[400px] resize-y text-sm font-body leading-relaxed transition-all duration-300 focus:shadow-soft focus:border-primary"
                    />
                    
                    {/* Character count badge */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full transition-colors",
                        charCount < 100 ? "bg-destructive/10 text-destructive" :
                        charCount < 500 ? "bg-accent/20 text-accent-foreground" :
                        "bg-success/10 text-success"
                      )}>
                        {charCount.toLocaleString()} characters
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={handleSaveDraft}
                      variant="outline"
                      className="group hover:border-primary hover:text-primary transition-all duration-300"
                      disabled={resumeText.length === 0}
                    >
                      <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      Save Draft
                    </Button>
                    <Button
                      onClick={handleClearDraft}
                      variant="outline"
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-300"
                      disabled={resumeText.length === 0}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                    <Button
                      onClick={handleContinue}
                      className="ml-auto bg-gradient-primary hover:opacity-90 shadow-soft hover:shadow-glow transition-all duration-300"
                      disabled={resumeText.trim().length < 100}
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>

                  {/* Save success message */}
                  <div className={cn(
                    "flex items-center gap-2 text-success transition-all duration-300",
                    showSaveSuccess ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                  )}>
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Draft saved successfully!</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Validation Status Card */}
              <Card className="shadow-soft animate-slide-up">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    Content Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {validation ? (
                    <>
                      {/* Email detection */}
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                          validation.hasEmail ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                        )}>
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Email Address</p>
                          <p className="text-xs text-muted-foreground">
                            {validation.hasEmail ? validation.emailMatch : "Not detected"}
                          </p>
                        </div>
                      </div>

                      {/* Phone detection */}
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                          validation.hasPhone ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                        )}>
                          <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Phone Number</p>
                          <p className="text-xs text-muted-foreground">
                            {validation.hasPhone ? validation.phoneMatch : "Not detected"}
                          </p>
                        </div>
                      </div>

                      {/* Errors/Warnings */}
                      {validation.errors.length > 0 && (
                        <div className="pt-3 border-t border-border">
                          {validation.errors.map((error, index) => (
                            <div key={index} className="flex items-start gap-2 text-sm text-accent-foreground mb-2">
                              <AlertCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                              <span>{error}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Start typing to see content analysis...
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Last Saved Card */}
              {lastSaved && (
                <Card className="shadow-soft animate-slide-up animation-delay-100">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Last Saved</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(lastSaved)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tips Card */}
              <Card className="shadow-soft bg-secondary/30 animate-slide-up animation-delay-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">💡 Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Include your full contact information
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      List all relevant technical skills
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Mention years of experience
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      Your draft is saved locally
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
