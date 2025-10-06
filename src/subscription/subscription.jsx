import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

const PlanCard = ({ title, description, price, features, accent, highlight }) => {
  return (
    <div
      className={`
        relative flex flex-col p-6 md:p-8 rounded-2xl backdrop-blur-sm
        border ${highlight ? `border-${accent}-400/40` : "border-white/10"}
        bg-gradient-to-br ${highlight ? `from-${accent}-700/30 to-${accent}-500/20` : "from-white/5 to-white/10"}
        shadow-lg hover:shadow-2xl transition-all duration-300 ease-out
        hover:-translate-y-2
      `}
    >
      {highlight && (
        <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold">
          POPULAR
        </span>
      )}

      <h3 className="text-lg md:text-xl font-semibold text-white">{title}</h3>
      <p className="text-sm text-slate-300 mt-1">{description}</p>

      <div className="mt-6 mb-6">
        <span className="text-4xl font-bold text-white">{price}</span>
        <span className="text-slate-400 ml-1 text-sm">/mo</span>
      </div>

      <ul className="space-y-4 flex-grow">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-3 text-slate-200 text-sm">
            <i className={`fas ${f.icon} text-${accent}-400`} />
            <span>{f.text}</span>
          </li>
        ))}
      </ul>

      <button
        className={`
          mt-8 w-full py-3 rounded-xl font-medium text-sm
          transition-all duration-300
          ${highlight
            ? `bg-${accent}-500 hover:bg-${accent}-400 text-slate-900`
            : "bg-white/10 hover:bg-white/20 text-white"}
        `}
      >
        Choose Plan
      </button>
    </div>
  );
};

const PricingPlans = () => {
  return (
    <div className="bg-[#0A0E14] min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold text-white">
            Pricing Plans
          </h1>
          <p className="mt-2 text-slate-400 text-sm md:text-base">
            Simple, transparent, and designed to scale with you.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PlanCard
            title="Chic"
            description="Basic starter plan"
            price="₹0"
            accent="cyan"
            features={[
              { icon: "fa-tshirt", text: "20 outfit generations / month" },
              { icon: "fa-comments", text: "20 chats / month" },
            ]}
          />

          <PlanCard
            title="Bespoke"
            description="Best for most users"
            price="₹29"
            accent="pink"
            highlight
            features={[
              { icon: "fa-robot", text: "200 outfit generations / month" },
              { icon: "fa-ad", text: "Ad-free experience" },
              { icon: "fa-bullhorn", text: "300 chats / month" },
              { icon: "fa-crown", text: "Premium features" },
            ]}
          />

          <PlanCard
            title="Couture"
            description="Unlimited premium access"
            price="₹79"
            accent="purple"
            features={[
              { icon: "fa-infinity", text: "Unlimited outfit generation" },
              { icon: "fa-award", text: "Ad-free + premium features" },
              { icon: "fa-comments", text: "Unlimited chats" },
            ]}
          />
        </div>

        <div className="mt-10 text-center text-slate-500 text-xs md:text-sm">
          Secure payments. Cancel anytime.
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
