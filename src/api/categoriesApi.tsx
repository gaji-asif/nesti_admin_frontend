import { api } from "./config";
export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}
// Interface for creating a new category
export interface CreateCategoryData {
  name: string;
  description?: string;
}

// Function to add new category
export const addCategory = async (
  categoryData: CreateCategoryData
): Promise<Category> => {
    try {
    const response = await api.post("/add-category", categoryData);

    console.log("Category added successfully:", response.data);
    console.log("Next category Id to be assigned:", response.data.id + 1);
    return response.data;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

// Function to get all categories
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get("/all-categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Function to delete a category
export const deleteCategory = async (id: number): Promise<void> => {
  try {
    await api.delete(`/categories/${id}`);
    console.log("Category deleted successfully");
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};