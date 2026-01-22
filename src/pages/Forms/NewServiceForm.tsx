import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import TextArea from "../../components/form/input/TextArea";
import { useState, useEffect } from "react";
import { addService } from "../../api/servicesAPI";
import { getAllCategories, Category } from "../../api/categoriesApi";
import { data } from "react-router";

export default function NewServiceForm() {
  const [shortDescription, setShortDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    serviceName: "",
    serviceCategory: "",
    rating: "",
    city: "",
    address: "",
    serviceWebsite: "",
    ispartner: "",
    discount: "",
  });

  const cityOptions = [
    { label: "Helsinki", value: "helsinki" },
    { label: "Tampere", value: "tampere" },
    { label: "Turku", value: "turku" },
    { label: "Oulu", value: "oulu" },
    { label: "Vantaa", value: "vantaa" },
    { label: "Espoo", value: "espoo" },
  ];

  const categoryOptions = categories.map(cat => ({ label: cat.name, value: cat.id.toString() }));

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [services, catsData] = await Promise.all([
          getAllCategories(),
          getAllCategories()
        ]);
        const data: any = catsData;
        console.log('Full API response:', data);
        console.log('Type of data:', typeof data);
        console.log('Is array?', Array.isArray(data));

        // Handle different response structures
        let categoriesArray: Category[] = [];
        if (Array.isArray(data)) {
          categoriesArray = data;
        } else if (data && Array.isArray(data.categories)) {
          categoriesArray = data.categories;
        } else if (data && Array.isArray(data.data)) {
          categoriesArray = data.data;
        } else {
          console.warn('Unexpected API response structure:', data);
        }

        console.log('Categories array:', categoriesArray);
        setCategories(categoriesArray);
      } catch (error) {
        console.warn("API not available, using mock categories:", error);
        setCategories([
          { id: 1, name: "Uniohjaus", description: "", created_at: "", updated_at: "" },
          { id: 2, name: "Imetysohjaus", description: "", created_at: "", updated_at: "" },
          { id: 3, name: "Doula", description: "", created_at: "", updated_at: "" },
          { id: 4, name: "Synnytysvalmennus", description: "", created_at: "", updated_at: "" },
          { id: 5, name: "Fysioterapia (äidit/lapset)", description: "", created_at: "", updated_at: "" },
          { id: 6, name: "Synnytyksen käynnistys", description: "", created_at: "", updated_at: "" },
          { id: 7, name: "Vyöhyketerapia", description: "", created_at: "", updated_at: "" },
          { id: 8, name: "Kahvila", description: "", created_at: "", updated_at: "" },
          { id: 9, name: "Muu", description: "", created_at: "", updated_at: "" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSelectChange = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user makes a selection
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.serviceName.trim()) {
      newErrors.serviceName = "Service name is required";
    }
    if (!formData.serviceCategory.trim()) {
      newErrors.serviceCategory = "Service category is required";
    }
    if (!formData.city) {
      newErrors.city = "Please select a city";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!formData.ispartner) {
      newErrors.ispartner = "Please select if partner";
    }
    if (formData.ispartner === "yes" && !formData.discount.trim()) {
      newErrors.discount = "Discount is required for partners";
    }
    if (!shortDescription.trim()) {
      newErrors.shortDescription = "Short description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.serviceName);
      formDataToSend.append('category_id', formData.serviceCategory);
      formDataToSend.append('city', formData.city);
      if (formData.rating) formDataToSend.append('rating', formData.rating);
      formDataToSend.append('address', formData.address);
      if (formData.serviceWebsite) formDataToSend.append('website', formData.serviceWebsite);
      formDataToSend.append('short_description', shortDescription);
      formDataToSend.append('ispartner', formData.ispartner === "yes" ? "1" : "0");
      if (formData.ispartner === "yes" && formData.discount) formDataToSend.append('discount', formData.discount);
      if (image) formDataToSend.append('image', image);

      try {
        const newService = await addService(formDataToSend);
        console.log("✅ Service added successfully:", newService);
        console.log(`Service "${newService.name}" added successfully with ID ${newService.id}`);
        alert("New service added successfully!");
        // Reset form after successful submission
        setFormData({
          serviceName: "",
          serviceCategory: "",
          rating: "",
          city: "",
          address: "",
          serviceWebsite: "",
          ispartner: "",
          discount: "",
        });
        setShortDescription("");
        setImage(null);
        setErrors({});
      } catch (error) {
        console.error("❌ Error adding service:", error);
        alert("Error adding service. Please try again.");
      }
    }
  };

  if (loading) return <ComponentCard title="New Service Form"><div className="text-center py-8">Loading categories...</div></ComponentCard>;

  return (
    <ComponentCard title="New Service Form">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="inputService">Service Name</Label>
          <Input
            type="text"
            id="inputService"
            className="w-80"
            value={formData.serviceName}
            onChange={handleInputChange("serviceName")}
          />
          {errors.serviceName && (
            <p className="mt-1.5 text-xs text-error-500">{errors.serviceName}</p>
          )}
        </div>
        <div>
          <Label>Service Category</Label>
          <div className="relative">
            <Select
              options={categoryOptions}
              placeholder="Select a service category"
              value={formData.serviceCategory}
              onChange={handleSelectChange("serviceCategory")}
              className="dark:bg-dark-900"
            />
          </div>
          {errors.serviceCategory && (
            <p className="mt-1.5 text-xs text-error-500">
              {errors.serviceCategory}
            </p>
          )}
        </div>
        <div>
          <Label>City</Label>
          <div className="relative">
            <Select
              options={cityOptions}
              placeholder="Select a city"
              onChange={handleSelectChange("city")}
              className="dark:bg-dark-900"
              value={formData.city}
            />
          </div>
          {errors.city && (
            <p className="mt-1.5 text-xs text-error-500">{errors.city}</p>
          )}
        </div>
        <div>
          <Label htmlFor="inputAddress">Address</Label>
          <Input
            type="text"
            id="inputAddress"
            className="w-80"
            value={formData.address}
            onChange={handleInputChange("address")}
            placeholder="Enter service address"
          />
          {errors.address && (
            <p className="mt-1.5 text-xs text-error-500">{errors.address}</p>
          )}
        </div>
        <div>
          <Label htmlFor="serviceWebsite">Service Website</Label>
          <Input
            type="url"
            id="serviceWebsite"
            className="w-80"
            value={formData.serviceWebsite}
            onChange={handleInputChange("serviceWebsite")}
          />
        </div>
        <div>
          <Label>Nesti's Partner</Label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => handleSelectChange("ispartner")("yes")}
              className={`px-4 py-2 rounded-md transition-colors ${
                formData.ispartner === "yes"
                  ? "bg-brand-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-dark-800 dark:text-gray-300 dark:hover:bg-dark-700"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => handleSelectChange("ispartner")("no")}
              className={`px-4 py-2 rounded-md transition-colors ${
                formData.ispartner === "no"
                  ? "bg-brand-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-dark-800 dark:text-gray-300 dark:hover:bg-dark-700"
              }`}
            >
              No
            </button>
          </div>
          {errors.ispartner && (
            <p className="mt-1.5 text-xs text-error-500">{errors.ispartner}</p>
          )}
        </div>
        {formData.ispartner === "yes" && (
          <div>
            <Label htmlFor="discount">Discount</Label>
            <Input
              type="text"
              id="discount"
              className="w-80"
              value={formData.discount}
              onChange={handleInputChange("discount")}
              placeholder="Enter discount"
            />
            {errors.discount && (
              <p className="mt-1.5 text-xs text-error-500">{errors.discount}</p>
            )}
          </div>
        )}
        <div>
          <Label htmlFor="shortDescription">Short Description</Label>
          <TextArea
            rows={3}
            value={shortDescription}
            onChange={(value) => {
              setShortDescription(value);
              if (errors.shortDescription) {
                setErrors((prev) => ({ ...prev, shortDescription: "" }));
              }
            }}
            placeholder="Enter a short description"
            className="w-80"
            error={!!errors.shortDescription}
            hint={errors.shortDescription}
          />
        </div>
        <div>
          <Label htmlFor="image">Service Image</Label>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="hidden"
            />
            <label
              htmlFor="image"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md cursor-pointer hover:bg-gray-300 dark:bg-dark-800 dark:text-gray-300 dark:hover:bg-dark-700 transition-colors"
            >
              Choose File
            </label>
            {image && <span className="text-sm text-gray-600 dark:text-gray-400">{image.name}</span>}
          </div>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium rounded-md transition-colors bg-brand-500 text-white hover:bg-brand-600"
          >
            Submit
          </button>
        </div>
      </form>
    </ComponentCard>
  );
}
