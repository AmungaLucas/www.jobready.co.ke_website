import { FiBriefcase } from "react-icons/fi";

export default function CompanyStats({ stats }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex justify-center">
        <div>
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-2">
            <FiBriefcase size={20} className="text-blue-600" />
          </div>
          <p className="text-xl font-extrabold text-gray-900">{stats.openJobs}</p>
          <p className="text-xs text-gray-500">Open Jobs</p>
        </div>
      </div>
    </div>
  );
}
