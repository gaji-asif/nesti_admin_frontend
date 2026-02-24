import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import { useState, useEffect } from "react";
import { editEvent, EventItem } from "../../api/eventsApi";
import DatePicker from "../../components/form/date-picker";
import TimeRanges from "../../components/form/time-ranges";

interface Props {
  event: EventItem;
  onClose: () => void;
  onSaved?: () => void;
}

interface EventForm {
  name: string;
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

export default function EditEventForm({ event, onClose, onSaved }: Props) {
  const normalizeDash = (s: string) => {
    if (!s) return s;
    // Replace common dash characters and common mojibake sequence with ASCII hyphen-minus
    return s.replace(/\s*(?:–|—|−|‒|—|\u2013|\u2014|\u2212|â)\s*/g, "-").trim();
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
  const parseTime = (time?: string) => {
    if (!time) return { start: "", end: "" };
    const normalized = normalizeDash(time);
    const parts = normalized.split("-");
    return { start: (parts[0] || "").trim(), end: (parts[1] || "").trim() };
  };

  const initial = (ev?: EventItem): EventForm => {
    console.debug('EditEventForm - initial() called with event:', ev);
    const t = parseTime(ev?.time);
    
    // Extract title: prefer actual title over fallback "—"
    const extractTitle = () => {
      if (!ev) return "";
      if (ev.title && ev.title !== "—" && ev.title !== "Untitled event") return ev.title;
      if ((ev as any).name && (ev as any).name !== "—") return (ev as any).name;
      return "";
    };
    
    // Extract place: avoid concatenated values
    const extractPlace = () => {
      if (!ev?.place) return "";
      // If place contains repeated city names, extract the first part
      const place = ev.place.toString();
      if (place.includes(',')) {
        const parts = place.split(',').map(p => p.trim());
        // Return first unique part that's not the city name
        const uniqueParts = [...new Set(parts)];
        return uniqueParts.find(p => p !== ev.city && p !== 'Helsinki') || parts[0];
      }
      return place;
    };
    
    return {
      name: extractTitle(),
      short_description: ev?.short_description || "",
      description: ev?.description || "",
      date: ev?.date || "",
      start_time: t.start,
      end_time: t.end,
      place: extractPlace(),
      city: ev?.city || "",
      audience: (ev as any)?.audience ?? ev?.ageGroup ?? "",
      is_active: (ev as any)?.is_active !== "0",
    };
  };

  const [formData, setFormData] = useState<EventForm>(() => initial(event));
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    console.debug('EditEventForm - received event prop:', event);
    setFormData(initial(event));
    setErrors({}); // Clear any previous validation errors
  }, [event.id]); // Only re-initialize when event ID changes, not when object reference changes

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
    setFormData((prev) => ({ ...prev, [field]: value } as any));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Event title is required";
    if (!formData.date) newErrors.date = "Event date is required";
    if (!formData.start_time) newErrors.start_time = "Start time is required";
    if (!formData.city) newErrors.city = "City is required";
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
    // Send the raw formData. The API function will map 'name' to backend field, etc.
    await editEvent(event.id, {
      title: formData.name, // Map name back to title for API compatibility
      ...formData,
      is_active: formData.is_active ? "1" : "0"
    });

    alert("Event updated successfully");
    if (onSaved) onSaved();
    onClose();
  } catch (err: any) {
    console.error("Error updating event:", err);
    alert(`Failed to update: ${err.message}`);
  } finally {
    setSubmitting(false);
  }
};

  const displayTitle = () => {
    if (event.title && event.title !== "—" && event.title !== "Untitled event") {
      return event.title;
    }
    if ((event as any).name && (event as any).name !== "—") {
      return (event as any).name;
    }
    return `Event ${event.id}`;
  };

  return (
    <ComponentCard title={`Edit Event: ${displayTitle()}`}>
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
            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
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
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-6 py-2 text-sm font-medium rounded-md transition-colors bg-brand-500 text-white hover:bg-brand-600"
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </ComponentCard>
  );
}
