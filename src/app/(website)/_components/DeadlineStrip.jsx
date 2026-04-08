"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiClock, FiArrowRight } from "react-icons/fi";

function getCountdown(deadline) {
  if (!deadline) return null;
  const now = new Date().getTime();
  const end = new Date(deadline).getTime();
  const diff = end - now;

  if (diff <= 0) return { text: "Closed", urgent: true };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return { text: `${days}d ${hours}h left`, urgent: days <= 3 };
  if (hours > 0) return { text: `${hours}h ${minutes}m left`, urgent: true };
  return { text: `${minutes}m left`, urgent: true };
}

function CountdownTimer({ deadline }) {
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    setCountdown(getCountdown(deadline));
    const timer = setInterval(() => {
      setCountdown(getCountdown(deadline));
    }, 60000);
    return () => clearInterval(timer);
  }, [deadline]);

  if (!countdown) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
        countdown.urgent
          ? "bg-red-100 text-red-700"
          : "bg-amber-100 text-amber-700"
      }`}
    >
      <FiClock className="w-3 h-3" />
      {countdown.text}
    </span>
  );
}

export default function DeadlineStrip({ jobs }) {
  if (!jobs || jobs.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <FiClock className="w-5 h-5 text-red-500" />
          Closing Soon
        </h2>
        <Link
          href="/jobs?sort=deadline"
          className="text-sm text-purple-700 hover:text-purple-800 font-medium flex items-center gap-1 no-underline"
        >
          View all <FiArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <Link
            key={job.id}
            href={`/jobs/${job.slug}`}
            className="group block bg-white border-l-4 border-l-red-500 rounded-lg border border-gray-100 p-4 hover:shadow-md transition-shadow no-underline"
          >
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-purple-700 transition-colors mb-1 line-clamp-1">
              {job.title}
            </h3>
            <p className="text-xs text-gray-500 mb-2">
              {job.company?.name || "Company"}
            </p>
            <CountdownTimer deadline={job.applicationDeadline} />
          </Link>
        ))}
      </div>
    </section>
  );
}
