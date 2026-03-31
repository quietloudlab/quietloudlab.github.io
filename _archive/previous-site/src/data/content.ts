export const siteMeta = {
  title: 'quietloudlab',
  tagline: 'Making AI systems legible.',
  location: 'Dallas, Texas · Moving to Amsterdam, 2026',
};

export const heroTrailImages = [
  'Workshop photo — team collaborating around whiteboard with sticky notes and system maps',
  'Studio screenshot — canvas view showing a RAG pattern with task nodes, data flows, and constraints',
  'Prototype screen — AI interaction concept in a mobile interface',
  'Workshop artifact — initiative prioritization wall with yellow tags',
  'System map detail — node cluster showing constraints and handoffs',
  'Founder prototype — Lore trip memory view on phone',
  'Healthcare workshop — pathology billing workflow mapped across touchpoints',
  'Research artifact — interaction framework document spread',
  'Studio screenshot — mapped system with visible task nodes and side panel',
  'Workshop table — printed documents, markers, and clustering notes',
  'Prototype — executive show-and-tell screen with risk framing',
  'System map sketch — assumptions, inputs, and human review points',
  'Atlas diagram — interaction pattern reference board',
  'Workshop output document — sequenced roadmap with owners',
  'Prototype screen — AI-assisted memory bundling interaction',
];

export const homeContent = {
  hero: {
    title: ['We help teams see', "the AI systems", "they're building."],
    scatter: 'legible',
  },
  intro:
    "quietloudlab makes AI systems legible — the assumptions, data flows, human decisions, and constraints that are invisible until someone maps them. We build the shared artifacts that let teams align, govern, and ship.",
  problem: {
    label: 'The common thread',
    heading: "Every AI failure we've seen started the same way.",
    body: [
      "Engineering saw architecture. Product saw features. Design saw interactions. Leadership saw risk. They were all looking at the same system, but nobody could point at the same map — because the map didn't exist.",
      "The initiative stalled. Adoption flatlined. Deals went cold. Boards got nervous. Not because the technology was wrong, but because the system was invisible to the people who needed to make decisions about it.",
      "This is a legibility problem. And it's the only problem we solve.",
    ],
  },
  scenarios: [
    {
      tag: 'Your AI initiative is stuck.',
      title: "You shipped something. The team can't explain it to stakeholders.",
      body:
        'Design was brought in late. Adoption is flat. Everyone describes the system differently because nobody can see the whole thing.',
      cta: "What's happening and how we help",
      to: '/situations/ai-hangover',
      image: 'Scenario preview — workshop team aligning around a shared system map',
    },
    {
      tag: "Your AI company can't close deals.",
      title: 'Your demos impress engineers and lose everyone else.',
      body:
        "Sales cycles drag because enterprise buyers can't connect your technical architecture to their business outcomes. You know the tech is stronger than the story.",
      cta: "What's happening and how we help",
      to: '/situations/ai-providers',
      image: 'Scenario preview — business-context demo replacing an architecture slide',
    },
    {
      tag: 'Your organization committed to AI. Now what?',
      title: 'Leadership made the promise. Nobody can explain what it means in practice.',
      body:
        'You need something concrete to show progress within twelve months. The team needs plain language, a path, and evidence of responsible thinking.',
      cta: "What's happening and how we help",
      to: '/situations/ai-readiness',
      image: 'Scenario preview — facilitated session with printed roadmap materials',
    },
  ],
  proofNote:
    'The AI Interaction Atlas — an open-source framework for mapping how AI systems behave. Adopted by teams designing AI at scale.',
  methodology: [
    {
      title: 'Explore',
      description: 'Understand the problem and where intelligent systems bring value.',
      timeline: '3 – 10 days',
    },
    {
      title: 'Design',
      description: 'Translate opportunity into clear system architecture and interaction design.',
      timeline: '4 – 6 weeks',
    },
    {
      title: 'Validate',
      description: 'Create tangible prototypes, test the concept, and secure buy-in.',
      timeline: '2 – 4 weeks',
    },
  ],
  methodologyShowcase: [
    {
      title: 'Explore',
      timeline: 'Timeline: 3 - 10 days',
      problem:
        'Are your experiments fit for scale? Is a chatbot really the right move? AI provides countless opportunities for innovation, but do you know if the one you chose is right for your users?',
      action:
        "Together, we'll dive into the context you're experimenting within to quickly and thoroughly map and plan the AI system you should build.",
      outcome:
        'A legible, prioritized vision for AI systems that solve real problems for real people, and a strategy your team can reason from.',
      engagements: [
        ['AI Opportunity Discovery', 'Identify which problems AI is particularly well-suited to solve, and which are not.'],
        ['AI Interaction Exploration', 'Define the core purpose, functionality, and interaction model of your AI solution.'],
        ['Innovation Workshops', 'Quickly align the team on what needs to be built, why, and how.'],
      ],
      image: 'Workshop photo — teams mapping opportunities and AI fit on large-format paper',
    },
    {
      title: 'Design',
      timeline: 'Timeline: 4 - 6 weeks',
      problem:
        'What does an AI system look like with a person in the middle of it? Is the shape of the system right for your users? Moving from a promising concept to a buildable product is notoriously messy.',
      action:
        "Together, we'll translate your AI concepts into a buildable architecture and interaction design that maps what the system needs to know, do, and what that means for the person using it.",
      outcome:
        'Actionable system blueprints and interaction models that your team can reason from. We frame the key system experience, design, and technical constraints so your team builds exactly what needs to be built.',
      engagements: [
        ['System & Architecture Mapping', 'Define the layer beneath the interaction: data flows, model constraints, and system logic.'],
        ['Human-AI Workflow Design', 'Map exactly how the human and the intelligent system will collaborate step-by-step.'],
        ['Structural Concept Design', 'Build the structural and interaction models that prove the logic of the system holds up against human context and complexity.'],
      ],
      image: 'Studio screenshot — mapped system architecture and interaction model on a dark canvas',
    },
    {
      title: 'Validate',
      timeline: 'Timeline: 2 - 4 weeks',
      problem:
        'Do your users truly understand the new AI tool you’re building? Do your stakeholders see the value? How might we prove the concept before securing budget or spending months building?',
      action:
        "We'll build tangible, interactive prototypes of your AI system that work on real data, capture insight with real users and stakeholders, and validate the behavior of the product.",
      outcome:
        'Validated product direction and the insights needed to secure buy-in, surfaced through a high-fidelity experiential prototype we test and iterate on directly with real users.',
      engagements: [
        ['Experiential Prototyping', 'Build interactive, testable interfaces that simulate the AI experience.'],
        ['Behavioral Testing', 'Put the prototype in front of humans to validate the interaction and uncover friction points early.'],
        ['Executive Show-and-Tell', 'Create high-impact visual artifacts designed specifically to secure internal alignment and funding.'],
      ],
      image: 'Prototype mockup — high-fidelity product interface tested with users',
    },
  ],
};

