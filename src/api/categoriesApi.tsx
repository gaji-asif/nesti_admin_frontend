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
    const data = response.data as Category;
    console.log("Next category Id to be assigned:", (typeof data.id === 'number') ? data.id + 1 : data.id);
    return data;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

// Function to get all categories
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get("/all-categories");
    return response.data as Category[];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
// Interface for updating a category
export interface UpdateCategoryData {
  id: number;
  name?: string;
  description?: string;
}

// Function to update a category
export const updateCategory = async (
  categoryData: UpdateCategoryData
): Promise<Category> => {
  try {
    const { id, ...updateData } = categoryData;
    const response = await api.patch(`/categories/${id}`, updateData);
    const data = response.data as Category;
    console.log("Category updated successfully:", data);
    return data;
  } catch (error) {
    console.error("Error updating category:", error);
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

// Function to update a category
export const updateCategoryById = async (
  id: number,
  categoryData: CreateCategoryData
): Promise<Category> => {
  try {
    const response = await api.patch(`/categories/${id}`, categoryData);
    const data = response.data as Category;
    console.log("Category updated successfully:", data);
    return data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};