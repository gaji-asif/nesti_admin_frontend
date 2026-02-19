import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import { useState } from "react";
import { createEvent } from "../../api/eventsApi";
import DatePicker from "../../components/form/date-picker";
import TimeRanges from "../../components/form/time-ranges";

interface EventForm {
  title: string;
  short_description: string;
  description: string;
  date: string; // yyyy-mm-dd
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  place: string;
  city: string;
  audience: string;
  is_active: boolean;
}

export default function NewEvent() {
  const [formData, setFormData] = useState<EventForm>({
    title: "",
    short_description: "",
    description: "",
    date: "",
    start_time: "",
    end_time: "",
    place: "",
    city: "Helsinki",
    audience: "Kaikille",
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

  const handleDateChange = (_selectedDates: Date[], dateStr: string) => {
    setFormData((prev) => ({ ...prev, date: dateStr }));
  };

  const handleTextAreaChange = (field: keyof EventForm) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value } as any));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title.trim()) newErrors.title = "Event title is required";
    if (!formData.date) newErrors.date = "Event date is required";
    if (!formData.start_time) newErrors.start_time = "Start time is required";
    // If end_time present, ensure it's after start_time
    if (formData.date && formData.start_time && formData.end_time) {
      try {
        const [y, m, d] = formData.date.split("-").map((v) => parseInt(v, 10));
        const [sh, sm] = formData.start_time.split(":").map((v) => parseInt(v, 10));
        const [eh, em] = formData.end_time.split(":").map((v) => parseInt(v, 10));
        const startDt = new Date(y, m - 1, d, sh, sm, 0);
        const endDt = new Date(y, m - 1, d, eh, em, 0);
        if (endDt <= startDt) newErrors.end_time = "End time must be after start time";
      } catch (e) {
        // ignore parsing errors here; other validations will catch missing fields
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      // Format time as HH:MM-HH:MM or just HH:MM
      const time = formData.end_time 
        ? `${formData.start_time}-${formData.end_time}`
        : formData.start_time;

      const payload = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: time,
        city: formData.city,
        place: formData.place,
        audience: formData.audience,
        is_active: formData.is_active ? "1" : "0",
      };

      await createEvent(payload);
      alert("Event added successfully!");
      setFormData({
        title: "",
        short_description: "",
        description: "",
        date: "",
        start_time: "",
        end_time: "",
        place: "",
        city: "Helsinki",
        audience: "Kaikille",
        is_active: true,
      });
    } catch (err: any) {
      // Surface detailed server error when available for easier debugging
      console.error("Error adding event:", err);
      const serverMessage = err?.response?.data ? err.response.data : err?.message || String(err);
      try {
        const pretty = typeof serverMessage === "object" ? JSON.stringify(serverMessage) : serverMessage;
        alert("Failed to add event: " + pretty);
      } catch (e) {
        alert("Failed to add event. Check console for details.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ComponentCard title="Create New Event">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="eventName">Title</Label>
          <Input id="eventName" value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Nestin leikkitreffit" className="w-80" />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
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
            <DatePicker 
            id="eventDate"
            label={"Event Date"}
            defaultDate={formData.date || undefined}
            placeholder="dd/mm/yyyy"
            onChange={(selectedDates, dateStr) => handleDateChange(selectedDates as Date[], dateStr)}

            />
            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
          </div>
          <div>
            <Label>Start Time</Label>
            <TimeRanges type="time" value={formData.start_time} onChange={handleChange("start_time")} className="w-44" />
            {errors.start_time && <p className="mt-1 text-sm text-red-600">{errors.start_time}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>End Time</Label>
            <TimeRanges type="time" value={formData.end_time} onChange={handleChange("end_time")} className="w-44" />
          </div>
          <div>
            <Label>Place</Label>
            <Input value={formData.place} onChange={handleChange("place")} placeholder="e.g. Cafe Elo" className="w-80" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>City</Label>
            <Input value={formData.city} onChange={handleChange("city")} placeholder="Helsinki" className="w-80" />
          </div>
          <div>
            <Label>Audience</Label>
            <Input value={formData.audience} onChange={handleChange("audience")} placeholder="e.g. Kaikille, 0-3v, etc." className="w-80" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input id="isActive" type="checkbox" checked={formData.is_active} onChange={handleChange("is_active")} className="h-4 w-4" />
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
