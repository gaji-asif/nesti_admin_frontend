import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import TextArea from "../../components/form/input/TextArea";
import { useState } from "react";
import { addService, CreateServiceData } from "../../api/servicesAPI";

export default function NewServiceForm() {
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    serviceName: "",
    serviceCategory: "",
    rating: "",
    location: "",
    city: "",
    address: "",
    serviceWebsite: "",
  });

  const locationOptions = [
    { label: "Finland", value: "finland" },
    { label: "Sweden", value: "sweden" },
    { label: "Norway", value: "norway" },
  ];

  const cityOptions = [
    { label: "Helsinki", value: "helsinki" },
    { label: "Tampere", value: "tampere" },
    { label: "Turku", value: "turku" },
    { label: "Oulu", value: "oulu" },
    { label: "Vantaa", value: "vantaa" },
  ];

  const categoryOptions = [
    { label: "Uniohjaus", value: "1" },
    { label: "Imetysohjaus", value: "2" },
    { label: "Doula", value: "3" },
    { label: "Synnytysvalmennus", value: "4" },
    { label: "Fysioterapia (äidit/lapset)", value: "5" },
    { label: "Synnytyksen käynnistys", value: "6" },
    { label: "Vyöhyketerapia", value: "7" },
    { label: "Kahvila", value: "8" },
    { label: "Muu", value: "9" },
  ];

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
    if (!formData.location) {
      newErrors.location = "Please select a location";
    }
    if (!formData.city) {
      newErrors.city = "Please select a city";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
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
      const submissionData: CreateServiceData = {
        name: formData.serviceName,
        category_id: parseInt(formData.serviceCategory),
        location: formData.location,
        city: formData.city,
        rating: formData.rating ? parseInt(formData.rating) : null,
        address: formData.address,
        website: formData.serviceWebsite,
        description: fullDescription,
        short_description: shortDescription,
      };

      try {
        const newService = await addService(submissionData);
        console.log("✅ Service added successfully:", newService);
        alert(`Service "${newService.name}" added successfully with ID ${newService.id}`);
        
        alert("New service added successfully!");
        // Reset form after successful submission
        setFormData({
          serviceName: "",
          serviceCategory: "",
          rating: "",
          location: "",
          city: "",
          address: "",
          serviceWebsite: "",
        });
        setShortDescription("");
        setFullDescription("");
        setErrors({});
      } catch (error) {
        console.error("❌ Error adding service:", error);
        alert("Error adding service. Please try again.");
      }
    }
  };

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
          <Label>Location</Label>
          <div className="relative">
            <Select
              options={locationOptions}
              placeholder="Select a country"
              onChange={handleSelectChange("location")}
              className="dark:bg-dark-900"
            />
          </div>
          {errors.location && (
            <p className="mt-1.5 text-xs text-error-500">{errors.location}</p>
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
          <Label htmlFor="fullDescription">Full Description (Optional)</Label>
          <TextArea
            rows={8}
            value={fullDescription}
            onChange={setFullDescription}
            placeholder="Enter a full description"
            className="w-80"
          />
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
