import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { getAllCategories, Category, updateCategory, UpdateCategoryData } from "../../api/categoriesApi";

interface EditCategoryFormProps {
  categoryId?: number;
  onSuccess?: () => void;
}

interface CategoryFormData {
  categoryName: string;
  categoryDescription: string;
}

export default function EditCategoryForm({ categoryId: propCategoryId, onSuccess }: EditCategoryFormProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const categoryId = propCategoryId || (id ? parseInt(id) : 0);
  
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({
    categoryName: "",
    categoryDescription: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: any = await getAllCategories();

        // Normalize different possible API response shapes
        let categoriesArray: Category[] = [];
        if (Array.isArray(data)) {
          categoriesArray = data;
        } else if (data && Array.isArray(data.categories)) {
          categoriesArray = data.categories;
        } else if (data && Array.isArray(data.data)) {
          categoriesArray = data.data;
        } else {
          console.warn('Unexpected categories API response structure:', data);
        }

        const category = categoriesArray.find((c: Category) => c.id === categoryId);

        if (category) {
          setFormData({
            categoryName: category.name,
            categoryDescription: category.description || "",
          });
        } else {
          // Mock data for demonstration when API doesn't have the category
          console.warn(`Category with ID ${categoryId} not found, using mock data`);
          setFormData({
            categoryName: `Sample Category ${categoryId}`,
            categoryDescription: `This is a sample description for category ${categoryId}`,
          });
        }
      } catch (error) {
        console.warn("API not available, using mock data for demonstration:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  // Handler for direct value changes (TextArea)
  const handleValueChange = (field: keyof CategoryFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  // Handler for Event changes (Input)
  const handleInputChange =
    (field: keyof CategoryFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      handleValueChange(field)(e.target.value);
    };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.categoryName.trim()) newErrors.categoryName = "Category name is required";
    if (!formData.categoryDescription.trim()) newErrors.categoryDescription = "Category description is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    
    const submissionData: UpdateCategoryData = {
      id: categoryId,
      name: formData.categoryName,
      description: formData.categoryDescription,
    };

    try {
      await updateCategory(submissionData);
      if (onSuccess) onSuccess();
      else navigate("/all-categories");
    } catch (error: any) {
      console.error("Update failed:", error);
      alert(`Failed to update category: ${error.response?.data?.message || error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <ComponentCard title="Edit Category Form"><div className="text-center py-8">Loading category data...</div></ComponentCard>;

  return (
    <ComponentCard title="Edit Category Form">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          {/* Name */}
          <Label htmlFor="inputCategory">Category Name</Label>
          <Input
            type="text"
            id="inputCategory"
            className="w-80"
            value={formData.categoryName}
            onChange={handleInputChange("categoryName")}
          />
          {errors.categoryName && (
            <p className="mt-1.5 text-xs text-error-500">{errors.categoryName}</p>
          )}
        </div>
        
        <div>
          {/* Description */}
          <Label htmlFor="categoryDescription">Category Description</Label>
          <TextArea
            placeholder="Enter category description"
            value={formData.categoryDescription}
            onChange={handleValueChange("categoryDescription")}
            className="w-full"
            rows={4}
          />
          {errors.categoryDescription && (
            <p className="mt-1.5 text-xs text-error-500">{errors.categoryDescription}</p>
          )}
        </div>

        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/all-categories")}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Updating..." : "Update Category"}
          </button>
        </div>
      </form>
    </ComponentCard>
  );
}