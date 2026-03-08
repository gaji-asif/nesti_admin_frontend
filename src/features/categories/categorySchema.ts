export const categorySchema = (values: any) => {
    const errors: Record<string, string> = {};
    if (!values.categoryName?.trim()) {
        errors.categoryName = "Category name is required";
    }
    if (!values.categoryDescription?.trim()) {
        errors.categoryDescription = "Category description is required";
    }
    return errors;
};