import React from "react";
import Input from "./input/InputField";

type TimeRangesProps = {
  id?: string;
  type?: "time" | string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
};

const TimeRanges: React.FC<TimeRangesProps> = ({ id, type = "time", value, onChange, className = "", placeholder }) => {
  return (
    <Input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      className={className}
      placeholder={placeholder}
    />
  );
};

export default TimeRanges;
