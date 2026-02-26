import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import { useState } from "react";
import { useNavigate } from "react-router";
import { createEvent } from "../../api/eventsApi";
import DatePicker from "../../components/form/date-picker";

interface EventForm {
  title: string;
  description: string;
  date: string; // yyyy-mm-dd
  time?: string; // e.g. "10:15 - 11:15"
  place: string;
  city: string;
  audience: string;
  is_active: boolean;
}

export default function NewEvent() {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/all-events");
  };
  const convertToDisplayDate = (apiDate: string) => {
    // Convert yyyy-mm-dd to dd/mm/yyyy for display
    if (!apiDate || !apiDate.includes('-')) return apiDate;
    const parts = apiDate.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return apiDate;
  };

  const [formData, setFormData] = useState<EventForm>({
    title: "",
    description: "",
    date: "",
    time: "",
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
    // Convert dd/mm/yyyy to yyyy-mm-dd for API
    let apiDate = dateStr;
    if (dateStr && dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        apiDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }
    setFormData((prev) => ({ ...prev, date: apiDate }));
  };

  const handleTextAreaChange = (field: keyof EventForm) => (value: string) => {
    const limitedValue = value.slice(0, 300);
    setFormData((prev) => ({ ...prev, [field]: limitedValue } as any));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title.trim()) newErrors.name = "Event title is required";
    if (!formData.date) newErrors.date = "Event date is required";
    // Require the single `time` text field
    if (!formData.time) newErrors.time = "Time is required";
    if (!formData.city) newErrors.city = "City is required";
    // No start/end parsing when using free-text `time`
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      // Use the free-text `time` field (e.g. "10:15 - 11:15")
      const time = formData.time || "";

      const payload = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: time,
        place: formData.place,
        city: formData.city,
        audience: formData.audience,
      };

      await createEvent(payload);
      alert("Event created successfully!");
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        place: "",
        city: "Helsinki",
        audience: "For everyone",
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
          <Label htmlFor="eventName">Title *</Label>
          <Input 
            id="eventName" 
            value={formData.title} 
            onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} 
            placeholder="e.g. Playgroup for under 1-year-olds" 
            className="w-full" 
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        <div>
          <Label htmlFor="description">Description (max 300 characters)</Label>
          <TextArea 
            value={formData.description} 
            onChange={handleTextAreaChange("description")} 
            rows={4} 
            placeholder="Short description of the event..." 
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {formData.description.length}/300
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <DatePicker 
              id="eventDate"
              label="Date *"
              defaultDate={formData.date ? convertToDisplayDate(formData.date) : undefined}
              placeholder="dd/mm/yyyy"
              onChange={(selectedDates, dateStr) => handleDateChange(selectedDates as Date[], dateStr)}
            />
            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
          </div>
          <div>
            <Label htmlFor="eventTime">Time *</Label>
            <Input
              id="eventTime"
              type="text"
              value={formData.time}
              onChange={(e) => setFormData((p) => ({ ...p, time: e.target.value }))}
              placeholder="e.g. 10:15 - 11:15"
              className="w-full"
            />
            {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>City *</Label>
            <select 
              value={formData.city} 
              onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
            >
              <option value="">Select city</option>
              <option value="Helsinki">Helsinki</option>
              <option value="Espoo">Espoo</option>
              <option value="Vantaa">Vantaa</option>
              <option value="Tampere">Tampere</option>
              <option value="Turku">Turku</option>
              <option value="Oulu">Oulu</option>
            </select>
          </div>
          <div>
            <Label>Specific place/address</Label>
            <Input 
              value={formData.place} 
              onChange={handleChange("place")} 
              placeholder="e.g. Trumpe Playground" 
              className="w-full" 
            />
          </div>
        </div>

        <div className="hidden">
          <Label>Target audience</Label>
          <select 
            value={formData.audience} 
            onChange={(e) => setFormData((p) => ({ ...p, audience: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
          >
            <option value="">Select age group</option>
            <option value="For everyone">For everyone</option>
            <option value="0-1y">0-1 year old</option>
            <option value="1-2y">1-2 years old</option>
            <option value="2-3y">2-3 years old</option>
            <option value="3-5y">3-5 years old</option>
            <option value="5-7y">5-7 years old</option>
            <option value="Parents">For parents</option>
          </select>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <button 
            type="button" 
            onClick={handleCancel}
            className="px-6 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-6 py-2 text-sm font-medium rounded-md transition-colors bg-brand-500 text-white hover:bg-brand-600"
            disabled={submitting}
          >
            {submitting ? "Creating..." : "Create Event"}
          </button>
        </div>
      </form>
    </ComponentCard>
  );
}
