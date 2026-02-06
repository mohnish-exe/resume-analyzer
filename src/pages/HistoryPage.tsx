import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Accordion, AccordionContent, AccordionItem, AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  getAnalysisHistory, deleteAnalysis, clearAnalysisHistory, 
  sortByDate, sortByMatch, AnalysisResult 
} from "@/lib/storage";
import { 
  History, Trash2, ArrowUpDown, Calendar, TrendingUp, 
  CheckCircle, XCircle, AlertCircle, Lightbulb 
} from "lucide-react";
import { cn } from "@/lib/utils";

type SortType = "date-desc" | "date-asc" | "match-desc" | "match-asc";

export default function HistoryPage() {
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [sortType, setSortType] = useState<SortType>("date-desc");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const data = getAnalysisHistory();
    setHistory(applySorting(data, sortType));
  };

  // Apply sorting using control flow
  const applySorting = (data: AnalysisResult[], sort: SortType): AnalysisResult[] => {
    switch (sort) {
      case "date-desc":
        return sortByDate(data, false);
      case "date-asc":
        return sortByDate(data, true);
      case "match-desc":
        return sortByMatch(data, false);
      case "match-asc":
        return sortByMatch(data, true);
      default:
        return data;
    }
  };

  // Handle sort change
  const handleSortChange = (newSort: SortType) => {
    setSortType(newSort);
    setHistory(applySorting(history, newSort));
  };

  // Handle delete single analysis
  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      deleteAnalysis(id);
      loadHistory();
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      // Auto-cancel confirmation after 3 seconds
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  // Handle clear all
  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to delete all analysis history? This cannot be undone.")) {
      clearAnalysisHistory();
      setHistory([]);
    }
  };

  // Format date
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get match color
  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return "text-success bg-success/10";
    if (percentage >= 60) return "text-primary bg-primary/10";
    if (percentage >= 40) return "text-accent bg-accent/20";
    return "text-destructive bg-destructive/10";
  };

  return (
    <Layout>
      <div className="min-h-screen py-12 bg-background">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary mb-4">
              <History className="w-4 h-4" />
              <span className="text-sm font-medium">Analysis History</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Your <span className="text-primary">History</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Track your resume analyses over time. All data is stored locally in your browser.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 animate-slide-up">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <div className="flex gap-1">
                <Button
                  variant={sortType.startsWith("date") ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSortChange(sortType === "date-desc" ? "date-asc" : "date-desc")}
                  className="gap-1"
                >
                  <Calendar className="w-4 h-4" />
                  Date
                  <ArrowUpDown className="w-3 h-3" />
                </Button>
                <Button
                  variant={sortType.startsWith("match") ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSortChange(sortType === "match-desc" ? "match-asc" : "match-desc")}
                  className="gap-1"
                >
                  <TrendingUp className="w-4 h-4" />
                  Match %
                  <ArrowUpDown className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            {history.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          {/* History List */}
          {history.length > 0 ? (
            <div className="max-w-4xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {history.map((item, index) => (
                  <AccordionItem
                    key={item.id}
                    value={item.id}
                    className="border-2 rounded-lg overflow-hidden hover:border-primary/30 transition-colors animate-scale-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/30">
                      <div className="flex items-center gap-4 w-full">
                        {/* Match Score Badge */}
                        <div className={cn(
                          "w-16 h-16 rounded-xl flex flex-col items-center justify-center flex-shrink-0",
                          getMatchColor(item.matchPercentage)
                        )}>
                          <span className="text-2xl font-bold">{item.matchPercentage}%</span>
                        </div>
                        
                        {/* Job Info */}
                        <div className="text-left flex-grow">
                          <h3 className="font-display text-lg font-semibold">{item.jobTitle}</h3>
                          <p className="text-sm text-muted-foreground">{item.company}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(item.analyzedAt)}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    
                    <AccordionContent className="px-6 pb-6">
                      <div className="space-y-6 pt-4 border-t border-border">
                        {/* Skills Summary */}
                        <div className="grid md:grid-cols-2 gap-4">
                          {/* Matched */}
                          <div className="p-4 bg-success/5 rounded-lg border border-success/20">
                            <div className="flex items-center gap-2 mb-3">
                              <CheckCircle className="w-4 h-4 text-success" />
                              <span className="font-medium text-sm">Matched ({item.matchedSkills.length})</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {item.matchedSkills.slice(0, 8).map(skill => (
                                <span key={skill} className="px-2 py-0.5 bg-success/10 text-success rounded text-xs">
                                  {skill}
                                </span>
                              ))}
                              {item.matchedSkills.length > 8 && (
                                <span className="text-xs text-muted-foreground">
                                  +{item.matchedSkills.length - 8} more
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Missing */}
                          <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                            <div className="flex items-center gap-2 mb-3">
                              <XCircle className="w-4 h-4 text-destructive" />
                              <span className="font-medium text-sm">Missing ({item.missingSkills.length})</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {item.missingSkills.slice(0, 8).map(skill => (
                                <span key={skill} className="px-2 py-0.5 bg-destructive/10 text-destructive rounded text-xs">
                                  {skill}
                                </span>
                              ))}
                              {item.missingSkills.length > 8 && (
                                <span className="text-xs text-muted-foreground">
                                  +{item.missingSkills.length - 8} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Suggestions */}
                        {item.suggestions.length > 0 && (
                          <div className="p-4 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                              <Lightbulb className="w-4 h-4 text-accent" />
                              <span className="font-medium text-sm">Suggestions</span>
                            </div>
                            <ul className="space-y-2">
                              {item.suggestions.slice(0, 3).map((suggestion, i) => (
                                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <span className="text-primary">•</span>
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Delete Button */}
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className={cn(
                              "transition-all duration-300",
                              deleteConfirm === item.id 
                                ? "bg-destructive text-destructive-foreground hover:bg-destructive" 
                                : "text-destructive hover:bg-destructive/10"
                            )}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {deleteConfirm === item.id ? "Click to confirm" : "Delete"}
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ) : (
            <Card className="max-w-md mx-auto text-center animate-scale-in">
              <CardContent className="pt-12 pb-12">
                <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
                  <AlertCircle className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">No History Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Complete an analysis and save it to see your history here.
                </p>
                <Button
                  onClick={() => window.location.href = "/resume"}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  Start Your First Analysis
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
