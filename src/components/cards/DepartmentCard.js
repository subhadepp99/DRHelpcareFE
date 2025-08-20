"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function DepartmentCard({ department }) {
  const router = useRouter();
  // department = { _id, name, heading, imageUrl, description, doctors: [...] }

  const handleClick = () => {
    router.push(`/search?type=doctors&department=${department.name}`);
  };

  return (
    <div
      className="w-56 bg-white dark:bg-gray-900 rounded-lg shadow p-4 flex flex-col min-h-[240px] cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
      onClick={handleClick}
    >
      {department.imageUrl && (
        <div className="relative w-full h-24 mb-3">
          <Image
            src={department.imageUrl}
            alt={department.heading || department.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}
      <h3 className="font-bold text-base mb-2">
        {department.heading || department.name}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm line-clamp-2 flex-1">
        {department.description}
      </p>
      {department.doctors?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-auto pt-2">
          <span className="font-semibold text-xs">Doctors:</span>
          {department.doctors.slice(0, 2).map((doc) => (
            <span key={doc._id || doc} className="text-primary-600 text-xs">
              {typeof doc === "object" ? doc.name : doc}
            </span>
          ))}
          {department.doctors.length > 2 && (
            <span className="text-xs text-gray-500 ml-1">
              +{department.doctors.length - 2} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}
