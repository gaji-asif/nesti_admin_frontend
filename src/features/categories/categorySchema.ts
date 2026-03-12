interface CategoryValues {
    categoryName?: string;
    categoryDescription?: string;
}

export const categorySchema = (values: CategoryValues) => {
    const errors: Record<string, string> = {};
    if (!values.categoryName?.trim()) {
        errors.categoryName = "Category name is required";
    }
    if (!values.categoryDescription?.trim()) {
        errors.categoryDescription = "Category description is required";
    }
    return errors;
};