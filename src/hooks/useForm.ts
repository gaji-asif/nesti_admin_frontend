import { useState, useCallback } from "react";

export function useForm<T>(
    initialValues: T,
    validate?: (values: T) => Record<string, string>
) {
    const [formData, setFormData] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    // Use useCallback to memoize the handleChange function, preventing unnecessary re-renders
    const handleChange = useCallback((field: keyof T, value: T[keyof T]) => {
        // cast because TypeScript cannot infer dynamic key assignment precisely here
        setFormData(prev => ({ ...prev, [field]: value } as unknown as T));

        // Clear error for this field on change
        setErrors(prev => {
            const key = String(field);
            if (!prev[key]) return prev;
            const newErrors = { ...prev };
            delete newErrors[key];
            return newErrors;
        });
    }, []);

    const resetForm = useCallback(() => {
        setFormData(initialValues);
        setErrors({});
        setSubmitting(false);
    }, [initialValues]);

    const runValidation = useCallback(() => {
        if (!validate) return true;
        const newErrors = validate(formData);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, validate]);

    return {
        formData,
        setFormData,
        errors,
        setErrors,
        submitting,
        setSubmitting,
        handleChange,
        resetForm,
        runValidation
    };
}