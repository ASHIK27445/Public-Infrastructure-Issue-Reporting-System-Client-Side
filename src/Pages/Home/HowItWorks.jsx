import React from 'react';
import { MapPinned, Shield, Target, CheckCircle } from 'lucide-react';
import Stepper, { Step } from './Stepper';

const steps = [
  {
    number: "01",
    title: "Report",
    description: "Spot an issue? Snap a photo, drop a pin, and submit your report in under 60 seconds.",
    icon: <MapPinned className="w-8 h-8" />
  },
  {
    number: "02",
    title: "Review",
    description: "Our admin team reviews your submission, verifies details, and assigns it to the right department.",
    icon: <Shield className="w-8 h-8" />
  },
  {
    number: "03",
    title: "Action",
    description: "Field staff receive the assignment, verify on-site, and begin the resolution process immediately.",
    icon: <Target className="w-8 h-8" />
  },
  {
    number: "04",
    title: "Resolve",
    description: "Track real-time updates from pending to resolved. Get notified when your issue is fixed and closed.",
    icon: <CheckCircle className="w-8 h-8" />
  }
];

const HowItWorks = () => {
  return (
    <section className="py-32 px-6 bg-linear-to-b from-zinc-950 to-zinc-900">
      <title>CommunityFix - How It Works</title>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-40">
          <div className="inline-block px-6 py-2 rounded-full bg-linear-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 mb-6">
            <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wider">Simple Process</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
            How It <span className="bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            From report to resolution in four seamless steps. Simple, transparent, and incredibly effective.
          </p>
        </div>

        <div className="flex justify-center items-center">
          <div style={{ width: '100%', maxWidth: '560px', minHeight: '420px' }}>
            <Stepper
              initialStep={1}
              backButtonText="Back"
              nextButtonText="Next"
              disableStepIndicators={false}
              onFinalStepCompleted={() => {}}
              stepCircleContainerClassName="how-it-works-stepper"
            >
              {steps.map((step, index) => (
                <Step key={index}>
                  <div className="flex flex-col items-center text-center py-6 px-2">
                    <div className="w-20 h-20 bg-linear-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-xl mb-5">
                      {step.icon}
                    </div>
                    <span className="text-emerald-400 font-black text-sm uppercase tracking-widest mb-2">
                      Step {step.number}
                    </span>
                    <h3 className="text-2xl font-black text-white mb-3">{step.title}</h3>
                    <p className="text-gray-400 leading-relaxed max-w-xs">{step.description}</p>
                  </div>
                </Step>
              ))}
            </Stepper>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;