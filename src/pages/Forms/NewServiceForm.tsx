import ComponentCard from "../../components/common/ComponentCard";
import { FormGroup } from "../../components/form/FormGroup";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import MultiSelect from "../../components/form/MultiSelect";
import TextArea from "../../components/form/input/TextArea";
import { addService } from "../../api/servicesAPI";
import { useCategories, formatCategoryOptions } from "../../hooks/useApiData";
import { useForm } from "../../hooks/useForm";

type PartnerFlag = "yes" | "no" | "";

interface ServiceFormData {
  serviceName: string;
  serviceCategories: string[];
  rating: string;
  city: string;
  address: string;
  serviceWebsite: string;
  is_partner: PartnerFlag;
  discount: string;
  discount_text: string;
  shortDescription: string;
  image: File | null;
}

export default function NewServiceForm() {
  const { categories, loading } = useCategories();

  const initialForm: ServiceFormData = {
    serviceName: "",
    serviceCategories: [],
    rating: "",
    city: "",
    address: "",
    serviceWebsite: "",
    is_partner: "",
    discount: "",
    discount_text: "",
    shortDescription: "",
    image: null,
  };

  const validateService = (values: ServiceFormData) => {
    const newErrors: Record<string, string> = {};
    if (!values.serviceName.trim()) newErrors.serviceName = "Service name is required";
    if (!values.serviceCategories.length) newErrors.serviceCategories = "At least one category is required";
    if (!values.city) newErrors.city = "Please select a city";
    if (!values.address.trim()) newErrors.address = "Address is required";
    if (!values.is_partner) newErrors.is_partner = "Please select if partner";
    if (values.is_partner === "yes") {
      if (!values.discount.trim()) newErrors.discount = "Discount is required";
      if (!values.discount_text.trim()) newErrors.discount_text = "Discount text is required";
    }
    if (!values.shortDescription.trim()) newErrors.shortDescription = "Short description is required";
    return newErrors;
  };

  const { 
    formData, 
    errors, 
    submitting, 
    setSubmitting, 
    handleChange, 
    runValidation, 
    resetForm 
  } = useForm<ServiceFormData>(initialForm, validateService);

  const cityOptions = [
    { label: "Helsinki", value: "helsinki" },
    { label: "Tampere", value: "tampere" },
    { label: "Turku", value: "turku" },
    { label: "Oulu", value: "oulu" },
    { label: "Vantaa", value: "vantaa" },
    { label: "Espoo", value: "espoo" },
    { label: "Lahti", value: "lahti" },
    { label: "Raisio", value: "raisio" },
  ];

  const categoryOptions = formatCategoryOptions(categories);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!runValidation()) return;

    setSubmitting(true);
    const formDataToSend = new FormData();

    // Mapping dữ liệu sang FormData
    formDataToSend.append('name', formData.serviceName);
    formData.serviceCategories.forEach((id) => formDataToSend.append('category_ids[]', id));
    formDataToSend.append('city', formData.city);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('short_description', formData.shortDescription);
    formDataToSend.append('is_partner', formData.is_partner === "yes" ? "1" : "0");
    
    if (formData.rating) formDataToSend.append('rating', formData.rating);
    if (formData.serviceWebsite) formDataToSend.append('website', formData.serviceWebsite);
    
    if (formData.is_partner === "yes") {
      formDataToSend.append('discount', formData.discount);
      formDataToSend.append('discount_text', formData.discount_text);
    }
    
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      await addService(formDataToSend);
      alert("✅ New service added successfully!");
      resetForm();
    } catch (error) {
      console.error("❌ Error adding service:", error);
      alert("Error adding service. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <ComponentCard title="New Service Form">
      <div className="text-center py-8">Loading categories...</div>
    </ComponentCard>
  );

  return (
    <ComponentCard title="New Service Form">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormGroup label="Service Name" htmlFor="serviceName" error={errors.serviceName}>
          <Input
            id="serviceName"
            className="w-full"
            value={formData.serviceName}
            onChange={(e) => handleChange("serviceName", e.target.value)}
          />
        </FormGroup>

        <FormGroup label="Service Categories" error={errors.serviceCategories}>
          <MultiSelect
            options={categoryOptions}
            placeholder="Select service categories"
            value={formData.serviceCategories}
            onChange={(selected) => handleChange("serviceCategories", selected)} label={""}          />
        </FormGroup>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormGroup label="City" error={errors.city}>
            <Select
              options={cityOptions}
              placeholder="Select a city"
              value={formData.city}
              onChange={(val) => handleChange("city", val)}
            />
          </FormGroup>

          <FormGroup label="Address" error={errors.address}>
            <Input
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Enter service address"
            />
          </FormGroup>
        </div>

        <FormGroup label="Service Website">
          <Input
            type="url"
            value={formData.serviceWebsite}
            onChange={(e) => handleChange("serviceWebsite", e.target.value)}
            placeholder="https://..."
          />
        </FormGroup>

        <FormGroup label="Nesti's Partner" error={errors.is_partner}>
          <div className="flex space-x-2">
            {["yes", "no"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleChange("is_partner", option)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  formData.is_partner === option
                    ? "bg-brand-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-dark-800 dark:text-gray-300"
                }`}
              >
                {option === "yes" ? "Yes" : "No"}
              </button>
            ))}
          </div>
        </FormGroup>

        {formData.is_partner === "yes" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-300">
            <FormGroup label="Discount" error={errors.discount}>
              <Input
                value={formData.discount}
                onChange={(e) => handleChange("discount", e.target.value)}
                placeholder="e.g. 10%"
              />
            </FormGroup>
            <FormGroup label="Discount Text" error={errors.discount_text}>
              <Input
                value={formData.discount_text}
                onChange={(e) => handleChange("discount_text", e.target.value)}
                placeholder="e.g. For all members"
              />
            </FormGroup>
          </div>
        )}

        <FormGroup label="Short Description" error={errors.shortDescription}>
          <TextArea
            rows={3}
            value={formData.shortDescription}
            onChange={(val) => handleChange("shortDescription", val)}
            placeholder="Enter a short description"
          />
        </FormGroup>

        <FormGroup label="Service Image">
          <div className="flex items-center space-x-4">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 5 * 1024 * 1024) {
                    alert("File is too large (max 5MB)");
                    return;
                  }
                  handleChange("image", file);
                }
              }}
            />
            <label
              htmlFor="image-upload"
              className="px-4 py-2 bg-gray-200 dark:bg-dark-800 text-gray-700 dark:text-gray-300 rounded-md cursor-pointer hover:bg-gray-300 transition-colors"
            >
              Choose File
            </label>
            {formData.image && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {formData.image.name}
              </span>
            )}
          </div>
        </FormGroup>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 transition-colors disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Service"}
          </button>
        </div>
      </form>
    </ComponentCard>
  );
}