export const collageItems = [
  { description: 'Workshop sticky notes close-up', aspectRatio: '1 / 1', shape: 'circle' as const, className: 'left-[2%] top-[8%] w-44' },
  { description: 'Studio canvas showing a mapped system', aspectRatio: '4 / 3', className: 'left-[18%] top-[0%] w-80' },
  { description: 'Team at whiteboard during workshop', aspectRatio: '3 / 4', className: 'left-[50%] top-[10%] w-64' },
  { description: 'Lore app screen detail', aspectRatio: '1 / 1', shape: 'circle' as const, className: 'right-[8%] top-[6%] w-36' },
  { description: 'Pathology billing workshop collaboration', aspectRatio: '16 / 10', className: 'left-[8%] bottom-[4%] w-[28rem]' },
  { description: 'System map node cluster detail', aspectRatio: '1 / 1', className: 'left-[46%] bottom-[8%] w-44' },
  { description: 'Prototype screen showing AI interaction', aspectRatio: '1 / 1', shape: 'circle' as const, className: 'right-[24%] bottom-[0%] w-48' },
  { description: 'Workshop output document', aspectRatio: '3 / 4', className: 'right-[0%] bottom-[14%] w-56' },
];

export const aboutCollageItems = [
  { description: 'Brandon facilitating a workshop', aspectRatio: '1 / 1', shape: 'circle' as const, className: 'left-[4%] top-[6%] w-48' },
  { description: 'Workshop table with artifacts', aspectRatio: '3 / 2', className: 'left-[20%] top-[2%] w-80' },
  { description: 'Close-up of system map sketch', aspectRatio: '1 / 1', shape: 'circle' as const, className: 'right-[10%] top-[10%] w-36' },
  { description: 'Brandon presenting at a conference', aspectRatio: '3 / 4', className: 'left-[54%] top-[16%] w-64' },
  { description: 'Studio canvas on a laptop screen', aspectRatio: '4 / 3', className: 'left-[10%] bottom-[4%] w-[24rem]' },
  { description: 'Sticky notes detail', aspectRatio: '1 / 1', shape: 'circle' as const, className: 'left-[46%] bottom-[8%] w-40' },
  { description: 'Collaborative sketching moment', aspectRatio: '3 / 4', className: 'right-[0%] bottom-[14%] w-56' },
];

