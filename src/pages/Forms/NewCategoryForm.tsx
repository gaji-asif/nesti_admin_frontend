import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import { useState } from "react";
import { addCategory } from "../../api/categoriesApi";

interface CategoryForm {
  categoryName: string;
  categoryDescription: string;
}

export default function AddCategory() {
  const [formData, setFormData] = useState<CategoryForm>({
    categoryName: "",
    categoryDescription: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);

  // For components that return an Event (Input)
  const handleInputChange = (field: keyof CategoryForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.categoryName.trim()) {
      newErrors.categoryName = "Category name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const categoryData = {
        name: formData.categoryName,
        description: formData.categoryDescription,
      };
      const newCategory = await addCategory(categoryData);
      alert("Category added successfully!");
      console.log("New category:", newCategory);
      // Reset form
      setFormData({
        categoryName: "",
        categoryDescription: "",
      });
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ComponentCard title="Add New Category">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Name */}
        <div>
          <Label htmlFor="categoryName">Category Name</Label>
          <Input
            type="text"
            id="categoryName"
            value={formData.categoryName}
            onChange={handleInputChange("categoryName")} // Standardized
            className="w-80"
            placeholder="Enter category name"
          />
          {errors.categoryName && (<p className="mt-1 text-sm text-red-600">{errors.categoryName}</p>
          )}
        </div>
        {/* Category Description */}
        <div>
          <Label htmlFor="categoryDescription">Category Description</Label>
          <TextArea
            value={formData.categoryDescription}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                categoryDescription: value,
              }))
            }
            rows={4}
            placeholder="Enter category description"
          />
        </div>
        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium rounded-md transition-colors bg-brand-500 text-white hover:bg-brand-600"
          >
{
            submitting ? "Adding..." : "Add Category"
}          </button>
        </div>
      </form>
    </ComponentCard>
  );
}
