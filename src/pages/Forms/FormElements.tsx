import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import TextArea from "../../components/form/input/TextArea";
import WorkModeToggle from "../../components/form/form-elements/WorkModeToggle";
import { useState } from "react";

export default function FormElements() {
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");

  const ratingOptions = [1, 2, 3, 4, 5].map((num) => ({
    label: num.toString(),
    value: num.toString(),
  }));

  const cityOptions = [
    { label: "Helsinki", value: "helsinki" },
    { label: "Espoo", value: "espoo" },
    { label: "Vantaa", value: "vantaa" },
    { label: "Tampere", value: "tampere" },
    { label: "Turku", value: "turku" },
    { label: "Oulu", value: "oulu" },
  ];

  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <ComponentCard title="New Service Form">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="inputService">Service Name</Label>
          <Input type="text" id="inputService" className="w-80" />
        </div>
        <div>
          <Label htmlFor="inputCategory">Service Category</Label>
          <Input type="text" id="inputCategory" className="w-80" />
        </div>
        <div>
          <Label>Rating</Label>
          <Select
            options={ratingOptions}
            placeholder="Select a rating"
            onChange={handleSelectChange}
            className="dark:bg-dark-900"
          />
        </div>
        <div>
          <Label>Location</Label>
          <div className="relative">
            <Select
              options={cityOptions}
              placeholder="Select a city"
              onChange={handleSelectChange}
              className="dark:bg-dark-900"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="workMode">Work Mode</Label>
          <WorkModeToggle onChange={handleSelectChange} />
        </div>
        <div>
          <Label htmlFor="serviceWebsite">Service Website</Label>
          <Input type="url" id="serviceWebsite" className="w-80" />
        </div>
        <div>
          <Label htmlFor="shortDescription">Short Description</Label>
          <TextArea
            rows={3}
            value={shortDescription}
            onChange={setShortDescription}
            placeholder="Enter a short description"
            className="w-80"
          />
        </div>
        <div>
          <Label htmlFor="fullDescription">Full Description</Label>
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
