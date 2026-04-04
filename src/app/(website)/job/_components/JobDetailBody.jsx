import { formatDate } from "@/lib/format";

export default function JobDetailBody({ job }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-6">
      <div className="p-5 md:p-7">
        <h2 className="text-[1.15rem] font-bold text-gray-900 mb-5 pb-2.5 border-b-2 border-gray-100">
          Job Description
        </h2>
        <div
          className="text-[0.93rem] text-gray-700 leading-[1.85] prose-content"
          dangerouslySetInnerHTML={{ __html: job.description }}
        />
      </div>
    </div>
  );
}
