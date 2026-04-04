"use client";

import { useState } from "react";
import { services } from "./mock-data";
import OrderModal from "./OrderModal";

export default function PricingTable({ comparison }) {
  const { features, basic, professional, premium } = comparison;

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);

  // Open modal for a specific tier
  const openOrderModal = (tierKey) => {
    const cvService = services.find((s) => s.id === "cv-writing");
    if (!cvService) return;

    // Find the tier object from services data
    let tierObj;
    if (tierKey === "basic") tierObj = cvService.tiers.find((t) => t.name === "Basic");
    else if (tierKey === "professional") tierObj = cvService.tiers.find((t) => t.name === "Professional");
    else if (tierKey === "premium") tierObj = cvService.tiers.find((t) => t.name === "Premium");

    if (!tierObj) return;

    setSelectedService(cvService);
    setSelectedTier(tierObj);
    setIsModalOpen(true);
  };

  return (
    <>
      <section className="py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">CV Writing Packages Compared</h2>
          <p className="text-gray-500 text-sm">Choose the package that&apos;s right for you</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-4 w-1/4">
                  Feature
                </th>
                <th className="text-center text-xs font-semibold text-gray-700 uppercase tracking-wide px-5 py-4">
                  {basic.name}
                  <div className="text-base font-extrabold text-gray-900 mt-1">{basic.price}</div>
                </th>
                <th className="text-center px-5 py-4 bg-blue-50 border-x-2 border-blue-200">
                  <span className="inline-block text-[0.65rem] font-bold bg-blue-600 text-white px-2.5 py-1 rounded-full mb-2">
                    Most Popular
                  </span>
                  <div className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    {professional.name}
                  </div>
                  <div className="text-base font-extrabold text-blue-700 mt-1">{professional.price}</div>
                </th>
                <th className="text-center text-xs font-semibold text-gray-700 uppercase tracking-wide px-5 py-4">
                  {premium.name}
                  <div className="text-base font-extrabold text-gray-900 mt-1">{premium.price}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, idx) => (
                <tr
                  key={feature}
                  className={`border-t border-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                >
                  <td className="text-sm text-gray-700 font-medium px-5 py-3.5">{feature}</td>
                  <td className="text-sm text-gray-600 text-center px-5 py-3.5">{basic.values[idx]}</td>
                  <td className="text-sm text-blue-700 font-semibold text-center px-5 py-3.5 bg-blue-50/50">
                    {professional.values[idx]}
                  </td>
                  <td className="text-sm text-gray-600 text-center px-5 py-3.5">{premium.values[idx]}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-gray-200">
                <td className="px-5 py-4" />
                <td className="text-center px-5 py-4">
                  <button
                    onClick={() => openOrderModal("basic")}
                    className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border-2 border-gray-200 text-sm font-bold text-gray-700 hover:border-blue-400 hover:text-blue-600 transition-all cursor-pointer"
                  >
                    Order Now
                  </button>
                </td>
                <td className="text-center px-5 py-4 bg-blue-50/50">
                  <button
                    onClick={() => openOrderModal("professional")}
                    className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Order Now
                  </button>
                </td>
                <td className="text-center px-5 py-4">
                  <button
                    onClick={() => openOrderModal("premium")}
                    className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border-2 border-gray-200 text-sm font-bold text-gray-700 hover:border-blue-400 hover:text-blue-600 transition-all cursor-pointer"
                  >
                    Order Now
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Order Modal */}
      {selectedService && selectedTier && (
        <OrderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          service={selectedService}
          selectedTier={selectedTier}
        />
      )}
    </>
  );
}
