// src/components/FilterBar.jsx
import { useState } from "react";

const FilterBar = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    name: "",
    location: "",
    speciality: "",
    clinic: "",
  });

  const handleChange = (e) => {
    const updated = { ...filters, [e.target.name]: e.target.value };
    setFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="flex flex-wrap gap-4 bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
      <input
        type="text"
        name="name"
        placeholder="Search by Name"
        value={filters.name}
        onChange={handleChange}
        className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
      />
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={filters.location}
        onChange={handleChange}
        className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
      />
      <input
        type="text"
        name="speciality"
        placeholder="Speciality"
        value={filters.speciality}
        onChange={handleChange}
        className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
      />
      <input
        type="text"
        name="clinic"
        placeholder="Clinic/Hospital"
        value={filters.clinic}
        onChange={handleChange}
        className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
      />
    </div>
  );
};

export default FilterBar;
