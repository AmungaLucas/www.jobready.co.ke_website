import { FiBriefcase, FiUsers, FiTrendingUp } from "react-icons/fi";

export default function CompanyStats({ stats }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-2">
            <FiBriefcase size={20} className="text-blue-600" />
          </div>
          <p className="text-xl font-extrabold text-gray-900">{stats.openJobs}</p>
          <p className="text-xs text-gray-500">Open Jobs</p>
        </div>
        <div>
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-2">
            <FiUsers size={20} className="text-emerald-600" />
          </div>
          <p className="text-xl font-extrabold text-gray-900">{stats.totalHires}</p>
          <p className="text-xs text-gray-500">Total Hires</p>
        </div>
        <div>
          <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center mx-auto mb-2">
            <FiTrendingUp size={20} className="text-violet-600" />
          </div>
          <p className="text-xl font-extrabold text-gray-900">{stats.employees}</p>
          <p className="text-xs text-gray-500">Employees</p>
        </div>
      </div>
    </div>
  );
}
