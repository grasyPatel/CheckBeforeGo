// src/components/DoctorCard.jsx
import { Link } from "react-router-dom";

const DoctorCard = ({ doctor }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition">
      <h3 className="text-xl font-bold mb-1">{doctor.name}</h3>
      <p className="text-gray-600 dark:text-gray-300">{doctor.speciality}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{doctor.clinic}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{doctor.location}</p>
      <p className={`mt-2 font-semibold ${doctor.status === "Available" ? "text-green-500" : "text-red-500"}`}>
        {doctor.status}
      </p>
      <Link
        to={`/doctor/${doctor._id}`}
        className="inline-block mt-3 text-blue-600 dark:text-blue-400 hover:underline"
      >
        View Profile →
      </Link>
    </div>
  );
};

export default DoctorCard;