export const workEntries = [
  {
    title: 'Lore Social Memory App',
    subtitle: '6-week Prototype Sprint',
    summary:
      'A founder ready to hire engineers before the product had a coherent concept, shared language, or a defined AI interaction model.',
    tags: ['Founder Collaboration', 'AI Interaction Design', 'Product Strategy', 'Early-Stage / 0→1'],
    to: '/work/lore',
    primaryImage: 'Lore phone mockup showing trip memory view',
    secondaryImage: 'Globe visualization with memory pins',
  },
  {
    title: 'AI-Assisted Workflow for Pathology Billing',
    subtitle: '5-hour Design Workshop',
    summary:
      'A healthcare client asked us to explore how AI could reduce friction in pathology lab billing workflows, where incomplete reports and missing information force claims to be returned for correction.',
    tags: ['AI Systems Strategy', 'Service Design'],
    to: '/work/pathology-billing',
    primaryImage: 'Team collaborating at whiteboard during workshop',
    secondaryImage: 'Pathology report document with annotations',
  },
];

export const loreCaseStudy = {
  quote: `"I'm mad, because I should have been organizing this way forever."`,
  quoteSource: '— User testing participant, unprompted',
  narrative: [
    {
      title: 'Situation',
      body:
        'A founder ready to hire engineers before the product had a coherent concept, shared language, or a defined AI interaction model.',
    },
    {
      title: 'What the work prevented',
      body:
        'Building globe-first navigation that six users ignored entirely. Shipping inconsistent architecture caused by fuzzy terminology. Adding AI as decoration — a chat interface bolted on — rather than designing it as the core interaction model: automatic memory bundling, contextual enrichment prompts surfaced within the memory canvas, and social notifications designed as emotional re-entry points into shared experiences.',
    },
    {
      title: 'What it produced',
      body:
        'Content hierarchy and terminology system ready for developer handoff. Tested interaction language across six primary prototype flows. A strategic reframe — from consumer social app to personal context management platform — that restructured the product thesis and the fundraising conversation.',
    },
  ],
};

export const pathologyCaseStudy = {
  title: 'AI-Assisted Workflow for Pathology Billing',
  subtitle: '5-hour Design Workshop',
  summary:
    'A healthcare client asked us to explore how AI could reduce friction in pathology lab billing workflows, where incomplete reports and missing information force claims to be returned for correction.',
  tags: ['AI Systems Strategy', 'Service Design'],
  narrative: [
    {
      title: 'Situation',
      body:
        'A pathology billing workflow was slowing down because reports arrived incomplete, key details were missing, and claims kept returning for correction. The client wanted to understand where AI could genuinely reduce friction without adding compliance risk.',
    },
    {
      title: 'What the work focused on',
      body:
        'We ran a structured workshop to map the workflow end to end, identify where information degraded, and distinguish between tasks that could be assisted by AI and tasks that required human review. The point was not to force AI into the system. It was to make the workflow visible enough to reason about responsibly.',
    },
    {
      title: 'What it produced',
      body:
        'A legible picture of the workflow, a shortlist of promising intervention points, and a clearer framing of how an AI-assisted workflow could reduce rework while preserving accountability and review at the right moments.',
    },
  ],
};

