import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getResumeDraft, getJobDescription, saveAnalysis, AnalysisResult } from "@/lib/storage";
import { analyzeResume } from "@/lib/analyzer";
import { 
  BarChart3, Save, History, ArrowLeft, CheckCircle, XCircle, 
  Lightbulb, TrendingUp, RefreshCw, Sparkles 
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Analysis() {
  const navigate = useNavigate();
  const [analysisResult, setAnalysisResult] = useState<{
    matchPercentage: number;
    matchedSkills: string[];
    missingSkills: string[];
    suggestions: string[];
  } | null>(null);
  const [jobInfo, setJobInfo] = useState<{ title: string; company: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  // Run analysis on mount
  useEffect(() => {
    const resume = getResumeDraft();
    const job = getJobDescription();

    if (!resume || !job) {
      navigate("/resume");
      return;
    }

    setJobInfo({ title: job.title, company: job.company });

    // Simulate analysis delay for effect
    setTimeout(() => {
      const result = analyzeResume(resume.content, job.description);
      setAnalysisResult(result);
      setIsAnalyzing(false);

      // Animate percentage
      let current = 0;
      const target = result.matchPercentage;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setAnimatedPercentage(target);
          clearInterval(timer);
        } else {
          setAnimatedPercentage(Math.round(current));
        }
      }, 20);
    }, 1500);
  }, [navigate]);

  // Save analysis to history
  const handleSaveAnalysis = () => {
    if (!analysisResult || !jobInfo) return;

    const resume = getResumeDraft();
    saveAnalysis({
      resumeSnippet: resume?.content.substring(0, 200) || "",
      jobTitle: jobInfo.title,
      company: jobInfo.company,
      matchPercentage: analysisResult.matchPercentage,
      matchedSkills: analysisResult.matchedSkills,
      missingSkills: analysisResult.missingSkills,
      suggestions: analysisResult.suggestions,
    });

    setIsSaved(true);
  };

  // Get match level color and label
  const getMatchLevel = (percentage: number) => {
    if (percentage >= 80) return { color: "text-success", bg: "bg-success", label: "Excellent Match" };
    if (percentage >= 60) return { color: "text-primary", bg: "bg-primary", label: "Good Match" };
    if (percentage >= 40) return { color: "text-accent", bg: "bg-accent", label: "Fair Match" };
    return { color: "text-destructive", bg: "bg-destructive", label: "Needs Work" };
  };

  if (isAnalyzing) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center animate-pulse">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-primary flex items-center justify-center mb-6 animate-spin">
              <RefreshCw className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-2">Analyzing Your Resume</h2>
            <p className="text-muted-foreground">Matching skills and generating insights...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!analysisResult || !jobInfo) return null;

  const matchLevel = getMatchLevel(analysisResult.matchPercentage);

  return (
    <Layout>
      <div className="min-h-screen py-12 bg-background">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary mb-4">
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm font-medium">Step 3 of 3</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Analysis <span className="text-primary">Results</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              {jobInfo.title} at {jobInfo.company}
            </p>
          </div>

          {/* Main Score Card */}
          <Card className="max-w-2xl mx-auto mb-12 shadow-elevated border-2 border-primary/20 animate-scale-in">
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                {/* Animated Score Circle */}
                <div className="relative w-40 h-40 mx-auto mb-6">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="hsl(var(--muted))"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke={`hsl(var(--${analysisResult.matchPercentage >= 60 ? 'primary' : 'accent'}))`}
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${animatedPercentage * 4.4} 440`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={cn("text-5xl font-bold font-display", matchLevel.color)}>
                      {animatedPercentage}%
                    </span>
                    <span className="text-sm text-muted-foreground">Match</span>
                  </div>
                </div>

                <h2 className={cn("text-2xl font-display font-bold mb-2", matchLevel.color)}>
                  {matchLevel.label}
                </h2>
                <p className="text-muted-foreground">
                  Your resume matches {analysisResult.matchedSkills.length} of{" "}
                  {analysisResult.matchedSkills.length + analysisResult.missingSkills.length} required skills
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Skills Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Matched Skills */}
            <Card className="shadow-soft animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-success">
                  <CheckCircle className="w-5 h-5" />
                  Matched Skills ({analysisResult.matchedSkills.length})
                </CardTitle>
                <CardDescription>
                  Skills found in both your resume and the job description
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analysisResult.matchedSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.matchedSkills.map((skill, index) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 bg-success/10 text-success rounded-full text-sm font-medium animate-scale-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No matching skills found</p>
                )}
              </CardContent>
            </Card>

            {/* Missing Skills */}
            <Card className="shadow-soft animate-slide-up animation-delay-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <XCircle className="w-5 h-5" />
                  Missing Skills ({analysisResult.missingSkills.length})
                </CardTitle>
                <CardDescription>
                  Required skills not found in your resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analysisResult.missingSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.missingSkills.map((skill, index) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 bg-destructive/10 text-destructive rounded-full text-sm font-medium animate-scale-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        ✗ {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-success text-sm">Great! All required skills are covered.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Suggestions */}
          <Card className="max-w-3xl mx-auto mb-12 shadow-elevated animate-slide-up animation-delay-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-accent" />
                Improvement Suggestions
              </CardTitle>
              <CardDescription>
                Actionable tips to improve your resume match
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisResult.suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-border hover:border-primary/30 transition-colors animate-scale-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-accent" />
                    </div>
                    <p className="text-sm leading-relaxed">{suggestion}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 animate-slide-up animation-delay-300">
            <Button
              onClick={() => navigate("/job")}
              variant="outline"
              className="group hover:border-primary hover:text-primary transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Edit Job Description
            </Button>
            <Button
              onClick={handleSaveAnalysis}
              disabled={isSaved}
              className={cn(
                "transition-all duration-300",
                isSaved 
                  ? "bg-success hover:bg-success" 
                  : "bg-gradient-primary hover:opacity-90 shadow-soft hover:shadow-glow"
              )}
            >
              {isSaved ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Saved to History
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Analysis
                </>
              )}
            </Button>
            <Button
              onClick={() => navigate("/history")}
              variant="outline"
              className="group hover:border-primary hover:text-primary transition-all duration-300"
            >
              <History className="w-4 h-4 mr-2" />
              View History
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
