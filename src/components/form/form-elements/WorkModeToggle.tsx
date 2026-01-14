import { useState } from "react";

interface WorkModeToggleProps {
  onChange?: (value: string) => void;
}

const WorkModeToggle: React.FC<WorkModeToggleProps> = ({ onChange }) => {
  const [selected, setSelected] = useState("remote");

  const handleSelect = (value: string) => {
    setSelected(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        onClick={() => handleSelect("remote")}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          selected === "remote"
            ? "bg-brand-500 text-white"
            : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
        }`}
      >
        Remote
      </button>
      <button
        type="button"
        onClick={() => handleSelect("on-site")}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          selected === "on-site"
            ? "bg-brand-500 text-white"
            : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
        }`}
      >
        On-site
      </button>
    </div>
  );
};

export default WorkModeToggle;