export const approachContent = {
  heroTitle: ['A system cannot be governed', "if it can't be seen."],
  intro:
    'Every engagement starts from the same premise: the people building the AI system and the people making decisions about it need to be looking at the same thing. Our work makes that possible — through system mapping, facilitated alignment, and tangible prototypes that turn complexity into shared understanding.',
  phases: [
    {
      title: 'Explore',
      description: 'Understand the problem and where intelligent systems bring value.',
      problem: 'Are your experiments fit for scale? Is a chatbot really the right move?',
      action:
        "Together, we'll dive into the context you're experimenting within to quickly and thoroughly map and plan the AI system you should build.",
      outcome:
        'A legible, prioritized vision for AI systems that solve real problems for real people, and a strategy your team can reason from.',
    },
    {
      title: 'Design',
      description: 'Translate opportunity into clear system architecture and product design.',
      problem: 'Moving from a promising concept to a buildable product is notoriously messy.',
      action:
        "We'll shape the architecture, interactions, and service logic together so the work can move from concept to a grounded product direction.",
      outcome:
        'A detailed system map, interaction model, and decision-ready plan that gives engineering, design, and leadership the same frame.',
    },
    {
      title: 'Validate',
      description: 'Create tangible prototypes, test the concept for scale, and secure buy-in.',
      problem: "It isn't enough to describe a direction. People need to experience it.",
      action:
        "We'll build prototypes, simulate the experience, and pressure-test the concept before teams commit to a costly build.",
      outcome:
        'Artifacts that validate the direction, surface risk early, and make the next decision obvious.',
    },
  ],
};

export const aboutContent = {
  title: ['Brandon Harwood', 'Founder, quietloudlab'],
  narrative: [
    "I spent a decade at IBM's Innovation Studio helping enterprise teams figure out what to build with AI — running workshops, designing systems, prototyping interactions, and publishing research on how humans and intelligent systems work together.",
    "Over hundreds of engagements, I kept seeing the same pattern: AI initiatives didn't fail because the technology was wrong. They failed because the people building the system and the people making decisions about it couldn't see the same thing. Engineers saw architecture. Designers saw interactions. Executives saw risk. Nobody had a shared map.",
    "So I built one. The AI Interaction Atlas is an open-source framework for mapping how AI systems actually behave — adopted by teams at companies designing AI at scale. AI Interaction Studio is the canvas tool that makes the framework operational.",
    'quietloudlab is the practice that puts these tools to work. Through facilitated workshops, system mapping, and tangible prototypes, I help teams make their AI systems visible enough to align on, govern, and build with confidence.',
    "I'm based in Dallas, Texas, moving to Amsterdam in late 2026.",
  ],
  markers: [
    ['Formerly', 'IBM Innovation Studio (10 years)'],
    ['Published', 'CHI 2023 — Human-AI Co-Creativity'],
    ['Framework', 'AI Interaction Atlas (open source)'],
    ['Product', 'AI Interaction Studio'],
    ['Education', 'Psychology & Human-Computer Interaction'],
    ['Practice', 'Near Future Laboratory (speculative design)'],
  ],
};

