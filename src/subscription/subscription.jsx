import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { API_ROUTES } from "../app_modules/apiRoutes";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // add this import

const PlanCard = ({ title, description, price, features, accent, highlight, onSelect, isActive, daysLeft, isDowngrade }) => {
  return (
    <div
      className={`
        relative flex flex-col p-6 md:p-8 rounded-2xl backdrop-blur-sm
        border ${highlight ? `border-${accent}-400/40` : "border-white/10"}
        bg-gradient-to-br ${highlight ? `from-${accent}-700/30 to-${accent}-500/20` : "from-white/5 to-white/10"}
        shadow-lg hover:shadow-2xl transition-all duration-300 ease-out
        hover:-translate-y-2
        ${isActive ? "opacity-70 cursor-not-allowed" : ""}
      `}
    >
      {highlight && (
        <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold">
          POPULAR
        </span>
      )}

      <h3 className="text-lg md:text-xl font-semibold text-white">{title}</h3>
      <p className="text-sm text-slate-300 mt-1">{description}</p>

      {isActive && daysLeft != null && (
        <p className="mt-2 text-xs text-yellow-300">
          {daysLeft} day{daysLeft > 1 ? "s" : ""} left
        </p>
      )}

      <div className="mt-6 mb-6">
        <span className="text-4xl font-bold text-white">{price}</span>
        <span className="text-slate-400 ml-1 text-sm">/mo</span>
      </div>

      <ul className="space-y-4 flex-grow">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-3 text-slate-200 text-sm">
            {f.icon && <i className={`fas ${f.icon} text-${accent}-400`} />}
            <span>{f.text}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        disabled={isActive && !isDowngrade}
        className={`
          mt-8 w-full py-3 rounded-xl font-medium text-sm
          transition-all duration-300
          ${highlight
            ? `bg-${accent}-500 hover:bg-${accent}-400 text-slate-900`
            : "bg-white/10 hover:bg-white/20 text-white"}
          ${isActive && !isDowngrade ? "cursor-not-allowed bg-gray-500 hover:bg-gray-500 text-white" : ""}
        `}
      >
        {isActive && !isDowngrade
          ? "Active"
          : price === "₹0"
          ? "Get Started"
          : isDowngrade
          ? "Downgrade"
          : "Choose Plan"}
      </button>
    </div>
  );
};

const PricingPlans = () => {
  const [currentPlan, setCurrentPlan] = React.useState(null);
  const [daysLeft, setDaysLeft] = React.useState(null);
  const navigate = useNavigate(); // hook for navigation

  React.useEffect(() => {
    const fetchCurrentPlan = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${API_ROUTES.baseURL}/current-plan`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCurrentPlan(data);

        if (!data.isFree && data.expiry) {
          const now = new Date();
          const expiry = new Date(data.expiry);
          const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
          setDaysLeft(diffDays);
        }
      } catch (err) {
        console.error("Error fetching current plan:", err);
      }
    };

    fetchCurrentPlan();
  }, []);

  // Razorpay checkout
  const handlePayment = async (plan, isDowngrade = false) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("⚠️ Please log in first to activate a plan.");
      return;
    }

    let amountInPaise = plan.price * 100;

    if (currentPlan && !currentPlan.isFree && currentPlan.plan !== plan.name && !isDowngrade) {
      // Upgrade → call pro-rate API
      try {
        const res = await fetch(`${API_ROUTES.baseURL}/pro-rate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPlanPrice: plan.price }),
        });
        const data = await res.json();
        amountInPaise = Math.ceil(data.amountToPay);

        if (amountInPaise === 0) {
          alert(`✅ ${plan.name} plan activated!`);
          setCurrentPlan({ plan: plan.name });
          setDaysLeft(data.daysLeft);
          return;
        }
      } catch (err) {
        console.error(err);
        alert("Failed to calculate pro-rated amount.");
        return;
      }
    }

    // Free plan activation
    if (plan.price === 0) {
      alert(`✅ ${plan.name} plan activated for free!`);
      setCurrentPlan({ plan: plan.name });
      setDaysLeft(30);
      return;
    }

    try {
      const res = await fetch(`${API_ROUTES.baseURL}/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInPaise, plan: plan.name, token }),
      });
      const orderData = await res.json();

      const rzp = new window.Razorpay({
        key: "rzp_live_jPX6SxetQbApHC",
        amount: amountInPaise,
        currency: "INR",
        name: "Edusify Premium",
        description: `${plan.name} Plan`,
        order_id: orderData.id,
        handler: async (response) => {
          await fetch(`${API_ROUTES.baseURL}/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: plan.name,
              token,
            }),
          });
          alert(`🎉 ${plan.name} plan activated!`);
          setCurrentPlan({ plan: plan.name });
          setDaysLeft(30); // reset
        },
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed.");
    }
  };

  const plans = [
    {
      name: "Chic",
      description: "Basic starter plan",
      price: 0,
      accent: "cyan",
      features: [
        { icon: "fa-tshirt", text: "20 outfit generations / month" },
        { icon: "fa-comments", text: "20 chats / month" },
      ],
    },
    {
      name: "Bespoke",
      description: "Best for most users",
      price: 29,
      accent: "pink",
      highlight: true,
      features: [
        { icon: "fa-robot", text: "200 outfit generations / month" },
        { icon: "fa-ad", text: "Ad-free experience" },
        { icon: "fa-bullhorn", text: "300 chats / month" },
        { icon: "fa-crown", text: "Premium features" },
      ],
    },
    {
      name: "Couture",
      description: "Unlimited premium access",
      price: 79,
      accent: "purple",
      features: [
        { icon: "fa-infinity", text: "Unlimited outfit generation" },
        { icon: "fa-award", text: "Ad-free + premium features" },
        { icon: "fa-comments", text: "Unlimited chats" },
      ],
    },
  ];

  return (
    <div className="bg-[#0A0E14] h-screen overflow-y-auto py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold text-white">Pricing Plans</h1>
          <p className="mt-2 text-slate-400 text-sm md:text-base">
            Simple, transparent, and designed to scale with you.
          </p>
        </header>
<button
  onClick={() => navigate("/")}
  className="flex items-center gap-2 px-4 py-2 mb-8 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 group"
>
  <FaArrowLeft className="text-lg group-hover:-translate-x-1 transition-transform duration-300" />
  <span className="text-sm font-medium">Back to Home</span>
</button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => {
            const isActive = currentPlan?.plan === plan.name;
            const isDowngrade =
              currentPlan && !currentPlan.isFree && plan.price < currentPlan.price;

            return (
              <PlanCard
                key={i}
                title={plan.name}
                description={plan.description}
                price={`₹${plan.price}`}
                accent={plan.accent}
                highlight={plan.highlight}
                features={plan.features}
                isActive={isActive}
                daysLeft={isActive ? daysLeft : null}
                onSelect={() => handlePayment(plan, isDowngrade)}
                isDowngrade={isDowngrade}
              />
            );
          })}
        </div>

        <div className="mt-10 text-center text-slate-500 text-xs md:text-sm">
          Secure payments. Cancel anytime.
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
