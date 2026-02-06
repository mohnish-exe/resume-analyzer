import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { saveJobDescription, getJobDescription, getResumeDraft } from "@/lib/storage";
import { validateJobDescription, extractSkills } from "@/lib/analyzer";
import { Briefcase, ArrowRight, ArrowLeft, AlertCircle, Sparkles, Code, Users, Database, Cloud } from "lucide-react";
import { cn } from "@/lib/utils";

const skillCategories = [
  { id: "programming", label: "Programming", icon: Code, color: "bg-primary/80" },
  { id: "frontend", label: "Frontend", icon: Sparkles, color: "bg-accent/80" },
  { id: "backend", label: "Backend", icon: Database, color: "bg-success/80" },
  { id: "cloud", label: "Cloud/DevOps", icon: Cloud, color: "bg-secondary" },
  { id: "soft", label: "Soft Skills", icon: Users, color: "bg-muted" },
];

export default function Job() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [hasResume, setHasResume] = useState(false);

  // Load saved job description and check for resume
  useEffect(() => {
    const savedJob = getJobDescription();
    if (savedJob) {
      setFormData({
        title: savedJob.title,
        company: savedJob.company,
        description: savedJob.description,
      });
      setExtractedSkills(extractSkills(savedJob.description));
    }

    const resume = getResumeDraft();
    setHasResume(resume !== null && resume.content.length > 100);
  }, []);

  // Handle input changes
  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Extract skills from description in real-time
    if (field === "description" && value.length > 50) {
      setExtractedSkills(extractSkills(value));
    }
  };

  // Validate and proceed to analysis
  const handleAnalyze = () => {
    const validation = validateJobDescription(formData.title, formData.company, formData.description);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (!hasResume) {
      setErrors(["Please enter your resume first before analyzing."]);
      return;
    }

    // Save job description
    saveJobDescription({
      title: formData.title,
      company: formData.company,
      description: formData.description,
      requirements: extractedSkills,
    });

    navigate("/analysis");
  };

  return (
    <Layout>
      <div className="min-h-screen py-12 bg-background">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary mb-4">
              <Briefcase className="w-4 h-4" />
              <span className="text-sm font-medium">Step 2 of 3</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Job <span className="text-primary">Description</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Enter the job details you're applying for. We'll match your resume against these requirements.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-elevated border-2 hover:border-primary/20 transition-colors duration-300 animate-scale-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Job Details
                  </CardTitle>
                  <CardDescription>
                    Fill in the job information from the posting you're interested in.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Two column layout for title and company */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium">
                        Job Title <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={handleChange("title")}
                        placeholder="e.g., Senior Frontend Developer"
                        className="transition-all duration-300 focus:shadow-soft focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-sm font-medium">
                        Company Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={handleChange("company")}
                        placeholder="e.g., TechCorp Inc."
                        className="transition-all duration-300 focus:shadow-soft focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Job Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">
                      Job Description & Requirements <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={handleChange("description")}
                      placeholder="Paste the full job description here...

Example:
We are looking for an experienced Frontend Developer to join our team.

Requirements:
- 3+ years of experience with React and TypeScript
- Strong understanding of HTML, CSS, and JavaScript
- Experience with REST APIs and GraphQL
- Familiarity with AWS or similar cloud platforms
- Excellent communication and teamwork skills
- Experience with Agile/Scrum methodologies"
                      className="min-h-[300px] resize-y transition-all duration-300 focus:shadow-soft focus:border-primary"
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.description.length} characters
                    </p>
                  </div>

                  {/* Error Messages */}
                  {errors.length > 0 && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-2 animate-scale-in">
                      {errors.map((error, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-destructive">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{error}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-between pt-4">
                    <Button
                      onClick={() => navigate("/resume")}
                      variant="outline"
                      className="group hover:border-primary hover:text-primary transition-all duration-300"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                      Back to Resume
                    </Button>
                    <Button
                      onClick={handleAnalyze}
                      className="bg-gradient-primary hover:opacity-90 shadow-soft hover:shadow-glow transition-all duration-300"
                      disabled={formData.description.length < 50}
                    >
                      Analyze Match
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Extracted Skills Preview */}
              <Card className="shadow-soft animate-slide-up">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Detected Skills
                  </CardTitle>
                  <CardDescription>
                    Skills extracted from the job description
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {extractedSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {extractedSkills.map((skill, index) => (
                        <span
                          key={skill}
                          className={cn(
                            "px-3 py-1 text-xs font-medium rounded-full transition-all duration-300",
                            "hover:scale-105 cursor-default",
                            index % 5 === 0 && "bg-primary/10 text-primary",
                            index % 5 === 1 && "bg-accent/20 text-accent-foreground",
                            index % 5 === 2 && "bg-success/10 text-success",
                            index % 5 === 3 && "bg-secondary text-secondary-foreground",
                            index % 5 === 4 && "bg-muted text-muted-foreground"
                          )}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Enter job description to see detected skills...
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Skill Categories Legend */}
              <Card className="shadow-soft animate-slide-up animation-delay-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Skill Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {skillCategories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <div key={category.id} className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            category.color
                          )}>
                            <Icon className="w-4 h-4 text-foreground" />
                          </div>
                          <span className="text-sm font-medium">{category.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Resume Status */}
              <Card className={cn(
                "shadow-soft animate-slide-up animation-delay-200",
                hasResume ? "bg-success/5 border-success/20" : "bg-accent/10 border-accent/20"
              )}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center",
                      hasResume ? "bg-success/10 text-success" : "bg-accent/20 text-accent"
                    )}>
                      {hasResume ? "✓" : "!"}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Resume Status</p>
                      <p className="text-xs text-muted-foreground">
                        {hasResume ? "Resume loaded and ready" : "No resume found - add one first"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