export const situations = {
  hangover: {
    heroTitle: ['You built the AI feature.', "Why isn't it working?"],
    intro: [
      "The engineering team shipped it. The product team can't explain it to stakeholders. Design was brought in late — or not at all. User adoption is flat. The system made sense to the people who built it, but nobody else can see it clearly enough to know what's wrong or what to do next.",
      "Meetings about the AI feature feel circular. Everyone is describing a different version of the same system, because the shared map doesn't exist yet.",
    ],
    rootCauseTitle: "This isn't a technology problem. It's a legibility problem.",
    rootCauseBody:
      "The system is invisible to the people who need to make decisions about it. Engineering sees architecture. Product sees features. Design sees interactions. Leadership sees risk. Each perspective is valid. None of them is the whole picture. Until the system is mapped — tasks, data flows, human touchpoints, constraints, embedded assumptions, all visible in one place — every conversation about what to fix or where to go next will be a conversation between people looking at different things.",
    offers: [
      {
        kicker: 'See',
        title: 'AI System Map',
        problem:
          "Your team is working on the same AI system but describing it differently. The architecture exists in code and in people's heads, but not in a shared artifact anyone can point at.",
        action:
          "Together, we'll map the full system — what the AI does, what data it depends on, where humans make decisions, and what constraints govern the behavior — into a visual, interactive artifact your whole team can see.",
        outcome:
          'A shared system map your team keeps. Not a diagram that gets filed away — a working reference that makes the invisible visible and gives every stakeholder a common surface to reason from.',
        timeline: 'Timeline: 2 – 3 weeks',
        engagements: [
          ['AI System Mapping', 'Define the layer beneath the interaction: data flows, model constraints, and system logic.'],
          ['Assumption Audit', 'Surface the implicit decisions embedded in the system that nobody has examined together.'],
          ['Stakeholder Alignment', 'Give every function — engineering, product, design, leadership — the same view of the same system.'],
        ],
        image: 'Studio canvas screenshot — a mapped system with visible task nodes, data attachments, and constraint indicators',
      },
      {
        kicker: 'Align',
        title: 'Business Framing & Initiative Workshop',
        problem:
          'Your team has ideas about what to do next, but no shared framework for deciding. Priorities conflict. Resources are limited. Every meeting restarts from scratch.',
        action:
          "We'll facilitate structured sessions that move your team from scattered ambitions to a prioritized plan — goals mapped to challenges, initiatives framed and scored, a roadmap built with owners and sequencing your team actually commits to.",
        outcome:
          'A prioritized roadmap with clear owners and a sequenced plan your team can execute against — not a strategy deck, but a decision record that holds people accountable.',
        timeline: 'Timeline: 2 – 4 days of sessions + preparation',
        engagements: [
          ['Business Framing Workshop', 'Map goals, challenges, and opportunities into a structured landscape the whole team reasons from.'],
          ['Initiative Prioritization', 'Score and rank potential initiatives on feasibility, impact, and risk — then commit.'],
          ['AI Opportunity Discovery', "Identify where AI is genuinely suited to solve problems and where it isn't."],
        ],
        image: 'Workshop photo — team working with sticky notes and large-format paper, mapping a business landscape',
      },
      {
        kicker: 'Build',
        title: 'AI Solution Design & Prototyping',
        problem:
          "You've decided what to build but need to design how it works before committing engineering time. What should the human-AI interaction look like? What are the risks? How do you prove the concept before the costly build?",
        action:
          "We'll design the full AI solution — why AI is the right approach, what the system should look like, how humans interact with it at every touchpoint, what the risks are, and how to mitigate them. Then we'll build tangible prototypes that test the concept with real people.",
        outcome:
          'A solution design with mapped interactions, identified risks, mitigation strategies, and a prioritized build plan — plus testable prototypes that validate the direction and secure stakeholder buy-in before full investment.',
        timeline: 'Timeline: 3 – 6 weeks',
        engagements: [
          ['AI Solution Design', 'Map the complete human-AI interaction, from system behavior to user experience to risk profile.'],
          ['Experiential Prototyping', 'Build interactive, testable simulations of the AI experience using real data and scenarios.'],
          ['Executive Show-and-Tell', 'Create high-impact visual artifacts designed to secure internal alignment and funding.'],
        ],
        image: 'Lore prototype mockup on phone — showing a real AI product concept in high fidelity',
      },
    ],
    cta:
      "The first step is usually a System Map — a 2–3 week engagement that makes the invisible visible. But we'll figure out the right starting point together.",
  },
  providers: {
    heroTitle: ['Your tech is better', 'than your story.'],
    intro:
      "Your team builds serious AI — custom pipelines, agent architectures, fine-tuned models. But every enterprise sales conversation turns into a technical deep-dive that loses the business buyer by slide three. You know the technology is stronger than the competitor's. You're still losing deals to companies with simpler products and clearer stories. The problem isn't what you build. It's that the people writing the checks can't see what it does for them.",
    rootCauseTitle: "Enterprise buyers don't buy architecture. They buy outcomes.",
    rootCauseBody:
      'When your homepage leads with "RAG pipelines" and "vector databases" instead of "we cut your support costs by 40%," you are asking the buyer to do the translation work. Most will not. They will go with the competitor who showed them what the outcome looks like, even if the underlying tech is worse. The same gap shows up in client delivery, where engineers are presenting architecture diagrams to rooms full of people who need to see business impact.',
  },
  readiness: {
    heroTitle: ['You said yes to AI.', 'Now you need a plan.'],
    intro:
      'Leadership committed — to a board, a funder, constituents, or the public. AI is officially a priority. But nobody internally can explain what that means in practice. Your IT director is researching chatbot vendors. Your operations team is worried about being replaced. Your compliance officer is asking about liability. And the person who made the commitment needs something concrete to show progress within twelve months.',
    rootCauseTitle: "The gap isn't technology. It's translation.",
    rootCauseBody:
      "Your organization doesn't need an AI product built — at least not yet. You need someone who can walk into a room of non-technical stakeholders, make AI understandable, identify where it genuinely fits your operations, and give you a responsible path forward that you can defend to oversight bodies. The plan needs to be concrete enough to show a board, phased enough to be approachable, and governed enough to manage risk.",
  },
};
