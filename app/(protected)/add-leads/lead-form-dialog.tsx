"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { LeadFormDialogProps, LeadFormState } from "./types";
import { VALIDATION } from "./constants";

export function LeadFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData = {},
  mode = "add",
}: LeadFormDialogProps) {
  const [formData, setFormData] = useState<LeadFormState>(initialData);
  const [errors, setErrors] = useState<
    Partial<Record<keyof LeadFormState, string>>
  >({});

  const validateField = useCallback(
    (field: keyof LeadFormState, value: string) => {
      if (!value && field !== "company") {
        return `${field} is required`;
      }

      switch (field) {
        case "phone":
          if (!VALIDATION.PHONE.PATTERN.test(value)) {
            return "Invalid phone number format";
          }
          if (
            value.length < VALIDATION.PHONE.MIN_LENGTH ||
            value.length > VALIDATION.PHONE.MAX_LENGTH
          ) {
            return `Phone number must be between ${VALIDATION.PHONE.MIN_LENGTH} and ${VALIDATION.PHONE.MAX_LENGTH} characters`;
          }
          break;

        case "email":
          if (!VALIDATION.EMAIL.PATTERN.test(value)) {
            return "Invalid email format";
          }
          if (value.length > VALIDATION.EMAIL.MAX_LENGTH) {
            return `Email must be less than ${VALIDATION.EMAIL.MAX_LENGTH} characters`;
          }
          break;

        case "name":
          if (value.length < VALIDATION.NAME.MIN_LENGTH) {
            return `Name must be at least ${VALIDATION.NAME.MIN_LENGTH} characters`;
          }
          if (value.length > VALIDATION.NAME.MAX_LENGTH) {
            return `Name must be less than ${VALIDATION.NAME.MAX_LENGTH} characters`;
          }
          break;

        case "company":
          if (value && value.length > VALIDATION.NAME.MAX_LENGTH) {
            return `Company name must be less than ${VALIDATION.NAME.MAX_LENGTH} characters`;
          }
          break;
      }

      return "";
    },
    []
  );

  const handleFieldChange = useCallback(
    (field: keyof LeadFormState, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    },
    [validateField]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      // Validate all fields
      const newErrors: Partial<Record<keyof LeadFormState, string>> = {};
      let hasErrors = false;

      (Object.keys(formData) as Array<keyof LeadFormState>).forEach((field) => {
        const error = validateField(field, formData[field] || "");
        if (error) {
          newErrors[field] = error;
          hasErrors = true;
        }
      });

      if (hasErrors) {
        setErrors(newErrors);
        return;
      }

      onSubmit(formData);
      onOpenChange(false);
    },
    [formData, onSubmit, onOpenChange, validateField]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Lead" : "Edit Lead"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Enter the lead's information below."
              : "Edit the lead's information below."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <div className="grid gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter contact name"
                value={formData.name || ""}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                aria-describedby={errors.name ? "name-error" : undefined}
                required
              />
              {errors.name && (
                <p id="name-error" className="text-sm text-destructive">
                  {errors.name}
                </p>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="company">Company Name (Optional)</Label>
              <Input
                id="company"
                placeholder="Enter company name"
                value={formData.company || ""}
                onChange={(e) => handleFieldChange("company", e.target.value)}
                aria-describedby={errors.company ? "company-error" : undefined}
              />
              {errors.company && (
                <p id="company-error" className="text-sm text-destructive">
                  {errors.company}
                </p>
              )}
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter phone number"
              value={formData.phone || ""}
              onChange={(e) => handleFieldChange("phone", e.target.value)}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              required
            />
            {errors.phone && (
              <p id="phone-error" className="text-sm text-destructive">
                {errors.phone}
              </p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              value={formData.email || ""}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              aria-describedby={errors.email ? "email-error" : undefined}
              required
            />
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive">
                {errors.email}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {mode === "add" ? "Add Lead" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
