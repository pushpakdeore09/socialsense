import React from "react";
import {
  MessageCircle,
  Cpu,
  Layers,
  Settings,
  CheckCircle,
  ArrowRight,
  ArrowDown,
} from "lucide-react";

const steps = [
  {
    Icon: MessageCircle,
    title: "Input Text",
    description:
      "Users provide social media posts, messages, or journal entries.",
  },
  {
    Icon: Cpu,
    title: "Stage 1 Model",
    description: "AI model detects depression indicators from the input text.",
  },
  {
    Icon: Layers,
    title: "Feature Extraction",
    description:
      "Extract relevant linguistic and sentiment features from text.",
  },
  {
    Icon: Settings,
    title: "Stage 2 Model",
    description:
      "Refined analysis with extracted features to improve accuracy.",
  },
  {
    Icon: CheckCircle,
    title: "Get Result",
    description: "Receive depression risk score and actionable insights.",
  },
];

const HowItWorks = () => {
  const FinalIcon = steps[4].Icon;

  return (
    <section className="bg-gradient-to-br from-white to-green-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-teal-700 mb-16">
          How SocialSense Works
        </h2>

        {/* Desktop Flow Diagram */}
        <div className="hidden md:block">
          {/* Row 1: Steps 1 and 2 */}
          <div className="flex justify-center items-start gap-8 mb-8">
            {/* Step 1 */}
            <StepBox step={steps[0]} />

            {/* Arrow Right */}
            <div className="flex items-center pt-20">
              <ArrowRight size={40} className="text-yellow-500" strokeWidth={2.5} />
            </div>

            {/* Step 2 */}
            <StepBox step={steps[1]} />
          </div>

          {/* Arrows Down */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="w-64 flex justify-center">
              <ArrowDown size={40} className="text-yellow-500" strokeWidth={2.5} />
            </div>
            <div className="w-10" />
            <div className="w-64 flex justify-center">
              <ArrowDown size={40} className="text-yellow-500" strokeWidth={2.5} />
            </div>
          </div>

          {/* Row 2: Steps 3 and 4 */}
          <div className="flex justify-center items-start gap-8 mb-8">
            {/* Step 3 */}
            <StepBox step={steps[2]} />

            {/* Arrow Right */}
            <div className="flex items-center pt-20">
              <ArrowRight size={40} className="text-yellow-500" strokeWidth={2.5} />
            </div>

            {/* Step 4 */}
            <StepBox step={steps[3]} />
          </div>

          {/* Converging Arrows */}
          <div className="flex justify-center items-start mb-8 max-w-2xl mx-auto relative h-24">
            {/* Left arrow down */}
            <div className="absolute left-1/4 top-0">
              <ArrowDown size={40} className="text-yellow-500" strokeWidth={2.5} />
            </div>

            {/* Right arrow down */}
            <div className="absolute right-1/4 top-0">
              <ArrowDown size={40} className="text-yellow-500" strokeWidth={2.5} />
            </div>
          </div>

          {/* Final Result */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center text-center p-8 border-4 border-yellow-400 rounded-xl shadow-xl bg-gradient-to-br from-yellow-50 to-amber-50 max-w-2xl hover:shadow-2xl transition-shadow">
              <FinalIcon size={40} className="text-yellow-400" />
              <h3 className="text-2xl font-bold text-yellow-600 mt-3 mb-3">
                {steps[4].title}
              </h3>
              <p className="text-base text-gray-700">{steps[4].description}</p>
            </div>
          </div>
        </div>

        {/* Mobile version */}
        <div className="md:hidden flex flex-col items-center space-y-6">
          {steps.map((step, idx) => {
            const Icon = step.Icon;
            return (
              <React.Fragment key={step.title}>
                <div
                  className={`flex flex-col items-center text-center p-6 border-2 rounded-xl shadow-md w-full max-w-sm ${
                    idx === steps.length - 1
                      ? "border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <Icon
                    size={idx === steps.length - 1 ? 40 : 32}
                    className={idx === steps.length - 1 ? "text-yellow-400" : "text-teal-600"}
                  />
                  <h3
                    className={`text-lg font-semibold mt-3 mb-2 ${
                      idx === steps.length - 1 ? "text-yellow-600" : "text-teal-800"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>

                {idx !== steps.length - 1 && (
                  <ArrowDown size={36} className="text-yellow-500" strokeWidth={2.5} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Extracted StepBox for reusability & cleaner code
const StepBox = ({ step }) => {
  const Icon = step.Icon;
  return (
    <div className="flex flex-col items-center text-center p-6 border-2 border-gray-200 rounded-xl shadow-md bg-white w-64 hover:shadow-lg transition-shadow">
      <Icon size={32} className="text-teal-600" />
      <h3 className="text-lg font-semibold text-teal-800 mt-3 mb-2">{step.title}</h3>
      <p className="text-sm text-gray-600">{step.description}</p>
    </div>
  );
};

export default HowItWorks;
