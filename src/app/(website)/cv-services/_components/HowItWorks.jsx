import { FiMousePointer, FiMessageCircle, FiEdit3, FiCheckCircle } from "react-icons/fi";

const iconMap = {
  choose: FiMousePointer,
  share: FiMessageCircle,
  write: FiEdit3,
  receive: FiCheckCircle,
};

export default function HowItWorks({ steps }) {
  return (
    <section className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">How It Works</h2>
        <p className="text-gray-500 text-sm">Get your professional CV in 4 simple steps</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, idx) => {
          const Icon = iconMap[step.icon] || FiCheckCircle;
          return (
            <div key={step.step} className="relative text-center">
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gray-200" />
              )}

              {/* Step number circle */}
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto mb-4 relative z-10">
                <Icon size={24} />
              </div>

              <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                  Step {step.step}
                </span>
                <h3 className="text-sm font-bold text-gray-900 mt-1 mb-2">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
