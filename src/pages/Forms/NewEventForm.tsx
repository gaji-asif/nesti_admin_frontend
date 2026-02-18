import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import { useState } from "react";
import { addEvent } from "../../api/eventsApi";

interface EventForm {
  name: string;
  short_description: string;
  description: string;
  date: string; // yyyy-mm-dd
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  location: string;
  location_extra_info: string;
  is_active: boolean;
}

export default function NewEvent() {
  const [formData, setFormData] = useState<EventForm>({
    name: "",
    short_description: "",
    description: "",
    date: "",
    start_time: "",
    end_time: "",
    location: "",
    location_extra_info: "",
    is_active: true,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: keyof EventForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value } as any));
  };

  const handleTextAreaChange = (field: keyof EventForm) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value } as any));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Event name is required";
    if (!formData.date) newErrors.date = "Event date is required";
    if (!formData.start_time) newErrors.start_time = "Start time is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      // Build payload. Use FormData to allow future file uploads.
      const payload = new FormData();
      payload.append("name", formData.name);
      if (formData.short_description) payload.append("short_description", formData.short_description);
      if (formData.description) payload.append("description", formData.description);
      if (formData.location) payload.append("location", formData.location);
      if (formData.location_extra_info) payload.append("location_extra_info", formData.location_extra_info);

      // Combine date and time to ISO timestamps when possible
      if (formData.date && formData.start_time) {
        const startIso = new Date(`${formData.date}T${formData.start_time}`).toISOString();
        payload.append("start_time", startIso);
      }
      if (formData.date && formData.end_time) {
        const endIso = new Date(`${formData.date}T${formData.end_time}`).toISOString();
        payload.append("end_time", endIso);
      }

      payload.append("is_active", formData.is_active ? "1" : "0");

      const newEvent = await addEvent(payload);
      alert("Event added successfully!");
      console.log("New event:", newEvent);
      setFormData({
        name: "",
        short_description: "",
        description: "",
        date: "",
        start_time: "",
        end_time: "",
        location: "",
        location_extra_info: "",
        is_active: true,
      });
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Failed to add event. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ComponentCard title="Create New Event">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="eventName">Title</Label>
          <Input id="eventName" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Nestin leikkitreffit" className="w-80" />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="shortDescription">Short Description</Label>
          <TextArea value={formData.short_description} onChange={handleTextAreaChange("short_description")} rows={3} placeholder="Short description (max 300)" />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <TextArea value={formData.description} onChange={handleTextAreaChange("description")} rows={5} placeholder="Longer description" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Date</Label>
            <Input type="date" value={formData.date} onChange={handleChange("date") as any} className="w-44" />
            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
          </div>
          <div>
            <Label>Start Time</Label>
            <Input type="time" value={formData.start_time} onChange={handleChange("start_time") as any} className="w-44" />
            {errors.start_time && <p className="mt-1 text-sm text-red-600">{errors.start_time}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>End Time</Label>
            <Input type="time" value={formData.end_time} onChange={handleChange("end_time") as any} className="w-44" />
          </div>
          <div>
            <Label>Location</Label>
            <Input value={formData.location} onChange={handleChange("location") as any} placeholder="e.g. Cafe Elo" className="w-80" />
          </div>
        </div>

        <div>
          <Label>Location extra info</Label>
          <Input value={formData.location_extra_info} onChange={handleChange("location_extra_info") as any} placeholder="e.g. Room / address details" className="w-80" />
        </div>

        <div className="flex items-center gap-3">
          <input id="isActive" type="checkbox" checked={formData.is_active} onChange={handleChange("is_active") as any} className="h-4 w-4" />
          <Label htmlFor="isActive">Is active</Label>
        </div>

        <div className="flex justify-center">
          <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md transition-colors bg-brand-500 text-white hover:bg-brand-600">
            {submitting ? "Creating..." : "Create Event"}
          </button>
        </div>
      </form>
    </ComponentCard>
  );
}
