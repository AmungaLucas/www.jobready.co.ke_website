"use client";

import { useState } from "react";
import { getWhatsAppLink } from "./mock-data";
import { FiFileText, FiMail, FiLinkedin } from "react-icons/fi";
import OrderModal from "./OrderModal";

const iconMap = {
  cv: FiFileText,
  letter: FiMail,
  linkedin: FiLinkedin,
};

export default function ServiceCard({ service }) {
  const Icon = iconMap[service.icon] || FiFileText;
  const cheapestTier = service.tiers[0];
  const popularTier = service.tiers.find((t) => t.popular);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTierForModal, setSelectedTierForModal] = useState(null);

  const handleOrder = () => {
    setSelectedTierForModal(popularTier || cheapestTier);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
        {/* Icon */}
        <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
          <Icon size={24} className="text-blue-600" />
        </div>

        {/* Name & description */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">{service.name}</h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-4">{service.description}</p>

        {/* Price range */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-extrabold text-gray-900">
            KSh {cheapestTier.price.toLocaleString()}
          </span>
          <span className="text-sm text-gray-400">starting</span>
        </div>

        {/* Tier list */}
        <div className="space-y-2 mb-5">
          {service.tiers.map((tier) => (
            <div
              key={tier.name}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                tier.popular
                  ? "bg-blue-50 border border-blue-200"
                  : "bg-gray-50"
              }`}
            >
              <span className="font-semibold text-gray-700">
                {tier.name}
                {tier.popular && (
                  <span className="ml-2 text-[0.65rem] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                    Popular
                  </span>
                )}
              </span>
              <span className="font-bold text-gray-900">KSh {tier.price.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleOrder}
          className="block w-full text-center px-5 py-3 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Order {service.name}
        </button>
      </div>

      {/* Order Modal */}
      {selectedTierForModal && (
        <OrderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          service={service}
          selectedTier={selectedTierForModal}
        />
      )}
    </>
  );
}
