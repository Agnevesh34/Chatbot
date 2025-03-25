// backend/mbtiSeeder.js
require('dotenv').config();
const mongoose = require('mongoose');
const MBTI = require('./models/mbtiModel');

const personalities = [
  {
    type: "INTJ",
    category: "Analysts",
    name: "Architect",
    traits: ["Introverted", "Intuitive", "Thinking", "Judging"],
    description: "INTJ (Architect) is a personality type with the Introverted, Intuitive, Thinking, and Judging traits. These thoughtful tacticians love perfecting life's details through creativity and rationality. They possess a strategic mindset, value intellectual competence, and strive for constant self-improvement. Their independent nature and high standards can sometimes make them seem critical or socially insensitive.",
    famousExamples: ["Elon Musk", "Michelle Obama", "Blaise Pascal"],
    strengths: ["Strategic thinkers", "Independent", "Highly logical", "Driven to improve"],
    weaknesses: ["Overly critical", "Socially insensitive", "Perfectionistic", "Dismiss emotions"]
  },
  {
    type: "INTP",
    category: "Analysts",
    name: "Logician",
    traits: ["Introverted", "Intuitive", "Thinking", "Prospecting"],
    description: "INTP (Logician) is a personality type with the Introverted, Intuitive, Thinking, and Prospecting traits. These innovative thinkers excel at analyzing complex theories and spotting inconsistencies. They value intellectual exploration above all else, often getting lost in abstract thought. Their relentless curiosity can sometimes lead to analysis paralysis.",
    famousExamples: ["Albert Einstein", "Marie Curie", "Rene Descartes"],
    strengths: ["Analytical", "Creative problem-solvers", "Open-minded", "Theoretical thinkers"],
    weaknesses: ["Socially awkward", "Overly skeptical", "Procrastinate", "Emotionally detached"]
  },
  {
    type: "ENTJ",
    category: "Analysts",
    name: "Commander",
    traits: ["Extraverted", "Intuitive", "Thinking", "Judging"],
    description: "ENTJ (Commander) is a personality type with the Extraverted, Intuitive, Thinking, and Judging traits. Natural-born leaders who excel at organizing people and resources. They combine charisma with logical analysis to achieve ambitious goals. Their drive for efficiency can sometimes come across as domineering or impatient.",
    famousExamples: ["Steve Jobs", "Margaret Thatcher", "Gordon Ramsay"],
    strengths: ["Decisive", "Strategic planners", "Charismatic", "High achievers"],
    weaknesses: ["Domineering", "Impatient", "Overly critical", "Workaholic tendencies"]
  },
  {
    type: "ENTP",
    category: "Analysts",
    name: "Debater",
    traits: ["Extraverted", "Intuitive", "Thinking", "Prospecting"],
    description: "ENTP (Debater) is a personality type with the Extraverted, Intuitive, Thinking, and Prospecting traits. Quick-witted innovators who love intellectual challenges and exploring possibilities. They excel at seeing multiple perspectives but may struggle with follow-through. Their love of debate can sometimes lead to unnecessary conflict.",
    famousExamples: ["Thomas Edison", "Mark Twain", "Voltaire"],
    strengths: ["Creative", "Quick thinkers", "Charismatic", "Excellent brainstormers"],
    weaknesses: ["Argumentative", "Easily bored", "Insensitive", "Poor follow-through"]
  },
  // Diplomats
  {
    type: "INFJ",
    category: "Diplomats",
    name: "Advocate",
    traits: ["Introverted", "Intuitive", "Feeling", "Judging"],
    description: "INFJ (Advocate) is a personality type with the Introverted, Intuitive, Feeling, and Judging traits. Idealistic yet practical, they strive to make a positive impact through quiet determination. They possess deep emotional insight but need to guard against burnout.",
    famousExamples: ["Nelson Mandela", "Mother Teresa", "Carl Jung"],
    strengths: ["Compassionate", "Insightful", "Determined", "Creative"],
    weaknesses: ["Overly sensitive", "Perfectionistic", "Prone to burnout", "Secretive"]
  },
  {
    type: "INFP",
    category: "Diplomats",
    name: "Mediator",
    traits: ["Introverted", "Intuitive", "Feeling", "Prospecting"],
    description: "INFP (Mediator) is a personality type with the Introverted, Intuitive, Feeling, and Prospecting traits. Creative idealists who value authenticity and meaningful connections. They seek harmony but need to balance their inner world with practical reality.",
    famousExamples: ["J.R.R. Tolkien", "William Shakespeare", "Princess Diana"],
    strengths: ["Empathetic", "Creative", "Idealistic", "Flexible"],
    weaknesses: ["Overly idealistic", "Self-critical", "Unrealistic", "Conflict-averse"]
  },
  {
    type: "ENFJ",
    category: "Diplomats",
    name: "Protagonist",
    traits: ["Extraverted", "Intuitive", "Feeling", "Judging"],
    description: "ENFJ (Protagonist) is a personality type with the Extraverted, Intuitive, Feeling, and Judging traits. Natural mentors who inspire growth in others. They combine emotional intelligence with strong leadership skills but may neglect their own needs.",
    famousExamples: ["Oprah Winfrey", "Martin Luther King Jr.", "Maya Angelou"],
    strengths: ["Charismatic", "Supportive", "Natural leaders", "Socially conscious"],
    weaknesses: ["Overly idealistic", "Manipulative tendencies", "Overextend themselves", "Approval-seeking"]
  },
  {
    type: "ENFP",
    category: "Diplomats",
    name: "Campaigner",
    traits: ["Extraverted", "Intuitive", "Feeling", "Prospecting"],
    description: "ENFP (Campaigner) is a personality type with the Extraverted, Intuitive, Feeling, and Prospecting traits. Enthusiastic innovators who see potential everywhere. They thrive on new experiences but need to focus their abundant energy.",
    famousExamples: ["Robin Williams", "Walt Disney", "Ellen DeGeneres"],
    strengths: ["Enthusiastic", "Creative", "Perceptive", "Excellent communicators"],
    weaknesses: ["Easily distracted", "Overthinkers", "Emotionally intense", "Disorganized"]
  },
  // Sentinels
  {
    type: "ISTJ",
    category: "Sentinels",
    name: "Logistician",
    traits: ["Introverted", "Observant", "Thinking", "Judging"],
    description: "ISTJ (Logistician) is a personality type with the Introverted, Observant, Thinking, and Judging traits. Practical organizers who value responsibility and tradition. They excel at creating order but may resist necessary changes.",
    famousExamples: ["Queen Elizabeth II", "Warren Buffett", "Serena Williams"],
    strengths: ["Reliable", "Detail-oriented", "Hardworking", "Practical"],
    weaknesses: ["Inflexible", "Overly traditional", "Judgmental", "Repress emotions"]
  },
  {
    type: "ISFJ",
    category: "Sentinels",
    name: "Defender",
    traits: ["Introverted", "Observant", "Feeling", "Judging"],
    description: "ISFJ (Defender) is a personality type with the Introverted, Observant, Feeling, and Judging traits. Protective nurturers who show care through practical support. They need to balance helping others with self-care.",
    famousExamples: ["Rosa Parks", "Kate Middleton", "Dr. Watson (Sherlock)"],
    strengths: ["Supportive", "Responsible", "Observant", "Loyal"],
    weaknesses: ["Overload themselves", "Resist change", "Self-sacrificing", "Hold grudges"]
  },
  {
    type: "ESTJ",
    category: "Sentinels",
    name: "Executive",
    traits: ["Extraverted", "Observant", "Thinking", "Judging"],
    description: "ESTJ (Executive) is a personality type with the Extraverted, Observant, Thinking, and Judging traits. Natural administrators who excel at implementing systems. They value efficiency but need to cultivate flexibility.",
    famousExamples: ["Judge Judy", "Franklin D. Roosevelt", "Lyndon B. Johnson"],
    strengths: ["Organized", "Decisive", "Honest", "Dedicated"],
    weaknesses: ["Inflexible", "Bossy", "Insensitive", "Workaholic"]
  },
  {
    type: "ESFJ",
    category: "Sentinels",
    name: "Consul",
    traits: ["Extraverted", "Observant", "Feeling", "Judging"],
    description: "ESFJ (Consul) is a personality type with the Extraverted, Observant, Feeling, and Judging traits. Social organizers who maintain harmony through tradition. They need to balance social expectations with personal needs.",
    famousExamples: ["Taylor Swift", "Bill Clinton", "Jennifer Garner"],
    strengths: ["Socially skilled", "Responsible", "Loyal", "Practical helpers"],
    weaknesses: ["Overly conventional", "Needy", "Conflict-averse", "Judgmental"]
  },
  // Explorers
  {
    type: "ISTP",
    category: "Explorers",
    name: "Virtuoso",
    traits: ["Introverted", "Observant", "Thinking", "Prospecting"],
    description: "ISTP (Virtuoso) is a personality type with the Introverted, Observant, Thinking, and Prospecting traits. Mechanical problem-solvers who thrive on hands-on challenges. They value independence but may seem detached.",
    famousExamples: ["Clint Eastwood", "Bear Grylls", "Steve Jobs"],
    strengths: ["Practical", "Adaptable", "Curious", "Excellent in crises"],
    weaknesses: ["Emotionally distant", "Risk-seeking", "Non-committal", "Insensitive"]
  },
  {
    type: "ISFP",
    category: "Explorers",
    name: "Adventurer",
    traits: ["Introverted", "Observant", "Feeling", "Prospecting"],
    description: "ISFP (Adventurer) is a personality type with the Introverted, Observant, Feeling, and Prospecting traits. Sensitive artists who experience life through their senses. They need to balance spontaneity with responsibility.",
    famousExamples: ["Michael Jackson", "Frida Kahlo", "Lionel Messi"],
    strengths: ["Artistic", "Gentle", "Observant", "Live authentically"],
    weaknesses: ["Overly sensitive", "Avoid planning", "Self-doubting", "Conflict-averse"]
  },
  {
    type: "ESTP",
    category: "Explorers",
    name: "Entrepreneur",
    traits: ["Extraverted", "Observant", "Thinking", "Prospecting"],
    description: "ESTP (Entrepreneur) is a personality type with the Extraverted, Observant, Thinking, and Prospecting traits. Energetic risk-takers who thrive in dynamic environments. They excel in the moment but may neglect long-term planning.",
    famousExamples: ["Madonna", "Ernest Hemingway", "Donald Trump"],
    strengths: ["Quick thinkers", "Persuasive", "Resourceful", "Observant"],
    weaknesses: ["Impulsive", "Insensitive", "Bored easily", "Short-sighted"]
  },
  {
    type: "ESFP",
    category: "Explorers",
    name: "Entertainer",
    traits: ["Extraverted", "Observant", "Feeling", "Prospecting"],
    description: "ESFP (Entertainer) is a personality type with the Extraverted, Observant, Feeling, and Prospecting traits. Spontaneous enthusiasts who bring energy to social situations. They need to balance fun-seeking with practical responsibilities.",
    famousExamples: ["Elton John", "Marilyn Monroe", "Jamie Oliver"],
    strengths: ["Enthusiastic", "Observant", "Practical", "Social connectors"],
    weaknesses: ["Poor planners", "Overly dramatic", "Seek validation", "Avoid conflict"]
  }
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    await MBTI.deleteMany();
    console.log('Cleared existing MBTI data');
    await MBTI.insertMany(personalities);
    console.log('Successfully seeded MBTI data');
    mongoose.connection.close();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedDB();
