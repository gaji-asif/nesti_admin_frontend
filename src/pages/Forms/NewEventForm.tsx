import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import { useState } from "react";
import { useNavigate } from "react-router";
import { createEvent } from "../../api/eventsApi";
import DatePicker from "../../components/form/date-picker";
import TimeRanges from "../../components/form/time-ranges";

interface EventForm {
  name: string;
  short_description: string;
  date: string; // yyyy-mm-dd
  start_time: string; // HH:MM
  end_time: string; // HH:MM
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
    name: "",
    short_description: "",
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
    if (!formData.name.trim()) newErrors.name = "Event title is required";
    if (!formData.date) newErrors.date = "Event date is required";
    if (!formData.start_time) newErrors.start_time = "Start time is required";
    if (!formData.city) newErrors.city = "City is required";
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
        name: formData.name,
        location: `${formData.place}, ${formData.city}`,
        date: formData.date,
        time: time,
        place: formData.place,
        city: formData.city,
        event_for: formData.audience,
        short_description: formData.short_description,
      };

      await createEvent(payload);
      alert("Event created successfully!");
      setFormData({
        name: "",
        short_description: "",
        date: "",
        start_time: "",
        end_time: "",
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
            value={formData.name} 
            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} 
            placeholder="e.g. Playgroup for under 1-year-olds" 
            className="w-full" 
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="description">Description (max 300 characters)</Label>
          <TextArea 
            value={formData.short_description} 
            onChange={handleTextAreaChange("short_description")} 
            rows={4} 
            placeholder="Short description of the event..." 
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {formData.short_description.length}/300
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
            <Label>Time *</Label>
            <div className="flex items-center gap-2">
              <TimeRanges type="time" value={formData.start_time} onChange={handleChange("start_time")} className="flex-1" />
              <span className="text-gray-500">–</span>
              <TimeRanges type="time" value={formData.end_time} onChange={handleChange("end_time")} className="flex-1" />
            </div>
            {errors.start_time && <p className="mt-1 text-sm text-red-600">{errors.start_time}</p>}
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

        <div>
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
