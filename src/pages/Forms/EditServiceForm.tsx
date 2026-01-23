import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import TextArea from "../../components/form/input/TextArea";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { updateService, UpdateServiceData, Service, getServices } from "../../api/servicesAPI";
import { getAllCategories, Category } from "../../api/categoriesApi";

interface EditServiceFormProps {
  serviceId?: number;
  onSuccess?: () => void;
}

interface ServiceFormData {
  serviceName: string;
  serviceCategory: string;
  rating: string;
  location: string;
  city: string;
  address: string;
  serviceWebsite: string;
  shortDescription: string;
  fullDescription: string;
}

export default function EditServiceForm({ serviceId: propServiceId, onSuccess }: EditServiceFormProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const serviceId = propServiceId || (id ? parseInt(id) : 0);
  
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<ServiceFormData>({
    serviceName: "",
    serviceCategory: "",
    rating: "",
    location: "",
    city: "",
    address: "",
    serviceWebsite: "",
    shortDescription: "",
    fullDescription: "",
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

  const categoryOptions = categories.map(cat => ({ label: cat.name, value: cat.id.toString() }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [services, catsData] = await Promise.all([getServices(), getAllCategories()]);
        
        // Handle different response structures for categories
        let categoriesArray: Category[] = [];
        if (Array.isArray(catsData)) {
          categoriesArray = catsData as Category[];
        } else if (catsData && typeof catsData === "object" && "categories" in catsData) {
          categoriesArray = (catsData as any).categories;
        } else if (catsData && typeof catsData === "object" && "data" in catsData) {
          categoriesArray = (catsData as any).data;
        } else {
          console.warn('Unexpected categories API response structure:', catsData);
        }
        
        setCategories(categoriesArray);
        const service = services.find((s: Service) => s.id === serviceId);
        
        if (service) {
          setFormData({
            serviceName: service.name,
            serviceCategory: service.category_id.toString(),
            rating: service.rating?.toString() || "",
            location: service.location,
            city: service.city,
            address: service.address,
            serviceWebsite: service.website || "",
            shortDescription: service.short_description,
            fullDescription: service.description || "",
          });
        } else {
          // Mock data for demonstration when API doesn't have the service
          console.warn(`Service with ID ${serviceId} not found, using mock data`);
          setFormData({
            serviceName: `Sample Service ${serviceId}`,
            serviceCategory: "1",
            rating: "4.5",
            location: "finland",
            city: "helsinki",
            address: `Sample Address ${serviceId}`,
            serviceWebsite: "https://example.com",
            shortDescription: `This is a sample short description for service ${serviceId}`,
            fullDescription: `This is a sample full description for service ${serviceId}. It contains more detailed information about the service.`,
          });
        }
      } catch (error) {
        console.warn("API not available, using mock data for demonstration:", error);
        // Set mock categories
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

    fetchData();
  }, [serviceId]);

  // Handler for direct value changes (Select, TextArea)
  const handleValueChange = (field: keyof ServiceFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  // Handler for Event changes (Input)
  const handleInputChange =
    (field: keyof ServiceFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      handleValueChange(field)(e.target.value);
    };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.serviceName.trim()) newErrors.serviceName = "Service name is required";
    if (!formData.serviceCategory.trim()) newErrors.serviceCategory = "Service category is required";
    if (!formData.location) newErrors.location = "Please select a location";
    if (!formData.city)  newErrors.city = "Please select a city";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.shortDescription.trim())       newErrors.shortDescription = "Short description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    const submissionData: UpdateServiceData = {
        id: serviceId,
        name: formData.serviceName,
        category_id: parseInt(formData.serviceCategory),
        location: formData.location,
        city: formData.city,
        address: formData.address,
        website: formData.serviceWebsite,
        short_description: formData.shortDescription,
        description: formData.fullDescription,
    };

    try{
        await updateService(submissionData);
        if (onSuccess) onSuccess()
        else navigate("/all-services");
    } catch (error) {
        console.error("Update failed,", error);
        alert("Simulated success: (API error)");
        if (onSuccess) onSuccess()
        else navigate("/all-services");
    } finally {
        setSubmitting(false);
    }
};
    if (loading) return <ComponentCard title="Edit Service Form"><div className="text-center py-8">Loading service data...</div></ComponentCard>;

  return (
    <ComponentCard title="Edit Service Form">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
        {/* Name */}
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
              onChange={handleValueChange("serviceCategory")}
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
              value={formData.location}
              placeholder="Select a country"
              onChange={handleValueChange("location")}
              className="dark:bg-dark-900"
            />
          </div>
          {errors.location && (
            <p className="mt-1.5 text-xs text-error-500">{errors.location}</p>
          )}
        </div>
        <div>
        {/* City */}
          <Label>City</Label>
          <div className="relative">
            <Select
              options={cityOptions}
              value={formData.city}
              onChange={handleValueChange("city")}
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
            value={formData.shortDescription}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, shortDescription: value }));
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
            value={formData.fullDescription}
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, fullDescription: value }));
              if (errors.fullDescription) {
                setErrors((prev) => ({ ...prev, fullDescription: "" }));
              }
            }}
            placeholder="Enter a full description"
            className="w-80"
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium rounded-md transition-colors bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Updating..." : "Update Service"}
          </button>
        </div>
      </form>
    </ComponentCard>
  );
}