import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import TextArea from "../input/TextArea";
import { useState } from "react";

export default function InputGroup() {
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");

  return (
    <ComponentCard title="Input Groups">
      <div className="space-y-6">
        <div>
          <Label htmlFor="serviceWebsite">Service Website</Label>
          <Input type="url" id="serviceWebsite" />
        </div>
        <div>
          <Label htmlFor="shortDescription">Short Description</Label>
          <TextArea
            rows={3}
            value={shortDescription}
            onChange={setShortDescription}
            placeholder="Enter a short description"
            className="pl-10"
          />
        </div>
        <div>
          <Label htmlFor="fullDescription">Full Description</Label>
          <TextArea
            rows={8}
            value={fullDescription}
            onChange={setFullDescription}
          />
        </div>
      </div>
    </ComponentCard>
  );
}
