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

export default function EditEventForm({ event, onClose, onSaved }: Props) {
  const normalizeDash = (s: string) => {
    if (!s) return s;
    // Replace common dash characters and common mojibake sequence with ASCII hyphen-minus
    return s.replace(/\s*(?:–|—|−|‒|—|\u2013|\u2014|\u2212|â)\s*/g, "-").trim();
  };

  const parseTime = (time?: string) => {
    if (!time) return { start: "", end: "" };
    const normalized = normalizeDash(time);
    const parts = normalized.split("-");
    return { start: (parts[0] || "").trim(), end: (parts[1] || "").trim() };
  };

  const initial = (): EventForm => {
    const t = parseTime(event.time);
    return {
      title: event.title || "",
      short_description: event.short_description || "",
      description: event.description || "",
      date: event.date || "",
      start_time: t.start,
      end_time: t.end,
      place: event.place || "",
      city: event.city || "",
      audience: (event as any).audience || "",
      is_active: (event as any).is_active === "0" ? false : true,
    };
  };

  const [formData, setFormData] = useState<EventForm>(initial);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setFormData(initial());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.id]);

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
    if (formData.date && formData.start_time && formData.end_time) {
      try {
        const [y, m, d] = formData.date.split("-").map((v) => parseInt(v, 10));
        const [sh, sm] = formData.start_time.split(":").map((v) => parseInt(v, 10));
        const [eh, em] = formData.end_time.split(":").map((v) => parseInt(v, 10));
        const startDt = new Date(y, m - 1, d, sh, sm, 0);
        const endDt = new Date(y, m - 1, d, eh, em, 0);
        if (endDt <= startDt) newErrors.end_time = "End time must be after start time";
      } catch (e) {
        // ignore
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
      // Ensure we use ASCII hyphen-minus and trim any strange characters
      const rawTime = formData.end_time ? `${formData.start_time}-${formData.end_time}` : formData.start_time;
      const time = normalizeDash(rawTime);
      const payload = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time,
        city: formData.city,
        place: formData.place,
        audience: formData.audience,
        is_active: formData.is_active ? "1" : "0",
      };

      await editEvent(event.id, payload);
      alert("Event updated successfully");
      if (onSaved) onSaved();
      onClose();
    } catch (err: any) {
      console.error("Error updating event:", err);
      alert(`Failed to update event: ${err?.response?.data?.message || err.message || String(err)}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ComponentCard title={`Edit Event — ${event.title || event.id}`}>
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
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </ComponentCard>
  );
}
