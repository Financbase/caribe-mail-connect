import { z } from 'zod';

// Authentication validation schemas
export const loginSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must be less than 128 characters')
});

export const signupSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'First name contains invalid characters'),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Last name contains invalid characters'),
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Customer validation schema
export const customerSchema = z.object({
  first_name: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'First name contains invalid characters'),
  last_name: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Last name contains invalid characters'),
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  phone: z.string()
    .regex(/^(\+1|1)?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  business_name: z.string()
    .max(100, 'Business name must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  mailbox_number: z.string()
    .min(1, 'Mailbox number is required')
    .max(20, 'Mailbox number must be less than 20 characters')
    .regex(/^[A-Z0-9-]+$/, 'Mailbox number can only contain letters, numbers, and dashes'),
  address_line1: z.string()
    .min(1, 'Address is required')
    .max(100, 'Address must be less than 100 characters'),
  address_line2: z.string()
    .max(100, 'Address line 2 must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  city: z.string()
    .min(1, 'City is required')
    .max(50, 'City must be less than 50 characters')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'City contains invalid characters'),
  state: z.string()
    .min(2, 'State is required')
    .max(2, 'State must be 2 characters')
    .regex(/^[A-Z]{2}$/, 'State must be 2 uppercase letters'),
  zip_code: z.string()
    .min(5, 'ZIP code is required')
    .max(10, 'ZIP code must be less than 10 characters')
    .regex(/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code'),
  country: z.string()
    .min(2, 'Country is required')
    .max(2, 'Country must be 2 characters')
    .regex(/^[A-Z]{2}$/, 'Country must be 2 uppercase letters'),
  customer_type: z.enum(['individual', 'business'], {
    required_error: 'Please select a customer type'
  }),
  notes: z.string()
    .max(500, 'Notes must be less than 500 characters')
    .optional()
    .or(z.literal(''))
});

// Package validation schema
export const packageSchema = z.object({
  tracking_number: z.string()
    .min(1, 'Tracking number is required')
    .max(50, 'Tracking number must be less than 50 characters')
    .regex(/^[A-Z0-9]+$/, 'Tracking number can only contain letters and numbers'),
  carrier: z.enum(['UPS', 'FedEx', 'USPS', 'DHL', 'Other'], {
    required_error: 'Please select a carrier'
  }),
  customer_id: z.string()
    .uuid('Please select a valid customer'),
  customer_name: z.string()
    .min(1, 'Customer name is required')
    .max(100, 'Customer name must be less than 100 characters'),
  size: z.enum(['Small', 'Medium', 'Large'], {
    required_error: 'Please select a package size'
  }),
  special_handling: z.boolean(),
  weight: z.string()
    .max(20, 'Weight must be less than 20 characters')
    .optional()
    .or(z.literal('')),
  dimensions: z.string()
    .max(50, 'Dimensions must be less than 50 characters')
    .optional()
    .or(z.literal('')),
  requires_signature: z.boolean(),
  notes: z.string()
    .max(500, 'Notes must be less than 500 characters')
    .optional()
    .or(z.literal(''))
});

// Search validation schema
// API Key validation
export const apiKeySchema = z.object({
  name: z.string()
    .min(1, 'API key name is required')
    .max(50, 'API key name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9\s_-]+$/, 'API key name contains invalid characters'),
  permissions: z.array(z.string())
    .min(1, 'At least one permission is required'),
  rate_limit: z.number()
    .min(1, 'Rate limit must be at least 1')
    .max(1000, 'Rate limit cannot exceed 1000 requests per minute')
});

// Webhook validation
export const webhookSchema = z.object({
  name: z.string()
    .min(1, 'Webhook name is required')
    .max(50, 'Webhook name must be less than 50 characters'),
  url: z.string()
    .url('Please enter a valid URL')
    .startsWith('https://', 'Webhook URL must use HTTPS'),
  events: z.array(z.string())
    .min(1, 'At least one event is required'),
  secret: z.string()
    .min(32, 'Webhook secret must be at least 32 characters')
    .max(255, 'Webhook secret must be less than 255 characters')
});

// Search validation
export const searchSchema = z.object({
  query: z.string()
    .min(1, 'Search query is required')
    .max(100, 'Search query must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s@.-]+$/, 'Search contains invalid characters')
});

// Role management validation schema
export const roleSchema = z.object({
  user_id: z.string().uuid('Invalid user ID'),
  role: z.enum(['admin', 'manager', 'staff'], {
    required_error: 'Please select a valid role'
  })
});

// Export types for form data
export type LoginFormData = z.infer<typeof loginSchema>;
export type ApiKeyFormData = z.infer<typeof apiKeySchema>;
export type WebhookFormData = z.infer<typeof webhookSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type CustomerFormData = z.infer<typeof customerSchema>;
export type PackageFormData = z.infer<typeof packageSchema>;
export type SearchFormData = z.infer<typeof searchSchema>;
export type RoleFormData = z.infer<typeof roleSchema>;

// Validation helper functions
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: error.errors.map(err => err.message) 
      };
    }
    return { 
      success: false, 
      errors: ['Invalid input data'] 
    };
  }
}

// Sanitization functions
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential script tags
    .slice(0, 1000); // Limit length
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function sanitizePhoneNumber(phone: string): string {
  return phone.replace(/[^\d+()-.\s]/g, '').trim();
}