import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SparklesIcon } from "lucide-react";

interface PersonalityAnswer {
  questionId: string;
  answer: string;
}

interface PersonalitySnapshotProps {
  onNext: (data: PersonalityAnswer[]) => void;
  onBack: () => void;
}

interface Question {
  id: string;
  question: string;
  options: Array<{
    value: string;
    label: string;
    icon: string;
  }>;
}

const personalityQuestions: Question[] = [
  {
    id: "project-approach",
    question: "You're starting a new project, your first instinct is...",
    options: [
      { value: "plan", label: "Make a plan & break it into steps", icon: "📋" },
      { value: "ideas", label: "Jump in with new ideas", icon: "💡" },
      { value: "consult", label: "Ask friends/mentors for inputs", icon: "👥" },
      { value: "experiment", label: "Experiment until it works", icon: "🧪" }
    ]
  },
  {
    id: "group-role",
    question: "Which role suits you best in a group project?",
    options: [
      { value: "problem-solver", label: "Problem solver", icon: "🧑‍💻" },
      { value: "creative-thinker", label: "Creative thinker", icon: "🎨" },
      { value: "leader", label: "Leader/organizer", icon: "📢" },
      { value: "supporter", label: "Supporter/helper", icon: "🤝" }
    ]
  },
  {
    id: "decision-making",
    question: "When making important decisions, you prefer to...",
    options: [
      { value: "analyze-data", label: "Analyze all available data", icon: "📊" },
      { value: "trust-intuition", label: "Trust your gut feeling", icon: "✨" },
      { value: "seek-advice", label: "Seek advice from others", icon: "💬" },
      { value: "quick-action", label: "Make quick decisions and adapt", icon: "⚡" }
    ]
  },
  {
    id: "learning-style",
    question: "How do you learn new things best?",
    options: [
      { value: "hands-on", label: "Hands-on practice", icon: "🔧" },
      { value: "visual", label: "Visual aids and diagrams", icon: "📈" },
      { value: "discussion", label: "Discussion and collaboration", icon: "💭" },
      { value: "structured", label: "Structured courses and reading", icon: "📚" }
    ]
  },
  {
    id: "work-pace",
    question: "What work pace motivates you most?",
    options: [
      { value: "fast-dynamic", label: "Fast-paced and dynamic", icon: "🚀" },
      { value: "steady-consistent", label: "Steady and consistent", icon: "🎯" },
      { value: "flexible-varied", label: "Flexible with varied tasks", icon: "🔄" },
      { value: "focused-deep", label: "Deep focus on complex problems", icon: "🧠" }
    ]
  },
  {
    id: "communication-style",
    question: "How do you prefer to communicate ideas?",
    options: [
      { value: "presentations", label: "Presentations and speaking", icon: "🎤" },
      { value: "writing", label: "Writing and documentation", icon: "✍️" },
      { value: "visual-design", label: "Visual design and graphics", icon: "🎨" },
      { value: "one-on-one", label: "One-on-one conversations", icon: "👥" }
    ]
  },
  {
    id: "problem-solving",
    question: "When facing a complex problem, you...",
    options: [
      { value: "break-down", label: "Break it into smaller parts", icon: "🧩" },
      { value: "big-picture", label: "Look at the big picture first", icon: "🌎" },
      { value: "research", label: "Research similar solutions", icon: "🔍" },
      { value: "brainstorm", label: "Brainstorm creative alternatives", icon: "🌟" }
    ]
  },
  {
    id: "success-definition",
    question: "Success for you means...",
    options: [
      { value: "achievement", label: "Achieving goals and recognition", icon: "🏆" },
      { value: "impact", label: "Making a meaningful impact", icon: "❤️" },
      { value: "growth", label: "Continuous learning and growth", icon: "📈" },
      { value: "balance", label: "Balance and personal fulfillment", icon: "⚖️" }
    ]
  }
];

export default function PersonalitySnapshot({ onNext, onBack }: PersonalitySnapshotProps) {
  const [answers, setAnswers] = useState<PersonalityAnswer[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => {
      const existing = prev.filter(a => a.questionId !== questionId);
      return [...existing, { questionId, answer }];
    });

    // Clear error for this question
    if (errors[questionId]) {
      setErrors(prev => ({ ...prev, [questionId]: "" }));
    }
  };

  const getAnswerForQuestion = (questionId: string): string => {
    const answer = answers.find(a => a.questionId === questionId);
    return answer?.answer || "";
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    personalityQuestions.forEach(question => {
      if (!getAnswerForQuestion(question.id)) {
        newErrors[question.id] = "Please select an answer";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onNext(answers);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <SparklesIcon className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-heading">Career Personality Snapshot</CardTitle>
          <CardDescription>
            Discover your work style and preferences through these scenario-based questions. 
            Choose the option that feels most natural to you.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {personalityQuestions.map((question, index) => (
            <div key={question.id} className="space-y-4">
              <div className="pb-2">
                <Label className="text-lg font-semibold">
                  {index + 1}. {question.question}
                </Label>
                {errors[question.id] && (
                  <p className="text-sm text-destructive mt-1">{errors[question.id]}</p>
                )}
              </div>

              <RadioGroup
                value={getAnswerForQuestion(question.id)}
                onValueChange={(value) => handleAnswerChange(question.id, value)}
                data-testid={`radio-group-${question.id}`}
                className="space-y-3"
              >
                {question.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3">
                    <RadioGroupItem 
                      value={option.value} 
                      id={`${question.id}-${option.value}`}
                      className="flex-shrink-0"
                    />
                    <Label 
                      htmlFor={`${question.id}-${option.value}`}
                      className="cursor-pointer flex items-center gap-3 flex-1 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                      data-testid={`option-${question.id}-${option.value}`}
                    >
                      <span className="text-2xl flex-shrink-0">{option.icon}</span>
                      <span className="text-sm font-medium">{option.label}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}

          {/* Progress indicator */}
          <div className="text-center pt-4 pb-2">
            <p className="text-sm text-muted-foreground">
              Progress: {answers.length} of {personalityQuestions.length} questions completed
            </p>
            <div className="w-full bg-secondary rounded-full h-2 mt-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(answers.length / personalityQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBack}
              data-testid="button-back"
            >
              Back to Career Survey
            </Button>
            
            <Button 
              onClick={handleSubmit}
              data-testid="button-complete-assessment"
              disabled={answers.length < personalityQuestions.length}
            >
              Complete Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}