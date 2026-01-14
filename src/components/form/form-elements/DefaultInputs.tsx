import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import Select from "../Select";

export default function DefaultInputs() {
  const ratingOptions = [1, 2, 3, 4, 5].map((num) => ({
    label: num.toString(),
    value: num.toString(),
  }));

  const cityOptions = [
    { label: "Helsinki", value: "helsinki" },
    { label: "Tampere", value: "tampere" },
    { label: "Turku", value: "turku" },
    { label: "Oulu", value: "oulu" },
  ];

  const workModeOptions = [
    { label: "Remote", value: "remote" },
    { label: "On-site", value: "on-site" },
    { label: "Hybrid", value: "hybrid" },
  ];
  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
  };

  return (
    <ComponentCard title="Default Inputs">
      <div className="space-y-6">
        <div>
          <Label htmlFor="inputService">Service Name</Label>
          <Input type="text" id="inputService" />
        </div>
        <div>
          <Label htmlFor="inputCategory">Service Category</Label>
          <Input type="text" id="inputCategory" />
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
        <Label htmlFor="tm">Work Mode</Label>
        <div className="relative">
          <Select
            options={workModeOptions}
            placeholder="Select a work mode"
            onChange={handleSelectChange}
            className="dark:bg-dark-900"
          />
        </div>
      </div>
    </ComponentCard>
  );
}
