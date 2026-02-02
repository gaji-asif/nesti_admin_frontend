import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import MultiSelect from "../../components/form/MultiSelect";
import TextArea from "../../components/form/input/TextArea";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { updateService, UpdateServiceData, getServices } from "../../api/servicesAPI";
import { useCategories, formatCategoryOptions, useService} from "../../hooks/useApiData";
import { normalizeListResponse } from "../../utils/apiNormalize";

interface EditServiceFormProps {
  serviceId?: number;
  onSuccess?: () => void;
}

interface ServiceFormData {
  serviceName: string;
  serviceCategories: string[];
  rating: string;
  location: string;
  city: string;
  address: string;
  serviceWebsite: string;
  shortDescription: string;
  image: string | File | null;
}

export default function EditServiceForm({ serviceId: propServiceId, onSuccess }: EditServiceFormProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const serviceId = propServiceId || (id ? parseInt(id, 10) : undefined);
  
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const { categories } = useCategories();
  const [formData, setFormData] = useState<ServiceFormData>({
    serviceName: "",
    serviceCategories: [],
    rating: "",
    location: "",
    city: "",
    address: "",
    serviceWebsite: "",
    shortDescription: "",
    image: null,
    });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
    { label: "Lahti", value: "lahti" },
  ];


  // Use shared hook to fetch single service
  const { service: fetchedService, loading: serviceLoading } = useService(serviceId as number | string | undefined);

  useEffect(() => {
    const populateFromService = (serviceResponseData: any) => {
      setFormData({
        serviceName: serviceResponseData.name || "",
        serviceCategories: serviceResponseData.category_ids ? serviceResponseData.category_ids.map((categoryId: any) => String(categoryId)) : [],
        rating: serviceResponseData.rating?.toString() || "",
        location: serviceResponseData.location || "",
        city: serviceResponseData.city || "",
        address: serviceResponseData.address || "",
        serviceWebsite: serviceResponseData.website || "",
        shortDescription: serviceResponseData.short_description || "",
        image: null,
      });
      setImagePreview(serviceResponseData.image_url || serviceResponseData.image || null);
    };

    const load = async () => {
      if (serviceLoading) {
        setLoading(true);
        return;
      }

      setLoading(false);

      if (fetchedService && (fetchedService as any).id) {
        populateFromService(fetchedService);
        return;
      }

      // Fallback: fetch all services and try to find the one by id
      if (!serviceId) return;
      try {
        const raw: any = await getServices();
        console.log('Fallback raw getServices response:', raw);
        let allServices: any = normalizeListResponse(raw);
        if (!Array.isArray(allServices)) {
          console.warn('normalizeListResponse returned non-array, attempting coercion:', allServices);
          if (Array.isArray(raw)) allServices = raw;
          else if (raw && Array.isArray(raw.data)) allServices = raw.data;
          else if (raw && Array.isArray(raw.services)) allServices = raw.services;
          else if (raw && typeof raw === 'object') allServices = Object.values(raw);
          else allServices = [];
        }
        console.log('Fallback allServices (final):', allServices);
        const found = (allServices || []).find((s: any) => String(s.id) === String(serviceId));
        if (found) {
          console.log('Fallback found service:', found);
          populateFromService(found);
        } else {
          console.warn('Service not found in fallback list for id', serviceId);
        }
      } catch (err) {
        console.error('Fallback getServices failed', err);
      }
    };

    load();
  }, [fetchedService, serviceLoading, serviceId]);

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

  const handleMultiSelectChange = (selectedCategories: string[]) => {
    setFormData((prev) => ({ ...prev, serviceCategories: selectedCategories }));
    // Clear error when user makes a selection
    if (errors.serviceCategories) {
      setErrors((prev) => ({ ...prev, serviceCategories: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.serviceName.trim()) newErrors.serviceName = "Service name is required";
    if (!formData.serviceCategories || formData.serviceCategories.length === 0) newErrors.serviceCategories = "At least one service category is required";
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

    const nameTrim = formData.serviceName?.trim?.() || "";
    if (!nameTrim) {
      setErrors((prev) => ({ ...prev, serviceName: "Service name is required" }));
      return;
    }
    if (!formData.city) {
      setErrors((prev) => ({ ...prev, city: "City is required" }));
      return;
    }

    if (!serviceId) {
      alert('Service ID is missing. Cannot update service.');
      return;
    }
    
    setSubmitting(true);

    try {
      let payload: UpdateServiceData | FormData;
      
      // Use FormData only when we have a new image file to upload
      if (formData.image instanceof File) {
        console.log('Before building FormData:', { serviceName: formData.serviceName, city: formData.city, serviceId });
        const fd = new FormData();
        fd.append('id', String(serviceId));
        fd.append('name', nameTrim);
        fd.append('city', String(formData.city));
        fd.append('location', formData.location || '');
        fd.append('address', formData.address.trim());
        fd.append('website', formData.serviceWebsite || '');
        fd.append('short_description', formData.shortDescription.trim());
        // Append file under both keys to match backend expectations
        fd.append('image', formData.image);
        // Some APIs expect image_url field even when uploading; include existing or empty
        fd.append('image_url', typeof formData.image === 'string' ? formData.image : '');
        // Send category IDs as repeated fields which many backends accept
        const catIds = formData.serviceCategories.map(id => String(parseInt(id, 10)));
        if (catIds.length > 0) {
          catIds.forEach(cid => fd.append('category_ids[]', cid));
        } else {
          fd.append('category_ids[]', '');
        }
        // Debug: build a plain object from FormData for logging
        const debugObj: Record<string, any> = {};
        for (const [k, v] of fd.entries()) {
          debugObj[k] = v instanceof File ? { name: v.name, size: v.size, type: v.type } : v;
        }
        console.log('Submitting FormData payload:', debugObj);
        payload = fd;
      } else {
        // Use regular JSON payload when no new image file
        payload = {
          id: serviceId,
          name: nameTrim,
          category_ids: formData.serviceCategories.map(id => parseInt(id, 10)),
          location: formData.location || undefined,
          city: formData.city,
          address: formData.address.trim(),
          website: formData.serviceWebsite || undefined,
          short_description: formData.shortDescription.trim(),
          // Include image_url when there is an existing image reference
          image_url: typeof formData.image === 'string' ? formData.image : undefined,
        } as any;
        console.log('Submitting JSON payload:', payload);
      }

      const updated = await updateService(payload as any);
      if (onSuccess) onSuccess();
      else navigate('/all-services');
    } catch (error: any) {
      console.error('Update failed,', error);
      alert(`Failed to update service: ${error.response?.data?.message || error.message}`);
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
          <Label>Service Categories</Label>
          <div className="relative">
            <MultiSelect
              label=""
              options={formatCategoryOptions(categories)}
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
          <Label htmlFor="image">Image</Label>
          <div className="flex items-center space-x-4">
            <label
              htmlFor="image"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md cursor-pointer hover:bg-gray-300 dark:bg-dark-800 dark:text-gray-300 dark:hover:bg-dark-700 transition-colors"
            >
              Choose File
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {formData.image instanceof File ? (
              <span className="text-sm text-gray-600 dark:text-gray-400">{formData.image.name}</span>
            ) : (typeof formData.image === 'string' && formData.image ? (
              <span className="text-sm text-gray-600 dark:text-gray-400">{formData.image}</span>
            ) : null)}

            {imagePreview && (
              <div className="w-28 h-28 overflow-hidden rounded-md border">
                <img src={imagePreview} alt="Preview" className="object-cover w-full h-full" />
              </div>
            )}
          </div>
          {errors.image && (
            <p className="mt-1.5 text-xs text-error-500">{errors.image}</p>
          )}
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