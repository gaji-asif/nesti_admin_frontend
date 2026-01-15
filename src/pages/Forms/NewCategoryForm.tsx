import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import { useState } from "react";

export default function AddCategory() {
  const [newCategory, setNewCategory] = useState({
    categoryName: "",
    categoryDescription: "",
  });

  // Generic handler - cleaner, less code, scalable
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setNewCategory((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", newCategory);
  };

  return (
    <ComponentCard title="Add New Category">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="categoryName">Category Name</Label>
          <Input
            type="text"
            id="categoryName" // Used by the generic handler
            value={newCategory.categoryName}
            onChange={handleChange} // Standardized
            className="w-80"
            placeholder="Enter category name"
          />
        </div>
        <div>
          <Label htmlFor="categoryDescription">Category Description</Label>
          <TextArea
            value={newCategory.categoryDescription}
            onChange={(value) =>
              setNewCategory((prev) => ({
                ...prev,
                categoryDescription: value,
              }))
            }
            rows={4}
            placeholder="Enter category description"
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium rounded-md transition-colors bg-brand-500 text-white hover:bg-brand-600"
          >
            Add Category
          </button>
        </div>
      </form>
    </ComponentCard>
  );
}
