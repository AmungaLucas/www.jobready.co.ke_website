"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useSession";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle2, ExternalLink } from "lucide-react";

export default function ApplyModal({ job, open, onOpenChange }) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [applied, setApplied] = useState(false);
  const [appliedAt, setAppliedAt] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [error, setError] = useState("");

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setCoverLetter("");
      setError("");
      setSubmitting(false);
      setCheckingStatus(true);

      if (isAuthenticated) {
        // Check if user already applied
        fetch(`/api/jobs/${job.slug}/apply`)
          .then((res) => res.json())
          .then((data) => {
            if (data.applied) {
              setApplied(true);
              setAppliedAt(data.appliedAt);
            } else {
              setApplied(false);
            }
          })
          .catch(() => {})
          .finally(() => setCheckingStatus(false));
      } else {
        setApplied(false);
        setCheckingStatus(false);
      }
    }
  }, [open, job.slug, isAuthenticated]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      onOpenChange(false);
      router.push(
        `/login?callbackUrl=${encodeURIComponent(window.location.href)}`
      );
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/jobs/${job.slug}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coverLetter: coverLetter.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setApplied(true);
          setAppliedAt(new Date().toISOString());
          return;
        }
        throw new Error(data.error || "Application failed");
      }

      setApplied(true);
      setAppliedAt(new Date().toISOString());
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Already Applied State ──
  if (applied) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[440px]">
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Application Submitted!
            </h3>
            <p className="text-sm text-gray-500 mb-1">
              You&apos;ve applied for{" "}
              <strong className="text-gray-800">{job.title}</strong> at{" "}
              <strong className="text-gray-800">
                {job.company?.name || "the company"}
              </strong>
            </p>
            {appliedAt && (
              <p className="text-xs text-gray-400">
                Applied on{" "}
                {new Date(appliedAt).toLocaleDateString("en-KE", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            )}
            <div className="mt-5 space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
              <Button
                variant="ghost"
                className="w-full text-[#1a56db] hover:text-[#1e40af]"
                onClick={() => {
                  onOpenChange(false);
                  router.push("/dashboard/applications");
                }}
              >
                View My Applications
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ── Auth Gate (not logged in) ──
  if (!authLoading && !isAuthenticated) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Sign in to Apply</DialogTitle>
            <DialogDescription>
              Create a free account or sign in to apply for{" "}
              <strong>{job.title}</strong> at{" "}
              {job.company?.name || "this company"}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <Button
              className="w-full bg-[#1a56db] hover:bg-[#1e40af]"
              onClick={() => {
                onOpenChange(false);
                router.push(
                  `/login?callbackUrl=${encodeURIComponent(
                    window.location.href
                  )}`
                );
              }}
            >
              Sign In
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                onOpenChange(false);
                router.push(
                  `/register?callbackUrl=${encodeURIComponent(
                    window.location.href
                  )}`
                );
              }}
            >
              Create Free Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ── Apply Form ──
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Apply for this Position</DialogTitle>
          <DialogDescription>
            <strong>{job.title}</strong> at{" "}
            {job.company?.name || "the company"}
            {job.location && ` · ${job.location}`}
          </DialogDescription>
        </DialogHeader>

        {checkingStatus ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="space-y-4 pt-1">
            {/* Deadline warning */}
            {job.deadline && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                <strong>Deadline:</strong>{" "}
                {new Date(job.deadline).toLocaleDateString("en-KE", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            )}

            {/* Cover letter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Cover Letter{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <Textarea
                placeholder="Tell the employer why you're a great fit for this role..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={5}
                className="resize-none text-sm"
                disabled={submitting}
              />
              <p className="text-xs text-gray-400 mt-1">
                {coverLetter.length}/2000 characters
              </p>
            </div>

            {/* External apply link notice */}
            {job.externalApplyUrl && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                <div className="flex items-center gap-1.5 font-semibold mb-1">
                  <ExternalLink className="w-4 h-4" />
                  Note
                </div>
                This employer also accepts applications directly on their
                website. Submitting here records your application on JobReady.
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Submit */}
            <div className="flex gap-3 pt-1">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-[#059669] hover:bg-[#047857]"
                onClick={handleApply}
                disabled={submitting || coverLetter.length > 2000}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </div>

            <p className="text-xs text-gray-400 text-center">
              By applying, you agree to share your profile info with the
              employer. You can track your application in your dashboard.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
