import { FiStar } from "react-icons/fi";

export default function Testimonials({ testimonials }) {
  return (
    <section className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">What Our Clients Say</h2>
        <p className="text-gray-500 text-sm">Join 5,000+ professionals who've transformed their careers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
          >
            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.rating }).map((_, i) => (
                <FiStar key={i} size={16} className="text-amber-400 fill-amber-400" />
              ))}
            </div>

            {/* Quote */}
            <p className="text-sm text-gray-600 leading-relaxed mb-5 italic">
              &ldquo;{t.text}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-3">
              <span
                className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center font-bold text-sm text-white shrink-0`}
              >
                {t.initials}
              </span>
              <div>
                <p className="text-sm font-bold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-500">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
