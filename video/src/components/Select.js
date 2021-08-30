import React from "react";
import Form from "react-bootstrap/Form";

export default function Select({
  items = [],
  placeholder = "Select from below",
  onChange = () => {},
  value,
}) {
  return (
    <>
      <Form.Select
        onChange={(e) => {
          onChange(e.target.value);
        }}
        value={value}
      >
        <option>{placeholder}</option>
        {items.map((i) => {
          if (typeof i === "object")
            return (
              <option key={i.value} value={i.value}>
                {i.name}
              </option>
            );
          return (
            <option key={i} value={i}>
              {i}
            </option>
          );
        })}
      </Form.Select>
    </>
  );
}
