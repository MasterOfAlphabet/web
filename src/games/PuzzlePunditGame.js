import React, { useState, useEffect } from "react";
import {
  Clock,
  Trophy,
  Target,
  BookOpen,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Star,
  Award,
  Zap,
  Plus,
  Play,
  Pause,
  Home,
  RotateCcw,
} from "lucide-react";

const PuzzlePunditGame = () => {
  const [gameState, setGameState] = useState("menu"); // menu, playing, results
  const [selectedClass, setSelectedClass] = useState("");
  const [numQuestions, setNumQuestions] = useState(10);
  const [gameMode, setGameMode] = useState("practice");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedbackTimer, setFeedbackTimer] = useState(null);

  // Question banks - will be populated with actual data later
  const questionBanks = {
    "I-II": [
      // Original 25
      {
        emojis: "⭐🐟",
        answer: "Starfish",
        options: ["Starfish", "Sea Star", "Ocean Fish", "Star Ocean"],
      },
      {
        emojis: "🌧️🌈",
        answer: "Rainbow",
        options: ["Rainbow", "Rain Cloud", "Weather", "Colorful Sky"],
      },
      {
        emojis: "🐝🍯",
        answer: "Beehive",
        options: ["Beehive", "Honey Jar", "Bee House", "Sweet Home"],
      },
      {
        emojis: "🐦🏠",
        answer: "Birdhouse",
        options: ["Birdhouse", "Bird Home", "Nest Box", "Flying House"],
      },
      {
        emojis: "🍎🍰",
        answer: "Apple Pie",
        options: ["Apple Pie", "Fruit Cake", "Sweet Apple", "Baked Goods"],
      },
      {
        emojis: "🐇🥕",
        answer: "Rabbit with Carrot",
        options: [
          "Rabbit with Carrot",
          "Bunny Food",
          "Pet Rabbit",
          "Garden Friend",
        ],
      },
      {
        emojis: "🦁👑",
        answer: "Lion King",
        options: ["Lion King", "Royal Lion", "King Animal", "Crown Lion"],
      },
      {
        emojis: "🐢🏁",
        answer: "Tortoise Race",
        options: [
          "Tortoise Race",
          "Slow Winner",
          "Racing Turtle",
          "Finish Line",
        ],
      },
      {
        emojis: "🐘🚿",
        answer: "Elephant Shower",
        options: [
          "Elephant Shower",
          "Bath Time",
          "Water Play",
          "Clean Elephant",
        ],
      },
      {
        emojis: "🐱👓",
        answer: "Cat with Glasses",
        options: ["Cat with Glasses", "Smart Cat", "Reading Cat", "Clever Pet"],
      },
      {
        emojis: "🦋🌸",
        answer: "Butterfly on Flower",
        options: [
          "Butterfly on Flower",
          "Garden Beauty",
          "Spring Scene",
          "Nature Art",
        ],
      },
      {
        emojis: "🐶🦴",
        answer: "Dog with Bone",
        options: ["Dog with Bone", "Happy Puppy", "Pet Treat", "Doggy Dinner"],
      },
      {
        emojis: "🐧❄️",
        answer: "Penguin in Snow",
        options: [
          "Penguin in Snow",
          "Cold Bird",
          "Winter Animal",
          "Ice Friend",
        ],
      },
      {
        emojis: "🐠🌊",
        answer: "Fish in Water",
        options: [
          "Fish in Water",
          "Ocean Life",
          "Swimming Fish",
          "Sea Creature",
        ],
      },
      {
        emojis: "🦆🪺",
        answer: "Duck in Nest",
        options: ["Duck in Nest", "Mother Duck", "Bird Home", "Cozy Duck"],
      },
      {
        emojis: "🐻🍯",
        answer: "Bear with Honey",
        options: [
          "Bear with Honey",
          "Sweet Bear",
          "Honey Lover",
          "Forest Friend",
        ],
      },
      {
        emojis: "🐸🌵",
        answer: "Frog in Desert",
        options: ["Frog in Desert", "Hot Frog", "Desert Life", "Unusual Place"],
      },
      {
        emojis: "🦉🌙",
        answer: "Owl at Night",
        options: ["Owl at Night", "Night Bird", "Moon Watcher", "Wise Owl"],
      },
      {
        emojis: "🐴🎩",
        answer: "Horse with Hat",
        options: [
          "Horse with Hat",
          "Fancy Horse",
          "Dressed Up",
          "Party Animal",
        ],
      },
      {
        emojis: "🐒🍌",
        answer: "Monkey with Banana",
        options: [
          "Monkey with Banana",
          "Happy Monkey",
          "Jungle Snack",
          "Climbing Fun",
        ],
      },
      {
        emojis: "🐦🎶",
        answer: "Singing Bird",
        options: ["Singing Bird", "Musical Bird", "Happy Song", "Bird Concert"],
      },
      {
        emojis: "🐑🌙",
        answer: "Sheep at Night",
        options: [
          "Sheep at Night",
          "Sleepy Sheep",
          "Counting Sheep",
          "Bedtime",
        ],
      },
      {
        emojis: "🐓⏰",
        answer: "Rooster Alarm",
        options: [
          "Rooster Alarm",
          "Morning Call",
          "Wake Up Bird",
          "Farm Clock",
        ],
      },
      {
        emojis: "🐿️🌰",
        answer: "Squirrel with Nut",
        options: [
          "Squirrel with Nut",
          "Nutty Friend",
          "Tree Snack",
          "Busy Squirrel",
        ],
      },
      {
        emojis: "🐬🏀",
        answer: "Dolphin with Ball",
        options: [
          "Dolphin with Ball",
          "Playing Dolphin",
          "Ocean Game",
          "Smart Fish",
        ],
      },

      // Additional 25 new questions
      {
        emojis: "🐭🧀",
        answer: "Mouse with Cheese",
        options: [
          "Mouse with Cheese",
          "Hungry Mouse",
          "Kitchen Friend",
          "Small Snack",
        ],
      },
      {
        emojis: "🐙🌊",
        answer: "Octopus in Ocean",
        options: [
          "Octopus in Ocean",
          "Sea Monster",
          "Eight Arms",
          "Deep Water",
        ],
      },
      {
        emojis: "🦀🏖️",
        answer: "Crab on Beach",
        options: ["Crab on Beach", "Sand Walker", "Shore Friend", "Beach Life"],
      },
      {
        emojis: "🐢🥬",
        answer: "Turtle Eating",
        options: ["Turtle Eating", "Green Meal", "Slow Dinner", "Healthy Food"],
      },
      {
        emojis: "🦘🏃",
        answer: "Jumping Kangaroo",
        options: [
          "Jumping Kangaroo",
          "Hopping High",
          "Fast Runner",
          "Bouncy Animal",
        ],
      },
      {
        emojis: "🐨🌿",
        answer: "Koala with Leaves",
        options: [
          "Koala with Leaves",
          "Tree Hugger",
          "Sleepy Bear",
          "Green Lunch",
        ],
      },
      {
        emojis: "🦭🐟",
        answer: "Seal with Fish",
        options: [
          "Seal with Fish",
          "Ocean Meal",
          "Swimming Dinner",
          "Happy Seal",
        ],
      },
      {
        emojis: "🐳💧",
        answer: "Whale Splash",
        options: ["Whale Splash", "Big Fish", "Ocean Giant", "Water Spout"],
      },
      {
        emojis: "🦆🍞",
        answer: "Duck with Bread",
        options: [
          "Duck with Bread",
          "Pond Feeding",
          "Happy Duck",
          "Water Bird",
        ],
      },
      {
        emojis: "🐝🌻",
        answer: "Bee on Sunflower",
        options: [
          "Bee on Sunflower",
          "Busy Bee",
          "Yellow Flower",
          "Garden Worker",
        ],
      },
      {
        emojis: "🐛🍃",
        answer: "Bug on Leaf",
        options: ["Bug on Leaf", "Tiny Friend", "Green Home", "Small Crawler"],
      },
      {
        emojis: "🕷️🕸️",
        answer: "Spider Web",
        options: ["Spider Web", "Sticky Trap", "Web Maker", "Eight Legs"],
      },
      {
        emojis: "🐞🌺",
        answer: "Ladybug on Flower",
        options: ["Ladybug on Flower", "Red Dot", "Lucky Bug", "Pretty Spot"],
      },
      {
        emojis: "🦋🌷",
        answer: "Butterfly Garden",
        options: [
          "Butterfly Garden",
          "Flying Colors",
          "Pretty Wings",
          "Flower Friend",
        ],
      },
      {
        emojis: "🐻‍❄️⛄",
        answer: "Polar Bear Snowman",
        options: [
          "Polar Bear Snowman",
          "Winter Fun",
          "Snow Friend",
          "Cold Play",
        ],
      },
      {
        emojis: "🐿️🌰",
        answer: "Squirrel Collecting",
        options: [
          "Squirrel Collecting",
          "Winter Prep",
          "Nutty Storage",
          "Busy Tail",
        ],
      },
      {
        emojis: "🦔🍄",
        answer: "Hedgehog Mushroom",
        options: [
          "Hedgehog Mushroom",
          "Forest Find",
          "Spiky Friend",
          "Woodland Snack",
        ],
      },
      {
        emojis: "🐰🥕",
        answer: "Bunny Carrot",
        options: [
          "Bunny Carrot",
          "Orange Treat",
          "Hopping Meal",
          "Garden Raid",
        ],
      },
      {
        emojis: "🐹🏠",
        answer: "Hamster House",
        options: ["Hamster House", "Pet Home", "Tiny House", "Cozy Den"],
      },
      {
        emojis: "🐦🌅",
        answer: "Bird Sunrise",
        options: ["Bird Sunrise", "Morning Song", "Early Bird", "Dawn Chorus"],
      },
      {
        emojis: "🐴🌾",
        answer: "Horse in Field",
        options: ["Horse in Field", "Grass Eater", "Farm Life", "Open Meadow"],
      },
      {
        emojis: "🐄🥛",
        answer: "Cow Milk",
        options: ["Cow Milk", "Farm Fresh", "White Drink", "Moo Juice"],
      },
      {
        emojis: "🐷🌽",
        answer: "Pig Corn",
        options: ["Pig Corn", "Farm Snack", "Yellow Treat", "Happy Pig"],
      },
      {
        emojis: "🐔🥚",
        answer: "Chicken Egg",
        options: ["Chicken Egg", "Fresh Egg", "Farm Product", "White Shell"],
      },
      {
        emojis: "🦆🌊",
        answer: "Duck Swimming",
        options: ["Duck Swimming", "Water Bird", "Pond Life", "Splashing Fun"],
      },
    ],

    "III-V": [
      // Original 25
      {
        emojis: "🦄🌈",
        answer: "Unicorn Rainbow",
        options: [
          "Unicorn Rainbow",
          "Magic Horse",
          "Colorful Dream",
          "Fantasy World",
        ],
      },
      {
        emojis: "🏰🐉",
        answer: "Castle Dragon",
        options: [
          "Castle Dragon",
          "Medieval Tale",
          "Knight Story",
          "Fire Breathing",
        ],
      },
      {
        emojis: "🦕🌳",
        answer: "Dinosaur Forest",
        options: [
          "Dinosaur Forest",
          "Prehistoric Life",
          "Ancient Trees",
          "Extinct Giants",
        ],
      },
      {
        emojis: "🧙‍♂️🪄",
        answer: "Wizard Magic",
        options: [
          "Wizard Magic",
          "Spell Caster",
          "Magic Wand",
          "Fantasy Power",
        ],
      },
      {
        emojis: "🏝️🌴",
        answer: "Island Paradise",
        options: [
          "Island Paradise",
          "Tropical Island",
          "Palm Beach",
          "Ocean Getaway",
        ],
      },
      {
        emojis: "🦜🦚",
        answer: "Exotic Birds",
        options: [
          "Exotic Birds",
          "Colorful Feathers",
          "Tropical Pets",
          "Beautiful Wings",
        ],
      },
      {
        emojis: "🏊‍♂️🏆",
        answer: "Swimming Champion",
        options: [
          "Swimming Champion",
          "Water Winner",
          "Pool Hero",
          "Olympic Gold",
        ],
      },
      {
        emojis: "🦓🚦",
        answer: "Zebra Crossing",
        options: [
          "Zebra Crossing",
          "Striped Road",
          "Traffic Safety",
          "Street Lines",
        ],
      },
      {
        emojis: "🧁🎂",
        answer: "Sweet Treats",
        options: ["Sweet Treats", "Birthday Party", "Cake Time", "Sugar Rush"],
      },
      {
        emojis: "🏕️🔥",
        answer: "Camping Fire",
        options: [
          "Camping Fire",
          "Outdoor Adventure",
          "Tent Life",
          "Wilderness Fun",
        ],
      },
      {
        emojis: "🦉📚",
        answer: "Wise Owl",
        options: ["Wise Owl", "Study Time", "Book Learning", "Night Scholar"],
      },
      {
        emojis: "🏎️🏁",
        answer: "Race Victory",
        options: ["Race Victory", "Speed Winner", "Fast Car", "Checkered Flag"],
      },
      {
        emojis: "🦀🏖️",
        answer: "Beach Crab",
        options: ["Beach Crab", "Sand Walker", "Shore Life", "Ocean Friend"],
      },
      {
        emojis: "🏹🎯",
        answer: "Target Practice",
        options: [
          "Target Practice",
          "Bow Arrow",
          "Perfect Aim",
          "Bullseye Hit",
        ],
      },
      {
        emojis: "🦔🍎",
        answer: "Hedgehog Apple",
        options: [
          "Hedgehog Apple",
          "Spiny Snack",
          "Forest Fruit",
          "Autumn Treat",
        ],
      },
      {
        emojis: "🏄‍♂️🌊",
        answer: "Surfing Waves",
        options: ["Surfing Waves", "Ocean Rider", "Wave Master", "Beach Sport"],
      },
      {
        emojis: "🦦🐟",
        answer: "Otter Fishing",
        options: [
          "Otter Fishing",
          "River Hunter",
          "Playful Catch",
          "Water Mammal",
        ],
      },
      {
        emojis: "🏆🎉",
        answer: "Victory Celebration",
        options: [
          "Victory Celebration",
          "Winner Party",
          "Trophy Time",
          "Success Story",
        ],
      },
      {
        emojis: "🦚🌺",
        answer: "Peacock Beauty",
        options: [
          "Peacock Beauty",
          "Colorful Display",
          "Fancy Feathers",
          "Nature Art",
        ],
      },
      {
        emojis: "🧊🥤",
        answer: "Cold Drink",
        options: ["Cold Drink", "Ice Cube", "Refreshing Sip", "Cool Down"],
      },
      {
        emojis: "🦒🌲",
        answer: "Giraffe Jungle",
        options: ["Giraffe Jungle", "Tall Trees", "Long Neck", "Safari Life"],
      },
      {
        emojis: "🏓🏅",
        answer: "Table Tennis Medal",
        options: [
          "Table Tennis Medal",
          "Ping Pong Pro",
          "Sport Victory",
          "Quick Game",
        ],
      },
      {
        emojis: "🦢💧",
        answer: "Swan Lake",
        options: [
          "Swan Lake",
          "Graceful Bird",
          "White Beauty",
          "Peaceful Water",
        ],
      },
      {
        emojis: "🧸🎁",
        answer: "Teddy Gift",
        options: [
          "Teddy Gift",
          "Birthday Present",
          "Cute Bear",
          "Wrapped Surprise",
        ],
      },
      {
        emojis: "🦋🖌️",
        answer: "Butterfly Art",
        options: [
          "Butterfly Art",
          "Nature Painting",
          "Colorful Canvas",
          "Wing Design",
        ],
      },

      // Additional 25 new questions
      {
        emojis: "🚁🏔️",
        answer: "Mountain Rescue",
        options: [
          "Mountain Rescue",
          "High Flight",
          "Peak Landing",
          "Emergency Help",
        ],
      },
      {
        emojis: "🎪🐘",
        answer: "Circus Elephant",
        options: [
          "Circus Elephant",
          "Big Top Show",
          "Entertainment Act",
          "Performing Giant",
        ],
      },
      {
        emojis: "🏺⚱️",
        answer: "Ancient Artifacts",
        options: [
          "Ancient Artifacts",
          "Museum Pieces",
          "Historical Items",
          "Old Treasures",
        ],
      },
      {
        emojis: "🎭🎨",
        answer: "Arts Theater",
        options: [
          "Arts Theater",
          "Drama Class",
          "Creative Expression",
          "Stage Performance",
        ],
      },
      {
        emojis: "🔭⭐",
        answer: "Star Gazing",
        options: [
          "Star Gazing",
          "Night Sky",
          "Telescope View",
          "Astronomy Fun",
        ],
      },
      {
        emojis: "🎸🎵",
        answer: "Music Making",
        options: [
          "Music Making",
          "Guitar Song",
          "Band Practice",
          "Musical Notes",
        ],
      },
      {
        emojis: "🏰👸",
        answer: "Princess Castle",
        options: [
          "Princess Castle",
          "Royal Home",
          "Fairy Tale",
          "Kingdom Life",
        ],
      },
      {
        emojis: "🎯🏹",
        answer: "Archery Sport",
        options: [
          "Archery Sport",
          "Bow Skills",
          "Target Shooting",
          "Precision Game",
        ],
      },
      {
        emojis: "🦈🌊",
        answer: "Shark Ocean",
        options: [
          "Shark Ocean",
          "Deep Sea",
          "Marine Predator",
          "Underwater Danger",
        ],
      },
      {
        emojis: "🎨🖼️",
        answer: "Art Gallery",
        options: [
          "Art Gallery",
          "Picture Frame",
          "Creative Display",
          "Museum Visit",
        ],
      },
      {
        emojis: "🏃‍♂️🏅",
        answer: "Running Medal",
        options: [
          "Running Medal",
          "Marathon Win",
          "Speed Champion",
          "Track Victory",
        ],
      },
      {
        emojis: "🎪🤡",
        answer: "Circus Clown",
        options: [
          "Circus Clown",
          "Funny Face",
          "Entertainment Show",
          "Colorful Character",
        ],
      },
      {
        emojis: "🚂🚃",
        answer: "Train Journey",
        options: [
          "Train Journey",
          "Railway Travel",
          "Steam Engine",
          "Track Adventure",
        ],
      },
      {
        emojis: "🏖️⛱️",
        answer: "Beach Vacation",
        options: [
          "Beach Vacation",
          "Sunny Day",
          "Sand Castle",
          "Ocean Holiday",
        ],
      },
      {
        emojis: "🎢🎡",
        answer: "Amusement Park",
        options: [
          "Amusement Park",
          "Fun Rides",
          "Thrilling Day",
          "Family Entertainment",
        ],
      },
      {
        emojis: "🦅🏔️",
        answer: "Eagle Mountain",
        options: [
          "Eagle Mountain",
          "High Flight",
          "Majestic Bird",
          "Peak Hunter",
        ],
      },
      {
        emojis: "🐪🏜️",
        answer: "Desert Camel",
        options: [
          "Desert Camel",
          "Sand Traveler",
          "Hot Journey",
          "Oasis Seeker",
        ],
      },
      {
        emojis: "🎯🎪",
        answer: "Carnival Games",
        options: [
          "Carnival Games",
          "Fair Fun",
          "Prize Winning",
          "Skill Challenge",
        ],
      },
      {
        emojis: "🏰⚔️",
        answer: "Medieval Battle",
        options: [
          "Medieval Battle",
          "Knight Fight",
          "Castle War",
          "Ancient Combat",
        ],
      },
      {
        emojis: "🎨🌈",
        answer: "Colorful Art",
        options: [
          "Colorful Art",
          "Rainbow Painting",
          "Bright Creation",
          "Artistic Expression",
        ],
      },
      {
        emojis: "🏊‍♀️🏊‍♂️",
        answer: "Swimming Team",
        options: [
          "Swimming Team",
          "Pool Race",
          "Water Sport",
          "Competitive Swimming",
        ],
      },
      {
        emojis: "🎪🦁",
        answer: "Circus Lion",
        options: ["Circus Lion", "Tamed Beast", "Show Animal", "Ring Master"],
      },
      {
        emojis: "🏹🎯",
        answer: "Perfect Shot",
        options: [
          "Perfect Shot",
          "Bullseye Hit",
          "Archery Skill",
          "Target Master",
        ],
      },
      {
        emojis: "🎭👑",
        answer: "Royal Theater",
        options: [
          "Royal Theater",
          "Palace Show",
          "Drama Performance",
          "Court Entertainment",
        ],
      },
      {
        emojis: "🏰🌟",
        answer: "Magical Castle",
        options: [
          "Magical Castle",
          "Enchanted Palace",
          "Fairy Kingdom",
          "Starlit Fortress",
        ],
      },
    ],

    "VI-X": [
      // Original 25
      {
        emojis: "🌋🌧️",
        answer: "Volcanic Rain",
        options: [
          "Volcanic Rain",
          "Acid Precipitation",
          "Natural Disaster",
          "Geological Event",
        ],
      },
      {
        emojis: "🧬🔬",
        answer: "DNA Research",
        options: [
          "DNA Research",
          "Genetic Study",
          "Scientific Analysis",
          "Molecular Biology",
        ],
      },
      {
        emojis: "🏛️⚖️",
        answer: "Justice System",
        options: [
          "Justice System",
          "Court of Law",
          "Legal Process",
          "Constitutional Rights",
        ],
      },
      {
        emojis: "🧭🗺️",
        answer: "Navigation Tools",
        options: [
          "Navigation Tools",
          "Exploration Equipment",
          "Mapping Device",
          "Direction Finding",
        ],
      },
      {
        emojis: "🛰️🌍",
        answer: "Satellite Communication",
        options: [
          "Satellite Communication",
          "Global Technology",
          "Space Monitoring",
          "Earth Observation",
        ],
      },
      {
        emojis: "🦠💉",
        answer: "Vaccination Process",
        options: [
          "Vaccination Process",
          "Medical Treatment",
          "Disease Prevention",
          "Immune Response",
        ],
      },
      {
        emojis: "🏙️🌆",
        answer: "Urban Development",
        options: [
          "Urban Development",
          "City Planning",
          "Metropolitan Growth",
          "Infrastructure Progress",
        ],
      },
      {
        emojis: "🧪🔥",
        answer: "Chemical Reaction",
        options: [
          "Chemical Reaction",
          "Laboratory Experiment",
          "Scientific Process",
          "Molecular Change",
        ],
      },
      {
        emojis: "🏹🦌",
        answer: "Hunting Scene",
        options: [
          "Hunting Scene",
          "Wildlife Management",
          "Survival Skills",
          "Natural Selection",
        ],
      },
      {
        emojis: "🧗‍♂️⛰️",
        answer: "Mountain Climbing",
        options: [
          "Mountain Climbing",
          "Adventure Sport",
          "Physical Challenge",
          "Altitude Training",
        ],
      },
      {
        emojis: "🏰👑",
        answer: "Royal Palace",
        options: [
          "Royal Palace",
          "Monarchical System",
          "Historical Architecture",
          "Cultural Heritage",
        ],
      },
      {
        emojis: "🧩🧠",
        answer: "Problem Solving",
        options: [
          "Problem Solving",
          "Cognitive Development",
          "Mental Challenge",
          "Brain Training",
        ],
      },
      {
        emojis: "🏺🗿",
        answer: "Archaeological Discovery",
        options: [
          "Archaeological Discovery",
          "Ancient Civilization",
          "Historical Artifacts",
          "Cultural Research",
        ],
      },
      {
        emojis: "🧳✈️",
        answer: "International Travel",
        options: [
          "International Travel",
          "Global Mobility",
          "Tourism Industry",
          "Cultural Exchange",
        ],
      },
      {
        emojis: "🏟️⚽",
        answer: "Sports Stadium",
        options: [
          "Sports Stadium",
          "Athletic Competition",
          "Professional Football",
          "Mass Entertainment",
        ],
      },
      {
        emojis: "🧯🔥",
        answer: "Fire Safety",
        options: [
          "Fire Safety",
          "Emergency Response",
          "Disaster Management",
          "Prevention System",
        ],
      },
      {
        emojis: "🏜️🐫",
        answer: "Desert Adaptation",
        options: [
          "Desert Adaptation",
          "Extreme Environment",
          "Survival Strategy",
          "Climate Challenge",
        ],
      },
      {
        emojis: "🧤❄️",
        answer: "Winter Protection",
        options: [
          "Winter Protection",
          "Cold Weather Gear",
          "Thermal Insulation",
          "Seasonal Adaptation",
        ],
      },
      {
        emojis: "🏞️🌄",
        answer: "Natural Landscape",
        options: [
          "Natural Landscape",
          "Environmental Beauty",
          "Scenic Geography",
          "Ecological System",
        ],
      },
      {
        emojis: "🧲🪙",
        answer: "Magnetic Properties",
        options: [
          "Magnetic Properties",
          "Physical Science",
          "Metal Attraction",
          "Scientific Principle",
        ],
      },
      {
        emojis: "🏥🚑",
        answer: "Medical Emergency",
        options: [
          "Medical Emergency",
          "Healthcare System",
          "Life Support",
          "Critical Care",
        ],
      },
      {
        emojis: "🧭🌏",
        answer: "Global Navigation",
        options: [
          "Global Navigation",
          "World Exploration",
          "Geographic Orientation",
          "International Mapping",
        ],
      },
      {
        emojis: "🏛️🇮🇳",
        answer: "Indian Parliament",
        options: [
          "Indian Parliament",
          "Democratic Institution",
          "Legislative Body",
          "Government System",
        ],
      },
      {
        emojis: "🧪🌡️",
        answer: "Temperature Analysis",
        options: [
          "Temperature Analysis",
          "Scientific Measurement",
          "Thermal Studies",
          "Laboratory Testing",
        ],
      },
      {
        emojis: "🏆🎓",
        answer: "Academic Achievement",
        options: [
          "Academic Achievement",
          "Educational Success",
          "Scholarly Recognition",
          "Learning Excellence",
        ],
      },

      // Additional 25 new questions
      {
        emojis: "⚛️🔬",
        answer: "Atomic Structure",
        options: [
          "Atomic Structure",
          "Nuclear Physics",
          "Particle Science",
          "Molecular Theory",
        ],
      },
      {
        emojis: "🌊⚡",
        answer: "Hydroelectric Power",
        options: [
          "Hydroelectric Power",
          "Renewable Energy",
          "Water Turbine",
          "Clean Electricity",
        ],
      },
      {
        emojis: "🧬🦠",
        answer: "Genetic Engineering",
        options: [
          "Genetic Engineering",
          "Biotechnology",
          "DNA Modification",
          "Scientific Innovation",
        ],
      },
      {
        emojis: "🌍🌡️",
        answer: "Climate Change",
        options: [
          "Climate Change",
          "Global Warming",
          "Environmental Crisis",
          "Temperature Rise",
        ],
      },
      {
        emojis: "🏭💨",
        answer: "Industrial Pollution",
        options: [
          "Industrial Pollution",
          "Environmental Impact",
          "Air Contamination",
          "Factory Emissions",
        ],
      },
      {
        emojis: "🧪⚗️",
        answer: "Chemical Laboratory",
        options: [
          "Chemical Laboratory",
          "Scientific Research",
          "Experimental Chemistry",
          "Analytical Testing",
        ],
      },
      {
        emojis: "🌌🔭",
        answer: "Space Exploration",
        options: [
          "Space Exploration",
          "Astronomical Study",
          "Cosmic Research",
          "Universe Investigation",
        ],
      },
      {
        emojis: "⚖️📚",
        answer: "Legal Studies",
        options: [
          "Legal Studies",
          "Constitutional Law",
          "Judicial System",
          "Rights Protection",
        ],
      },
      {
        emojis: "🏛️🗳️",
        answer: "Democratic Process",
        options: [
          "Democratic Process",
          "Electoral System",
          "Voting Rights",
          "Political Participation",
        ],
      },
      {
        emojis: "💻🌐",
        answer: "Digital Revolution",
        options: [
          "Digital Revolution",
          "Internet Technology",
          "Global Connectivity",
          "Information Age",
        ],
      },
      {
        emojis: "🧠💡",
        answer: "Innovation Process",
        options: [
          "Innovation Process",
          "Creative Thinking",
          "Problem Solution",
          "Intellectual Development",
        ],
      },
      {
        emojis: "⚡🔋",
        answer: "Energy Storage",
        options: [
          "Energy Storage",
          "Battery Technology",
          "Power Management",
          "Electrical Engineering",
        ],
      },
      {
        emojis: "🌱🏭",
        answer: "Sustainable Industry",
        options: [
          "Sustainable Industry",
          "Green Technology",
          "Eco-friendly Production",
          "Environmental Balance",
        ],
      },
      {
        emojis: "🔬🧫",
        answer: "Microbiology Study",
        options: [
          "Microbiology Study",
          "Cellular Research",
          "Organism Analysis",
          "Laboratory Culture",
        ],
      },
      {
        emojis: "🌍📡",
        answer: "Global Communication",
        options: [
          "Global Communication",
          "Satellite Network",
          "Information Transfer",
          "Worldwide Connection",
        ],
      },
      {
        emojis: "⚕️💊",
        answer: "Medical Treatment",
        options: [
          "Medical Treatment",
          "Pharmaceutical Care",
          "Health Management",
          "Therapeutic Intervention",
        ],
      },
      {
        emojis: "🏗️🏢",
        answer: "Urban Construction",
        options: [
          "Urban Construction",
          "City Development",
          "Infrastructure Building",
          "Modern Architecture",
        ],
      },
      {
        emojis: "🌊🐟",
        answer: "Marine Ecosystem",
        options: [
          "Marine Ecosystem",
          "Ocean Biology",
          "Aquatic Life",
          "Underwater Environment",
        ],
      },
      {
        emojis: "⚡💻",
        answer: "Computer Technology",
        options: [
          "Computer Technology",
          "Digital Processing",
          "Electronic System",
          "Information Technology",
        ],
      },
      {
        emojis: "🔥🌲",
        answer: "Forest Management",
        options: [
          "Forest Management",
          "Environmental Conservation",
          "Natural Resources",
          "Ecological Balance",
        ],
      },
      {
        emojis: "🧬🔬",
        answer: "Biotechnology Research",
        options: [
          "Biotechnology Research",
          "Genetic Analysis",
          "Life Sciences",
          "Molecular Study",
        ],
      },
      {
        emojis: "🌍♻️",
        answer: "Environmental Sustainability",
        options: [
          "Environmental Sustainability",
          "Recycling Process",
          "Green Living",
          "Resource Conservation",
        ],
      },
      {
        emojis: "⚛️💥",
        answer: "Nuclear Energy",
        options: [
          "Nuclear Energy",
          "Atomic Power",
          "Radiation Process",
          "Alternative Fuel",
        ],
      },
      {
        emojis: "🧪🌡️",
        answer: "Scientific Measurement",
        options: [
          "Scientific Measurement",
          "Laboratory Analysis",
          "Data Collection",
          "Research Method",
        ],
      },
      {
        emojis: "🌌🚀",
        answer: "Space Mission",
        options: [
          "Space Mission",
          "Rocket Launch",
          "Cosmic Journey",
          "Astronaut Adventure",
        ],
      },
    ],
  };

  // Shuffle array function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Start game function
  const startGame = () => {
    const selectedQuestions = shuffleArray(questionBanks[selectedClass])
      .slice(0, numQuestions)
      .map((q) => ({
        ...q,
        emojis: q.emojis || "", // Ensure emojis exists
        options: q.options || [], // Ensure options exists
      }));

    setQuestions(selectedQuestions);
    setGameState("playing");
    setCurrentQuestion(0);
    setUserAnswers([]);
    setScore(0);
    setShowFeedback(false);
    setSelectedAnswer("");

    if (gameMode === "quiz") {
      setTimeLeft(numQuestions * 30);
    }
  };

  // Timer effect
  useEffect(() => {
    if (gameMode === "quiz" && gameState === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (
      gameMode === "quiz" &&
      timeLeft === 0 &&
      gameState === "playing"
    ) {
      finishGame();
    }
  }, [timeLeft, gameMode, gameState]);

  // Handle answer selection
  const handleAnswerSelect = (answer, index) => {
    if (showFeedback) return;

    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentQuestion].answer;
    const newAnswer = {
      answer,
      isCorrect,
      question: questions[currentQuestion],
      selectedIndex: index,
    };
    const newAnswers = [...userAnswers, newAnswer];
    setUserAnswers(newAnswers);

    if (isCorrect) {
      setScore(score + 1);
    }

    if (gameMode === "practice") {
      setShowFeedback(true);
      // Clear any existing timer
      if (feedbackTimer) {
        clearTimeout(feedbackTimer);
      }
      // Set new timer for 3 seconds
      const timer = setTimeout(() => {
        nextQuestion(newAnswers);
      }, 3000);
      setFeedbackTimer(timer);
    } else {
      nextQuestion(newAnswers);
    }
  };

  // Next question
  const nextQuestion = (answers = userAnswers) => {
    setShowFeedback(false);
    setSelectedAnswer("");
    if (feedbackTimer) {
      clearTimeout(feedbackTimer);
      setFeedbackTimer(null);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishGame();
    }
  };

  // Skip to next question manually (in practice mode)
  const skipToNext = () => {
    if (feedbackTimer) {
      clearTimeout(feedbackTimer);
      setFeedbackTimer(null);
    }
    nextQuestion();
  };

  // Finish game
  const finishGame = () => {
    if (feedbackTimer) {
      clearTimeout(feedbackTimer);
      setFeedbackTimer(null);
    }

    // If not all questions answered, fill in the remaining as incorrect
    if (userAnswers.length < questions.length) {
      const remainingQuestions = questions.slice(userAnswers.length);
      const dummyAnswers = remainingQuestions.map((question) => ({
        answer: "",
        isCorrect: false,
        question: {
          ...question, // Spread all question properties
          emojis: question.emojis || "", // Ensure emojis exists
          options: question.options || [], // Ensure options exists
        },
        selectedIndex: -1,
      }));
      setUserAnswers((prev) => [...prev, ...dummyAnswers]);
    }

    setGameState("results");
  };

  // Reset game
  const resetGame = () => {
    if (feedbackTimer) {
      clearTimeout(feedbackTimer);
      setFeedbackTimer(null);
    }
    setGameState("menu");
    setCurrentQuestion(0);
    setQuestions([]);
    setUserAnswers([]);
    setScore(0);
    setTimeLeft(0);
    setShowFeedback(false);
    setSelectedAnswer("");
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Get performance message
  const getPerformanceMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 90)
      return {
        text: "Outstanding! You're a Puzzle Pundit Master!",
        emoji: "🌟",
        color: "from-yellow-400 to-orange-500",
      };
    if (percentage >= 80)
      return {
        text: "Excellent work! You're doing great!",
        emoji: "🎉",
        color: "from-green-400 to-blue-500",
      };
    if (percentage >= 70)
      return {
        text: "Good job! Keep practicing!",
        emoji: "👍",
        color: "from-blue-400 to-purple-500",
      };
    if (percentage >= 60)
      return {
        text: "Not bad! Study a bit more!",
        emoji: "📚",
        color: "from-purple-400 to-pink-500",
      };
    return {
      text: "Keep trying! Practice makes perfect!",
      emoji: "💪",
      color: "from-red-400 to-pink-500",
    };
  };

  // Menu Screen
  if (gameState === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-4xl">
            {/* Main Header */}
            <div className="text-center mb-12">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <Trophy className="text-white text-4xl" />
                </div>
              </div>
              <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4 tracking-tight">
                Puzzle Pundit
              </h1>
              <p className="text-xl text-gray-300 font-light">
                Master the Art of Visual Thinking
              </p>
            </div>

            {/* Game Setup Cards */}
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {/* Class Selection */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="flex items-center mb-6">
                  <div className="bg-purple-500/20 rounded-xl p-3 mr-4">
                    <BookOpen className="text-purple-300" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Select Class</h3>
                </div>
                <div className="space-y-4">
                  {Object.keys(questionBanks).map((classGroup) => (
                    <button
                      key={classGroup}
                      onClick={() => setSelectedClass(classGroup)}
                      className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 font-semibold group ${
                        selectedClass === classGroup
                          ? "border-purple-400 bg-purple-500/30 text-white shadow-lg scale-105"
                          : "border-white/20 bg-white/5 text-gray-300 hover:border-purple-400/50 hover:bg-purple-500/10 hover:scale-102"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-lg">Classes {classGroup}</span>
                        <span
                          className={`text-xs px-3 py-1 rounded-full transition-colors ${
                            selectedClass === classGroup
                              ? "bg-white/20 text-white"
                              : "bg-gray-600/50 text-gray-300 group-hover:bg-purple-500/20"
                          }`}
                        >
                          {classGroup === "I-II"
                            ? "Ages 6-7"
                            : classGroup === "III-V"
                            ? "Ages 8-10"
                            : "Ages 11-15"}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Questions & Mode Selection */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-500/20 rounded-xl p-3 mr-4">
                    <Target className="text-blue-300" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Questions</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[5, 10, 15, 20].map((num) => (
                    <button
                      key={num}
                      onClick={() => setNumQuestions(num)}
                      className={`p-3 rounded-xl border-2 transition-all duration-300 font-bold text-lg ${
                        numQuestions === num
                          ? "border-blue-400 bg-blue-500/30 text-white shadow-lg scale-105"
                          : "border-white/20 bg-white/5 text-gray-300 hover:border-blue-400/50 hover:scale-102"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <div className="flex items-center mb-4">
                  <div className="bg-green-500/20 rounded-xl p-2 mr-3">
                    <Zap className="text-green-300" size={20} />
                  </div>
                  <h4 className="text-lg font-bold text-white">Mode</h4>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      mode: "practice",
                      icon: "🎯",
                      title: "Practice",
                      desc: "3s feedback",
                    },
                    {
                      mode: "test",
                      icon: "📝",
                      title: "Test",
                      desc: "No feedback",
                    },
                    { mode: "quiz", icon: "⏰", title: "Quiz", desc: "Timed" },
                  ].map(({ mode, icon, title, desc }) => (
                    <button
                      key={mode}
                      onClick={() => setGameMode(mode)}
                      className={`w-full p-3 rounded-xl border-2 transition-all duration-300 text-left group ${
                        gameMode === mode
                          ? "border-green-400 bg-green-500/30 text-white shadow-lg"
                          : "border-white/20 bg-white/5 text-gray-300 hover:border-green-400/50 hover:bg-green-500/10"
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{icon}</span>
                        <div>
                          <div className="font-semibold">{title}</div>
                          <div className="text-sm opacity-80">{desc}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Game */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl flex flex-col justify-center">
                <div className="text-center mb-8">
                  <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <Play className="text-white text-2xl ml-1" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Ready to Play?
                  </h3>
                  <p className="text-gray-300">
                    Choose your settings and begin!
                  </p>
                </div>

                <button
                  onClick={startGame}
                  disabled={!selectedClass}
                  className={`w-full py-6 rounded-2xl font-bold text-xl transition-all duration-300 transform ${
                    selectedClass
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl hover:shadow-purple-500/25 hover:scale-105 active:scale-95"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <Play className="mr-3" size={24} />
                    Start Adventure
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Playing Screen
  if (gameState === "playing") {
    const currentQ = questions[currentQuestion];

    // Safety check - if no current question, return to menu
    if (!currentQ || !currentQ.emojis) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-xl mb-4">Loading question...</p>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Back to Menu
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        </div>

        <div className="relative z-10 min-h-screen p-4 md:p-6">
          {/* Header */}
          <div className="max-w-7xl mx-auto mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-6">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                <button
                  onClick={resetGame}
                  className="flex items-center text-gray-300 hover:text-white transition-colors bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20"
                >
                  <ArrowLeft className="mr-2" size={20} />
                  Back to Menu
                </button>

                <div className="flex items-center space-x-8">
                  <div className="text-center">
                    <div className="text-sm text-gray-400 mb-1">Progress</div>
                    <div className="font-bold text-lg text-white">
                      {currentQuestion + 1} / {questions.length}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400 mb-1">Score</div>
                    <div className="font-bold text-lg text-green-400">
                      {score} / {questions.length}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-400 mb-1">Accuracy</div>
                    <div className="font-bold text-lg text-blue-400">
                      {userAnswers.length > 0
                        ? Math.round((score / userAnswers.length) * 100)
                        : 0}
                      %
                    </div>
                  </div>
                  {gameMode === "quiz" && (
                    <div className="text-center">
                      <div className="text-sm text-gray-400 mb-1">
                        Time Left
                      </div>
                      <div
                        className={`font-bold text-lg flex items-center ${
                          timeLeft < 60 ? "text-red-400" : "text-purple-400"
                        }`}
                      >
                        <Clock className="mr-2" size={16} />
                        {formatTime(timeLeft)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${
                        ((currentQuestion + 1) / questions.length) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>Question {currentQuestion + 1}</span>
                  <span>
                    {Math.round(
                      ((currentQuestion + 1) / questions.length) * 100
                    )}
                    % Complete
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-8 md:p-12">
              {/* Question */}
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
                  What does this represent?
                </h2>

                {/* Emojis with plus signs */}
                <div className="flex items-center justify-center space-x-4 mb-8">
                  {Array.from(currentQ.emojis).map((emoji, index) => (
                    <div key={index} className="flex items-center">
                      <div className="text-6xl md:text-8xl animate-bounce">
                        {emoji}
                      </div>
                      {index < Array.from(currentQ.emojis).length - 1 && (
                        <div className="mx-4">
                          <div className="bg-white/20 rounded-full p-3 mx-2">
                            <Plus className="text-white" size={24} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {currentQ.options.map((option, index) => {
                  const letters = ["A", "B", "C", "D"];
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === currentQ.answer;
                  const showResult = showFeedback;

                  let buttonStyle =
                    "border-white/30 bg-white/5 text-white hover:border-purple-400/70 hover:bg-purple-500/20 hover:scale-105 transform transition-all duration-300";

                  if (showResult) {
                    if (isCorrect) {
                      buttonStyle =
                        "border-green-400 bg-green-500/30 text-white shadow-lg shadow-green-500/25";
                    } else if (isSelected) {
                      buttonStyle =
                        "border-red-400 bg-red-500/30 text-white shadow-lg shadow-red-500/25";
                    } else {
                      buttonStyle = "border-white/20 bg-white/5 text-gray-400";
                    }
                  } else if (isSelected) {
                    buttonStyle =
                      "border-purple-400 bg-purple-500/30 text-white shadow-lg scale-105";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(option, index)}
                      disabled={showFeedback}
                      className={`p-6 rounded-2xl border-2 font-semibold text-left cursor-pointer ${buttonStyle}`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg mr-4 transition-colors ${
                            showResult && isCorrect
                              ? "bg-green-500 text-white"
                              : showResult && isSelected
                              ? "bg-red-500 text-white"
                              : isSelected
                              ? "bg-purple-500 text-white"
                              : "bg-white/20 text-white"
                          }`}
                        >
                          {letters[index]}
                        </div>
                        <div className="flex-1">
                          <span className="text-lg">{option}</span>
                        </div>
                        <div className="ml-4">
                          {showResult && isCorrect && (
                            <CheckCircle className="text-green-400" size={24} />
                          )}
                          {showResult && isSelected && !isCorrect && (
                            <XCircle className="text-red-400" size={24} />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Feedback Section */}
              {showFeedback && (
                <div className="mt-8 max-w-2xl mx-auto">
                  <div
                    className={`p-6 rounded-2xl border-2 ${
                      selectedAnswer === currentQ.answer
                        ? "border-green-400/50 bg-green-500/20"
                        : "border-red-400/50 bg-red-500/20"
                    }`}
                  >
                    <div className="text-center">
                      <div
                        className={`text-2xl font-bold mb-3 ${
                          selectedAnswer === currentQ.answer
                            ? "text-green-300"
                            : "text-red-300"
                        }`}
                      >
                        {selectedAnswer === currentQ.answer
                          ? "🎉 Excellent!"
                          : "❌ Not Quite Right"}
                      </div>
                      <div className="text-white/90 text-lg mb-4">
                        The correct answer is:{" "}
                        <strong className="text-yellow-300">
                          {currentQ.answer}
                        </strong>
                      </div>
                      {gameMode === "practice" && (
                        <div className="flex items-center justify-center space-x-4">
                          <div className="text-sm text-gray-300">
                            Auto-advancing in 3 seconds...
                          </div>
                          <button
                            onClick={skipToNext}
                            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                          >
                            <span className="mr-2">Skip</span>
                            <ArrowLeft className="rotate-180" size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }


 // Results Screen - Updated Version
// Results Screen - Keeping your question review intact
if (gameState === 'results') {
  const percentage = Math.round((score / questions.length) * 100);
  const stars = Math.ceil(percentage / 20); // 1-5 stars
  
  // New performance titles
  const performanceTitles = {
    1: { title: "Rookie", emoji: "👶", color: "from-gray-400 to-gray-600" },
    2: { title: "Racer", emoji: "🏎️", color: "from-blue-400 to-blue-600" },
    3: { title: "Master", emoji: "🎓", color: "from-purple-400 to-purple-600" },
    4: { title: "Prodigy", emoji: "🌟", color: "from-pink-400 to-pink-600" },
    5: { title: "Wizard", emoji: "🧙", color: "from-yellow-400 to-orange-500" }
  };
  
  const performance = performanceTitles[stars] || performanceTitles[1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-6xl">
          {/* Game Info Header */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-6 mb-8">
            <div className="flex flex-wrap justify-center gap-6">
              <div className="bg-purple-500/20 px-6 py-3 rounded-xl flex items-center">
                <BookOpen className="text-purple-300 mr-3" />
                <span className="font-bold text-white">Class: {selectedClass}</span>
              </div>
              <div className="bg-blue-500/20 px-6 py-3 rounded-xl flex items-center">
                <Trophy className="text-blue-300 mr-3" />
                <span className="font-bold text-white">Mode: {gameMode.charAt(0).toUpperCase() + gameMode.slice(1)}</span>
              </div>
              <div className="bg-green-500/20 px-6 py-3 rounded-xl flex items-center">
                <Clock className="text-green-300 mr-3" />
                <span className="font-bold text-white">
                  Time: {gameMode === 'quiz' ? formatTime(numQuestions * 30 - timeLeft) : '--:--'}
                </span>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="relative inline-block mb-6">
              <div className={`absolute inset-0 bg-gradient-to-r ${performance.color} rounded-full blur-lg opacity-40 animate-pulse`}></div>
              <div className={`relative bg-gradient-to-r ${performance.color} rounded-full w-32 h-32 flex items-center justify-center shadow-2xl`}>
                <Award className="text-white text-5xl" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-yellow-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Game Complete!
            </h1>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center bg-purple-500/20 px-4 py-2 rounded-lg">
                  <BookOpen className="text-purple-300 mr-2" size={20} />
                  <span className="font-bold text-white text-lg">Class: {selectedClass}</span>
                </div>
                <div className="flex items-center bg-blue-500/20 px-4 py-2 rounded-lg">
                  <Trophy className="text-blue-300 mr-2" size={20} />
                  <span className="font-bold text-white text-lg">
                    Mode: {gameMode.charAt(0).toUpperCase() + gameMode.slice(1)}
                  </span>
                </div>
              </div>
              <div className="flex items-center bg-green-500/20 px-4 py-2 rounded-lg">
<p className="text-2xl text-gray-300 font-light">
              You've earned the title of <span className="font-bold text-white">{performance.title}!</span> {performance.emoji}
            </p>
              </div>
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Enhanced Score Display */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-8 text-center h-full">
                <h3 className="text-2xl font-bold text-white mb-6">Your Performance</h3>
                
                {/* Score Circle */}
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full border-8 border-white/10"></div>
                  <div 
                    className="absolute inset-2 rounded-full border-8 border-transparent"
                    style={{
                      background: `conic-gradient(from 0deg, #8b5cf6 0%, #8b5cf6 ${percentage}%, #374151 ${percentage}%, #374151 100%)`
                    }}
                  ></div>
                  <div className="absolute inset-6 rounded-full bg-slate-900 flex flex-col items-center justify-center">
                    <div className="text-5xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                      {percentage}%
                    </div>
                    <div className="text-lg text-gray-300">
                      {score}/{questions.length}
                    </div>
                  </div>
                </div>
                
                {/* Star Rating */}
                <div className="flex justify-center space-x-2 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-8 h-8 transition-all duration-300 ${i < stars ? 'text-yellow-400 fill-current animate-bounce' : 'text-gray-500'}`}
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>
                
                {/* Performance Badge */}
                <div className={`inline-block px-6 py-3 rounded-full bg-gradient-to-r ${performance.color} text-white font-bold shadow-lg mb-6 animate-pulse`}>
                  {performance.emoji} {performance.title} {performance.emoji}
                </div>
                
                {/* Accuracy Metrics */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="text-gray-400 text-sm">Correct</div>
                    <div className="text-green-400 font-bold text-xl">{score}</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3">
                    <div className="text-gray-400 text-sm">Incorrect</div>
                    <div className="text-red-400 font-bold text-xl">{questions.length - score}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* YOUR EXISTING QUESTION REVIEW SECTION - COMPLETELY UNCHANGED */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Target className="mr-3 text-purple-400" />
                  Question Review
                </h3>
                <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="space-y-4">
                    {userAnswers.map((answer, index) => {
                      const emojis = typeof answer.question.emojis === 'string' 
                        ? Array.from(answer.question.emojis) 
                        : answer.question.emojis || [];
                      
                      return (
                        <div key={index} className={`p-4 rounded-2xl border-2 ${
                          answer.isCorrect 
                            ? 'border-green-400/50 bg-green-500/20' 
                            : 'border-red-400/50 bg-red-500/20'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center flex-1">
                              <div className="flex items-center mr-4">
                                {emojis.map((emoji, i) => (
                                  <div key={i} className="flex items-center">
                                    <span className="text-2xl">{emoji}</span>
                                    {i < emojis.length - 1 && (
                                      <Plus className="text-white/60 mx-2" size={16} />
                                    )}
                                  </div>
                                ))}
                              </div>
                              <div className="text-left flex-1">
                                <div className="font-semibold text-white text-lg mb-1">
                                  {answer.question.answer}
                                </div>
                                <div className={`text-sm ${answer.isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                                  Your answer: {answer.answer || 'Skipped'}
                                </div>
                              </div>
                            </div>
                            <div className="ml-4">
                              {answer.isCorrect ? (
                                <div className="bg-green-500 rounded-full p-2">
                                  <CheckCircle className="text-white" size={24} />
                                </div>
                              ) : (
                                <div className="bg-red-500 rounded-full p-2">
                                  <XCircle className="text-white" size={24} />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={resetGame}
              className="px-8 py-4 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center"
            >
              <Home className="mr-3" size={20} />
              Back to Menu
            </button>
            <button
              onClick={() => {
                setGameState('menu');
                startGame(); // Restart with same settings
              }}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center"
            >
              <RotateCcw className="mr-3" size={20} />
              Play Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

  return null;
};

export default PuzzlePunditGame;
