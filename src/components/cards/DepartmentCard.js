"use client";

export default function DepartmentCard({ department }) {
  // department = { _id, name, heading, imageUrl, description, doctors: [...] }
  return (
    <div className="w-64 bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col min-h-[300px]">
      {department.imageUrl && (
        <img
          src={department.imageUrl}
          alt={department.heading || department.name}
          className="w-full h-32 object-cover rounded-lg mb-2"
        />
      )}
      <h3 className="font-bold text-lg mb-1">
        {department.heading || department.name}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
        {department.description}
      </p>
      {department.doctors?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          <span className="font-semibold text-xs">Doctors:</span>
          {department.doctors.slice(0, 2).map((doc) => (
            <span key={doc._id} className="text-primary-600 text-xs">
              {doc.name}
            </span>
          ))}
          {department.doctors.length > 2 && (
            <span className="text-xs text-gray-500 ml-2">
              +{department.doctors.length - 2} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}
