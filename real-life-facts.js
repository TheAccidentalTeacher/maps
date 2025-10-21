// Real Life Learning Facts - Rotating carousel for login screen
// Expandable for ALL subjects: Geography, Math, Science, English, Grammar, History, etc.
// Gen Alpha approved - no cap! 🔥

const realLifeFacts = {
  geography: [
    {
      emoji: "📍",
      subject: "Geography",
      fact: "Your TikTok FYP uses your GPS location to show you local creators and trending spots near you",
      skill: "Understanding how location data shapes your digital experience"
    },
    {
      emoji: "🗺️",
      subject: "Geography", 
      fact: "Google Maps uses real-time traffic data from millions of phones to route you around slowdowns",
      skill: "Movement and human-environment interaction in action"
    },
    {
      emoji: "🌍",
      subject: "Geography",
      fact: "When you video chat friends in different time zones, you're experiencing Earth's rotation",
      skill: "Understanding time zones and global connections"
    },
    {
      emoji: "🏔️",
      subject: "Geography",
      fact: "Your weather app predicts snow days by tracking Arctic air masses moving south",
      skill: "How climate and location affect your daily life"
    },
    {
      emoji: "🌊",
      subject: "Geography",
      fact: "The seafood in your school lunch traveled through global shipping routes you can track",
      skill: "Trade, movement, and economic geography"
    }
  ],
  
  math: [
    {
      emoji: "🎮",
      subject: "Math",
      fact: "Your K/D ratio in Fortnite = kills ÷ deaths, which is literally just division",
      skill: "Ratios and division in competitive gaming"
    },
    {
      emoji: "💰",
      subject: "Math",
      fact: "When you buy Robux, you're calculating exchange rates (dollars to digital currency)",
      skill: "Currency conversion and percentages"
    },
    {
      emoji: "📊",
      subject: "Math",
      fact: "TikTok's algorithm ranks videos using complex probability calculations",
      skill: "Statistics and data analysis powering your FYP"
    },
    {
      emoji: "⏱️",
      subject: "Math",
      fact: "Speedrunning Minecraft = calculating optimal paths, which is geometry + time",
      skill: "Spatial reasoning and efficiency optimization"
    },
    {
      emoji: "🎯",
      subject: "Math",
      fact: "Your Spotify Wrapped percentages = your listening time divided by total users",
      skill: "Percentages and comparative statistics"
    }
  ],
  
  science: [
    {
      emoji: "🔋",
      subject: "Science",
      fact: "Your phone battery dies faster in the cold because chemical reactions slow down",
      skill: "Chemistry affecting everyday technology"
    },
    {
      emoji: "🎧",
      subject: "Science",
      fact: "Noise-canceling headphones use physics to create opposite sound waves that cancel out noise",
      skill: "Wave interference and sound physics"
    },
    {
      emoji: "🌈",
      subject: "Science",
      fact: "Your phone screen uses RGB (red, green, blue) light mixing to create millions of colors",
      skill: "Light physics and color theory"
    },
    {
      emoji: "⚡",
      subject: "Science",
      fact: "Static electricity from your blanket in winter = electrons jumping between materials",
      skill: "Electrical charge transfer"
    },
    {
      emoji: "🧬",
      subject: "Science",
      fact: "Face ID on your iPhone uses infrared light to map 30,000 dots on your face",
      skill: "Biometric technology and light waves"
    }
  ],
  
  english: [
    {
      emoji: "📖",
      subject: "English",
      fact: "Reading Discord convos faster than texts = your brain improving comprehension speed",
      skill: "Reading fluency and context clues"
    },
    {
      emoji: "✍️",
      subject: "English",
      fact: "Writing better YouTube comments teaches you how to persuade and argue your point",
      skill: "Persuasive writing and audience awareness"
    },
    {
      emoji: "🎬",
      subject: "English",
      fact: "Spotting foreshadowing in movies = the same skill as analyzing books in class",
      skill: "Literary analysis and narrative structure"
    },
    {
      emoji: "📱",
      subject: "English",
      fact: "Texting with proper punctuation changes your tone - no period = casual, period = serious",
      skill: "Tone and audience in digital communication"
    },
    {
      emoji: "🗣️",
      subject: "English",
      fact: "Creating new slang with friends = you're literally inventing language evolution",
      skill: "Etymology and linguistic creativity"
    }
  ],
  
  grammar: [
    {
      emoji: "🤖",
      subject: "Grammar",
      fact: "Autocorrect fixing 'your' to 'you're' = AI using grammar rules to predict meaning",
      skill: "Possessive vs. contraction rules"
    },
    {
      emoji: "💬",
      subject: "Grammar",
      fact: "Knowing when to use 'their/there/they're' in texts makes you look way smarter",
      skill: "Homophones and clarity in writing"
    },
    {
      emoji: "📝",
      subject: "Grammar",
      fact: "Using commas wrong in Discord can completely change your message's meaning",
      skill: "Punctuation affecting comprehension"
    },
    {
      emoji: "🎮",
      subject: "Grammar",
      fact: "Game chat filters block messages with bad grammar to prevent misunderstandings",
      skill: "Clarity and proper sentence structure"
    },
    {
      emoji: "✨",
      subject: "Grammar",
      fact: "Grammarly scores your writing like a video game - higher score = better grammar",
      skill: "Self-editing and error recognition"
    }
  ],
  
  history: [
    {
      emoji: "📜",
      subject: "History",
      fact: "Memes today spread the same way political cartoons did in the 1700s - viral ideas",
      skill: "Historical patterns in communication"
    },
    {
      emoji: "🎮",
      subject: "History",
      fact: "Minecraft's village trading system = how ancient civilizations did barter economies",
      skill: "Economic systems through history"
    },
    {
      emoji: "🏛️",
      subject: "History",
      fact: "Your school's student council = a mini version of ancient Greek democracy",
      skill: "Government structures and civic participation"
    },
    {
      emoji: "📱",
      subject: "History",
      fact: "Social media influencers = modern version of town criers spreading news",
      skill: "Evolution of information distribution"
    },
    {
      emoji: "🗳️",
      subject: "History",
      fact: "Voting for class president teaches you the same voting rights people fought for in history",
      skill: "Democratic processes and civic rights"
    }
  ]
};

// Get a random fact from a specific subject or from all subjects
function getRandomRealLifeFact(subject = null) {
  if (subject && realLifeFacts[subject]) {
    const facts = realLifeFacts[subject];
    return facts[Math.floor(Math.random() * facts.length)];
  } else {
    // Get random fact from any subject
    const allSubjects = Object.keys(realLifeFacts);
    const randomSubject = allSubjects[Math.floor(Math.random() * allSubjects.length)];
    const facts = realLifeFacts[randomSubject];
    return facts[Math.floor(Math.random() * facts.length)];
  }
}

// Get rotating carousel of facts (one from each subject)
function getFactCarousel() {
  const carousel = [];
  for (const subject in realLifeFacts) {
    const facts = realLifeFacts[subject];
    carousel.push(facts[Math.floor(Math.random() * facts.length)]);
  }
  return carousel;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { realLifeFacts, getRandomRealLifeFact, getFactCarousel };
}
