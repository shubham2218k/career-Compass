import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { CalendarIcon, UserIcon } from "lucide-react";

interface PersonalDetails {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  location: string;
  currentStage: string;
}

interface PersonalDetailsFormProps {
  onNext: (data: PersonalDetails) => void;
  onBack?: () => void;
}

export default function PersonalDetailsForm({ onNext, onBack }: PersonalDetailsFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<PersonalDetails>({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    location: "",
    currentStage: ""
  });

  const [errors, setErrors] = useState<Partial<PersonalDetails>>({});

  const currentStages = [
    { value: "after-10th", label: "Completed 10th Grade" },
    { value: "after-12th", label: "Completed 12th Grade" },
    { value: "undergraduate", label: "Undergraduate Student" },
    { value: "graduate", label: "Graduate" },
    { value: "postgraduate", label: "Postgraduate" },
    { value: "working-professional", label: "Working Professional" },
    { value: "career-changer", label: "Looking for Career Change" },
    { value: "other", label: "Other" }
  ];

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "non-binary", label: "Non-binary" },
    { value: "prefer-not-to-say", label: "Prefer not to say" }
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<PersonalDetails> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select your gender";
    }

    if (!formData.currentStage) {
      newErrors.currentStage = "Please select your current stage";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext(formData);
    }
  };

  const handleInputChange = (field: keyof PersonalDetails, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-heading">Personal Details</CardTitle>
          <CardDescription>
            Let's start by getting to know you better. This information helps us personalize your career guidance experience.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  data-testid="input-full-name"
                  className={errors.fullName ? "border-destructive" : ""}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  data-testid="input-email"
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  data-testid="input-phone"
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <div className="relative">
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    data-testid="input-date-of-birth"
                    className={errors.dateOfBirth ? "border-destructive" : ""}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  <CalendarIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
                {errors.dateOfBirth && (
                  <p className="text-sm text-destructive">{errors.dateOfBirth}</p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange("gender", value)}
                  data-testid="select-gender"
                >
                  <SelectTrigger className={errors.gender ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-destructive">{errors.gender}</p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location (Optional)</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="City, State/Region"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  data-testid="input-location"
                />
              </div>
            </div>

            {/* Current Stage */}
            <div className="space-y-2">
              <Label htmlFor="currentStage">Current Educational/Professional Stage *</Label>
              <Select
                value={formData.currentStage}
                onValueChange={(value) => handleInputChange("currentStage", value)}
                data-testid="select-current-stage"
              >
                <SelectTrigger className={errors.currentStage ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select your current stage" />
                </SelectTrigger>
                <SelectContent>
                  {currentStages.map((stage) => (
                    <SelectItem key={stage.value} value={stage.value}>
                      {stage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.currentStage && (
                <p className="text-sm text-destructive">{errors.currentStage}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-between pt-6">
              {onBack && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onBack}
                  data-testid="button-back"
                >
                  Back
                </Button>
              )}
              
              <Button 
                type="submit" 
                className="ml-auto"
                data-testid="button-next"
              >
                Continue to Career Discovery
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}