"use client";

import { useState } from "react";
import { X, ShieldCheck, Clock, FileText, Mail, Linkedin } from "lucide-react";
import { siteConfig } from "@/config/site-config";
import { WASvg } from "./Header";

/* ── Service options ── */
const services = [
  { key: "cv", label: "CV Writing", icon: FileText, desc: "From KSh 500" },
  { key: "cover", label: "Cover Letter", icon: Mail, desc: "From KSh 500" },
  { key: "linkedin", label: "LinkedIn Profile", icon: Linkedin, desc: "From KSh 800" },
];

/* ── Tier options ── */
const tiers = [
  {
    key: "basic",
    name: "Basic",
    price: "KSh 500",
    desc: "Quick review & polish",
    popular: false,
  },
  {
    key: "professional",
    name: "Professional",
    price: "KSh 1,500",
    desc: "Full rewrite by an expert",
    popular: true,
  },
  {
    key: "premium",
    name: "Premium",
    price: "KSh 3,500",
    desc: "CV + Cover Letter + LinkedIn",
    popular: false,
  },
];

export default function CVModal({ isOpen, onClose, jobTitle = "" }) {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);

  if (!isOpen) return null;

  const handleGetStarted = () => {
    const serviceLabel =
      services.find((s) => s.key === selectedService)?.label || "CV Service";
    const tierLabel =
      tiers.find((t) => t.key === selectedTier)?.name || "Professional";
    const msg = encodeURIComponent(
      `Hi, I want a ${tierLabel} ${serviceLabel} for ${jobTitle || "a job application"}`
    );
    const waLink = `${siteConfig.whatsapp.link}?text=${msg}`;
    window.open(waLink, "_blank");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[500] bg-black/50 backdrop-blur-sm flex items-center justify-center p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl max-w-[480px] w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="px-6 pt-6 pb-0 flex justify-between items-start">
          <div>
            <h3 className="text-[1.1rem] font-extrabold text-gray-900">
              Before You Apply...
            </h3>
            <small className="block font-normal text-[0.8rem] text-gray-500 mt-0.5">
              Stand out with a professional CV
            </small>
          </div>
          <button
            className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all cursor-pointer shrink-0"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pt-5 pb-6">
          {/* Step 1: Choose a service */}
          <div className="mb-[18px]">
            <label className="block text-[0.82rem] font-semibold text-gray-700 mb-2">
              Choose a service
            </label>
            <div className="grid grid-cols-3 gap-2">
              {services.map((svc) => {
                const Icon = svc.icon;
                const isSelected = selectedService === svc.key;
                return (
                  <button
                    key={svc.key}
                    onClick={() => setSelectedService(svc.key)}
                    className={`p-3 border-2 rounded-lg text-center cursor-pointer transition-all ${
                      isSelected
                        ? "border-primary bg-primary-light text-primary"
                        : "border-gray-200 text-gray-600 hover:border-primary-light hover:bg-primary-light"
                    }`}
                  >
                    <Icon
                      size={22}
                      className={`mx-auto mb-1.5 ${isSelected ? "text-primary" : "text-gray-400"}`}
                    />
                    <div className="text-[0.82rem] font-semibold">{svc.label}</div>
                    <small className="block font-normal text-[0.7rem] text-gray-400 mt-0.5">
                      {svc.desc}
                    </small>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Choose a tier (shown after selecting service) */}
          {selectedService && (
            <div className="mt-4">
              <label className="block text-[0.82rem] font-semibold text-gray-700 mb-2">
                Choose a tier
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {tiers.map((tier) => {
                  const isSelected = selectedTier === tier.key;
                  return (
                    <button
                      key={tier.key}
                      onClick={() => setSelectedTier(tier.key)}
                      className={`relative border-2 rounded-xl p-4 text-center cursor-pointer transition-all ${
                        tier.popular
                          ? "border-primary"
                          : isSelected
                          ? "border-primary bg-primary-light"
                          : "border-gray-200 hover:border-primary"
                      } ${isSelected && !tier.popular ? "border-primary bg-primary-light" : ""}`}
                    >
                      {/* Popular badge */}
                      {tier.popular && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-white text-[0.6rem] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                          Popular
                        </span>
                      )}
                      <div className="text-[0.8rem] font-bold text-gray-800 mb-1.5">
                        {tier.name}
                      </div>
                      <div className="text-[1.15rem] font-extrabold text-primary">
                        {tier.price}
                      </div>
                      <div className="text-[0.68rem] text-gray-500 leading-snug mt-1">
                        {tier.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mt-4 text-[0.7rem] text-gray-400">
            <span className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-secondary" />
              5,000+ CVs Written
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} className="text-secondary" />
              24hr Delivery
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={handleGetStarted}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-full text-[0.9rem] font-semibold text-white bg-primary hover:bg-primary-dark transition-all cursor-pointer"
          >
            <WASvg size={18} />
            Get Started
          </button>
          <div className="flex items-center gap-1.5 justify-center mt-3 text-[0.8rem] text-gray-500">
            Not sure?{" "}
            <a
              href={`${siteConfig.whatsapp.link}?text=${encodeURIComponent(`Hi, I need help with my CV for ${jobTitle || "a job application"}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] font-semibold no-underline hover:underline inline-flex items-center gap-1"
            >
              Or chat directly on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
