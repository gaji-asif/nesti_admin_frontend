import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import MultiSelect from "../../components/form/MultiSelect";
import TextArea from "../../components/form/input/TextArea";
import { useState } from "react";
import { addService } from "../../api/servicesAPI";
import { useCategories, formatCategoryOptions } from "../../hooks/useApiData";

export default function NewServiceForm() {
  const [shortDescription, setShortDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { categories, loading } = useCategories();
  const [formData, setFormData] = useState({
    serviceName: "",
    serviceCategories: [] as string[],
    rating: "",
    city: "",
    address: "",
    serviceWebsite: "",
    is_partner: "",
    discount: "",
    discount_text: "",
  });

  const cityOptions = [
    { label: "Helsinki", value: "helsinki" },
    { label: "Tampere", value: "tampere" },
    { label: "Turku", value: "turku" },
    { label: "Oulu", value: "oulu" },
    { label: "Vantaa", value: "vantaa" },
    { label: "Espoo", value: "espoo" },
  ];

  const categoryOptions = formatCategoryOptions(categories);



  const handleSelectChange = (field: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user makes a selection
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleMultiSelectChange = (selectedCategories: string[]) => {
    setFormData((prev) => ({ ...prev, serviceCategories: selectedCategories }));
    // Clear error when user makes a selection
    if (errors.serviceCategories) {
      setErrors((prev) => ({ ...prev, serviceCategories: "" }));
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
    if (!formData.serviceCategories || formData.serviceCategories.length === 0) {
      newErrors.serviceCategories = "At least one service category is required";
    }
    if (!formData.city) {
      newErrors.city = "Please select a city";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!formData.is_partner) {
      newErrors.is_partner = "Please select if partner";
    }
    if (formData.is_partner === "yes" && !formData.discount.trim()) {
      newErrors.discount = "Discount is required for partners";
    }
    if (formData.is_partner === "yes" && !formData.discount_text.trim()) {
      newErrors.discount_text = "Discount text is required for partners";
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
      
      // Send each category ID as separate form field with same name
      formData.serviceCategories.forEach((categoryId) => {
        formDataToSend.append('category_ids[]', categoryId);
      });
      
      formDataToSend.append('city', formData.city);
      if (formData.rating) formDataToSend.append('rating', formData.rating);
      formDataToSend.append('address', formData.address);
      if (formData.serviceWebsite) formDataToSend.append('website', formData.serviceWebsite);
      formDataToSend.append('short_description', shortDescription);
      formDataToSend.append('is_partner', formData.is_partner === "yes" ? "1" : "0");
      if (formData.is_partner === "yes" && formData.discount) formDataToSend.append('discount', formData.discount);
      if (formData.is_partner === "yes" && formData.discount_text) formDataToSend.append('discount_text', formData.discount_text);
      if (image) formDataToSend.append('image', image);

      try {
        const response = await addService(formDataToSend);
        console.log("✅ Service added successfully:", response);
        
        // Handle the response structure - response is already the service data
        const serviceData = response;
        const serviceName = serviceData.name || formData.serviceName;
        const serviceId = serviceData.id || 'Unknown';
        
        console.log(`Service "${serviceName}" added successfully with ID ${serviceId}`);
        alert("New service added successfully!");
        // Reset form after successful submission
        setFormData({
          serviceName: "",
          serviceCategories: [],
          rating: "",
          city: "",
          address: "",
          serviceWebsite: "",
          is_partner: "",
          discount: "",
          discount_text: "",
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
          <Label>Service Categories</Label>
          <div className="relative">
            <MultiSelect
              label=""
              options={categoryOptions}
              placeholder="Select service categories"
              value={formData.serviceCategories}
              onChange={handleMultiSelectChange}
            />
          </div>
          {errors.serviceCategories && (
            <p className="mt-1.5 text-xs text-error-500">
              {errors.serviceCategories}
            </p>
          )}
        </div>
        <div>
          <Label>City YY</Label>
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
              onClick={() => handleSelectChange("is_partner")("yes")}
              className={`px-4 py-2 rounded-md transition-colors ${
                formData.is_partner === "yes"
                  ? "bg-brand-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-dark-800 dark:text-gray-300 dark:hover:bg-dark-700"
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => handleSelectChange("is_partner")("no")}
              className={`px-4 py-2 rounded-md transition-colors ${
                formData.is_partner === "no"
                  ? "bg-brand-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-dark-800 dark:text-gray-300 dark:hover:bg-dark-700"
              }`}
            >
              No
            </button>
          </div>
          {errors.is_partner && (
            <p className="mt-1.5 text-xs text-error-500">{errors.is_partner}</p>
          )}
        </div>
        {formData.is_partner === "yes" && (
          <>
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
            <div>
              <Label htmlFor="discount_text">Discount Text</Label>
              <Input
                type="text"
                id="discount_text"
                className="w-80"
                value={formData.discount_text}
                onChange={handleInputChange("discount_text")}
                placeholder="Enter discount description"
              />
              {errors.discount_text && (
                <p className="mt-1.5 text-xs text-error-500">{errors.discount_text}</p>
              )}
            </div>
          </>
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
              onChange={(e) => {
                const file = e.target.files?.[0] || null;

                if (!file) {
                  setImage(null);
                  return;
                }

                const isImage = file.type.startsWith("image/");
                const maxSizeBytes = 5 * 1024 * 1024; // 5 MB

                if (!isImage || file.size > maxSizeBytes) {
                  window.alert(
                    `Please select an image file smaller than ${maxSizeBytes / (1024 * 1024)} MB.`
                  );
                  setImage(null);
                  return;
                }

                setImage(file);
              }}
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
