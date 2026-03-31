// PARKED: Engagements section removed from homepage
// To restore, import Engagements component and OFFERINGS data back into main.tsx
// The component expects an `onInquire` prop that triggers contact form pre-fill + scroll

export const OFFERINGS = [
  {
    title: "Before the Build",
    fit: "For teams about to invest in AI and needing clarity on what to build, why, and where human judgment belongs.",
    outcome: "We work with you to map the system before it exists—surfacing assumptions, constraints, and responsibilities so the first build is the right build.",
    format: "2–4 weeks"
  },
  {
    title: "Mid-Build Clarity",
    fit: "For teams where the prototype worked but production is chaos, or where design, engineering, and product are talking past each other.",
    outcome: "We make the system visible—identifying where confusion lives, what's actually being decided by AI vs. humans, and what constraints have been ignored.",
    format: "2–3 weeks"
  },
  {
    title: "Strategic Validation",
    fit: "For leaders who need to pressure-test an AI investment, product direction, or roadmap before committing further resources.",
    outcome: "We build the argument for or against—with prototypes, system maps, or decision frameworks that make the tradeoffs explicit.",
    format: "4–6 weeks"
  },
  {
    title: "Custom Engagement",
    fit: "Not sure where to start? We often design engagements around emerging problems or unusual constraints.",
    outcome: "",
    format: "",
    isCustom: true
  }
];

// --- Engagements Component ---
// Requires: SectionHeader, RevealText, ScrambleText, ArrowRight from lucide-react
//
// <Engagements onInquire={handleInquire} />
//
// handleInquire wiring (was in App component):
//
// const handleInquire = (title: string, isCustom = false) => {
//   const text = isCustom
//     ? "I'm not sure exactly what we need yet, but I'd like to discuss a potential collaboration."
//     : `I'm interested in exploring the "${title}" engagement for my team.`;
//   setContactIntent({ text, id: Date.now() });
//   trackEvent(`Inquire Clicked: ${title}`);
//   const contactSection = document.getElementById('contact');
//   if (contactSection) {
//     contactSection.scrollIntoView({ behavior: 'smooth' });
//   }
// };

/*
const Engagements = ({ onInquire }: { onInquire: (title: string, isCustom?: boolean) => void }) => {
  return (
    <section className="py-20 md:py-32 px-6 md:px-12 max-w-screen-xl mx-auto bg-lab-concrete" id="engagement" aria-labelledby="engagement-heading">
      <SectionHeader number="03" title="Engagement Models" />

      <RevealText>
        <div className="max-w-3xl mb-16">
          <p className="font-serif text-xl md:text-2xl text-gray-700 leading-relaxed">
            quietloudlab works directly with small teams and organizations designing complex systems—especially AI—at moments of uncertainty or risk. Engagements focus on making assumptions visible, aligning stakeholders, and surfacing consequences before decisions are locked into code.
          </p>
        </div>
      </RevealText>

      <div className="flex flex-col gap-8 md:gap-0 group/list">
        {OFFERINGS.map((offer, index) => (
          <RevealText key={offer.title} delay={index * 0.1}>
            <div
              className="group border-t border-lab-black/20 py-8 md:py-12 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 transition-all duration-500 hover:bg-white/50 opacity-100 group-hover/list:opacity-50 hover:!opacity-100 px-4 md:px-8 -mx-4 md:-mx-8 rounded-lg"
            >
              <div className="md:col-span-4 flex flex-col">
                <div>
                  <span className="font-mono text-sm text-lab-olive mb-3 block">(0{index + 1})</span>
                  <h3 className="text-2xl md:text-3xl font-sans tracking-tight mb-3 leading-none text-lab-black">
                    {offer.title}
                  </h3>
                  {offer.format && (
                    <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
                      Typical engagement: {offer.format}
                    </p>
                  )}
                </div>
              </div>

              <div className="md:col-span-8 flex flex-col justify-between">
                <div className="mb-6">
                  <p className="font-serif text-lg md:text-xl text-gray-800 leading-relaxed mb-4">
                    {offer.fit}
                  </p>
                  {offer.outcome && (
                    <p className="font-serif text-base text-gray-600 leading-relaxed">
                      {offer.outcome}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => onInquire(offer.title, offer.isCustom)}
                    className="bg-transparent border border-lab-black px-6 py-3 font-mono text-sm uppercase tracking-widest hover:bg-lab-black hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-lab-olive focus:ring-offset-2 group/btn inline-flex items-center gap-2"
                    aria-label={offer.isCustom ? "Let's define the brief" : `Inquire about ${offer.title}`}
                  >
                    <ScrambleText text={offer.isCustom ? "Let's Define the Brief" : "Inquire"} hover={true} />
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </RevealText>
        ))}
        <div className="border-t border-lab-black/20" />
      </div>
    </section>
  );
};
*/
