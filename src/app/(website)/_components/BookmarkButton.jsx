"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FiBookmark } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function BookmarkButton({ jobId }) {
  const { data: session, status } = useSession();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if already saved
    if (session?.user?.id && jobId) {
      fetch(`/api/saved-jobs?jobId=${jobId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.saved) setIsSaved(true);
        })
        .catch(() => {});
    }
  }, [session?.user?.id, jobId]);

  const toggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user?.id) {
      router.push("/login?callbackUrl=" + encodeURIComponent(window.location.pathname));
      return;
    }

    setLoading(true);
    try {
      if (isSaved) {
        await fetch("/api/saved-jobs", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId }),
        });
        setIsSaved(false);
      } else {
        await fetch("/api/saved-jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId }),
        });
        setIsSaved(true);
      }
    } catch {
      setMsg("Failed — try again");
      setTimeout(() => setMsg(""), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={toggleSave}
        disabled={loading}
        className={`border p-2 rounded-md transition cursor-pointer ${
          isSaved
            ? "border-teal-400 bg-teal-50 text-teal-600"
            : "border-gray-300 text-gray-700 hover:bg-gray-50"
        } ${loading ? "opacity-50" : ""}`}
        title={isSaved ? "Remove from saved jobs" : "Save this job"}
      >
        <FiBookmark className={`w-5 h-5 ${isSaved ? "fill-teal-600" : ""}`} />
      </button>
      {msg && <p className="text-red-500 text-xs mt-1">{msg}</p>}
    </>
  );
}
