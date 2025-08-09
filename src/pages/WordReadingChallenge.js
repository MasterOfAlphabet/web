import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Star,
  Trophy,
  Clock,
  RotateCcw,
  Play,
  Volume2,
  Users,
  GraduationCap,
  Timer,
  BarChart3,
  CheckCircle,
  XCircle,
  Target,
  Zap,
  Brain,
  Award,
  Pause,
  List,
  Mic,
  ArrowRight,
  Eye,
  EyeOff,
  Settings,
  Shuffle,
  Volume1,
  VolumeX,
  SkipForward,
} from "lucide-react";

const useTimeTracking = () => {
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [totalSessionTime, setTotalSessionTime] = useState(0);
  const [currentWordStartTime, setCurrentWordStartTime] = useState(null);
  const [wordTimes, setWordTimes] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const startSession = () => {
    const now = Date.now();
    setSessionStartTime(now);
    setIsActive(true);
    setIsPaused(false);
  };

  const endSession = () => {
    setIsActive(false);
    setIsPaused(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const startWordTimer = (wordIndex) => {
    setCurrentWordStartTime(Date.now());
  };

  const endWordTimer = (wordIndex, isCorrect) => {
    if (currentWordStartTime) {
      const wordTime = Date.now() - currentWordStartTime;
      setWordTimes((prev) => [
        ...prev,
        {
          wordIndex,
          time: wordTime,
          isCorrect,
          timestamp: new Date().toISOString(),
        },
      ]);
      setCurrentWordStartTime(null);
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const resetTracking = () => {
    setSessionStartTime(null);
    setTotalSessionTime(0);
    setCurrentWordStartTime(null);
    setWordTimes([]);
    setIsActive(false);
    setIsPaused(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (isActive && !isPaused && sessionStartTime) {
      intervalRef.current = setInterval(() => {
        setTotalSessionTime(Date.now() - sessionStartTime);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, isPaused, sessionStartTime]);

  const getStats = () => {
    if (wordTimes.length === 0)
      return {
        averageTimePerWord: 0,
        fastestWord: 0,
        slowestWord: 0,
        accuracyRate: 0,
        totalWords: 0,
        correctWords: 0,
      };

    const times = wordTimes.map((w) => w.time);
    const correctWords = wordTimes.filter((w) => w.isCorrect).length;
    return {
      averageTimePerWord: times.reduce((a, b) => a + b, 0) / times.length,
      fastestWord: Math.min(...times),
      slowestWord: Math.max(...times),
      accuracyRate: (correctWords / wordTimes.length) * 100,
      totalWords: wordTimes.length,
      correctWords,
    };
  };

  return {
    sessionStartTime,
    totalSessionTime,
    currentWordStartTime,
    wordTimes,
    isActive,
    isPaused,
    startSession,
    endSession,
    startWordTimer,
    endWordTimer,
    togglePause,
    resetTracking,
    getStats,
  };
};

const TimeDisplay = ({ time, label, className = "" }) => {
  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}:${(minutes % 60).toString().padStart(2, "0")}:${
        (seconds % 60)
          .toString()
          .padStart(2, "0")
      }`;
    }
    return `${minutes}:${(seconds % 60).toString().padStart(2, "0")}`;
  };

  return (
    <div className={`text-center ${className}`}>
      <div className="text-2xl font-bold text-white">{formatTime(time)}</div>
      <div className="text-sm text-white/70">{label}</div>
    </div>
  );
};

const StatisticsPanel = ({ stats, wordTimes, streak, bestStreak }) => {
  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    return seconds > 60
      ? `${Math.floor(seconds / 60)}m ${seconds % 60}s`
      : `${seconds}s`;
  };

  return (
    <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <BarChart3 className="w-6 h-6" /> Performance Stats
      </h3>
      {stats.totalWords > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl p-3">
            <div className="text-2xl font-bold text-cyan-400">
              {stats.totalWords}
            </div>
            <div className="text-sm text-white/70">Words Read</div>
          </div>
          <div className="text-center bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl p-3">
            <div className="text-2xl font-bold text-green-400">
              {Math.round(stats.accuracyRate)}%
            </div>
            <div className="text-sm text-white/70">Accuracy</div>
          </div>
          <div className="text-center bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl p-3">
            <div className="text-2xl font-bold text-purple-400">{streak}</div>
            <div className="text-sm text-white/70">Current Streak</div>
          </div>
          <div className="text-center bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-xl p-3">
            <div className="text-2xl font-bold text-yellow-400">
              {bestStreak}
            </div>
            <div className="text-sm text-white/70">Best Streak</div>
          </div>
        </div>
      ) : (
        <div className="text-center text-white/60">
          <Brain className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Start reading words to see your performance!</p>
        </div>
      )}
    </div>
  );
};

const WordCard = ({ word, isCorrect, isWrong, onClick, isDisabled }) => {
  const cardStyle = isCorrect
    ? "bg-green-400/30 border-green-400"
    : isWrong
    ? "bg-red-400/30 border-red-400 opacity-60 cursor-not-allowed"
    : "bg-white/10 border-white/20 hover:bg-white/15";

  return (
    <div
      onClick={isDisabled ? undefined : onClick}
      className={`p-4 rounded-lg border-2 ${cardStyle} ${!isDisabled ? 'cursor-pointer' : ''} transition-colors`}
    >
      {word}
      {isCorrect && <CheckCircle className="ml-2 inline" />}
      {isWrong && <XCircle className="ml-2 inline" />}
    </div>
  );
};

const WordReadingChallenge = () => {
  const wordSets = {
    "Class I-II": {
      words: [
        "cat",
        "dog",
        "sun",
        "run",
        "big",
        "red",
        "hat",
        "bat",
        "map",
        "cup",
        "pen",
        "bag",
        "sit",
        "top",
        "box",
        "fox",
        "egg",
        "leg",
        "net",
        "wet",
        "bus",
        "fun",
        "gun",
        "hut",
        "jam",
        "kit",
        "log",
        "mom",
        "nap",
        "owl",
      ],
      difficulty: "Easy",
      gridSize: { cols: 5, rows: 6 },
      timeLimit: 300000,
    },
    "Class III-V": {
      words: [
        "school",
        "friend",
        "family",
        "happy",
        "garden",
        "student",
        "teacher",
        "library",
        "science",
        "history",
        "english",
        "drawing",
        "painting",
        "reading",
        "writing",
        "computer",
        "kitchen",
        "bedroom",
        "bathroom",
        "morning",
        "evening",
        "chicken",
        "elephant",
        "giraffe",
        "butterfly",
        "mountain",
        "rainbow",
        "thunder",
        "lightning",
        "beautiful",
      ],
      difficulty: "Medium",
      gridSize: { cols: 5, rows: 6 },
      timeLimit: 420000,
    },
    "Class VI-X": {
      words: [
        "imagination",
        "responsibility",
        "environment",
        "technology",
        "development",
        "communication",
        "independence",
        "opportunity",
        "achievement",
        "literature",
        "mathematics",
        "geography",
        "democracy",
        "philosophy",
        "psychology",
        "architecture",
        "photography",
        "archaeology",
        "astronomy",
        "biology",
        "chemistry",
        "economics",
        "sociology",
        "anthropology",
        "encyclopedia",
        "extraordinary",
        "consciousness",
        "appreciation",
        "sophisticated",
        "magnificent",
      ],
      difficulty: "Hard",
      gridSize: { cols: 5, rows: 6 },
      timeLimit: 600000,
    },
  };

  const [selectedClass, setSelectedClass] = useState("Class I-II");
  const [wordCount, setWordCount] = useState(15);
  const [dictationMode, setDictationMode] = useState("one-word");
  const [currentWords, setCurrentWords] = useState([]);
  const [targetWord, setTargetWord] = useState("");
  const [selectedWordIndex, setSelectedWordIndex] = useState(null);
  const [correctWords, setCorrectWords] = useState(new Set());
  const [wrongWords, setWrongWords] = useState(new Set());
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [isContinuousPlaying, setIsContinuousPlaying] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  const [speechVolume, setSpeechVolume] = useState(1.0);
  const [wordsQueue, setWordsQueue] = useState([]);
  const [completedWordsCount, setCompletedWordsCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [celebrationMode, setCelebrationMode] = useState(false);
  const [remainingWords, setRemainingWords] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);

  const speechSynthesis = useRef(window.speechSynthesis);
  const timeTracking = useTimeTracking();
  const [currentWordTime, setCurrentWordTime] = useState(0);

  const wordCountOptions = [5, 10, 15, 20, 25, 30];

  const [feedbackMessage, setFeedbackMessage] = useState("");

  const [wrongSelections, setWrongSelections] = useState(new Set());

  useEffect(() => {
    resetGame();
  }, [selectedClass, wordCount]);

  useEffect(() => {
    let interval;
    if (
      timeTracking.currentWordStartTime &&
      timeTracking.isActive &&
      !timeTracking.isPaused
    ) {
      interval = setInterval(() => {
        setCurrentWordTime(Date.now() - timeTracking.currentWordStartTime);
      }, 1000);
    } else {
      setCurrentWordTime(0);
    }
    return () => clearInterval(interval);
  }, [
    timeTracking.currentWordStartTime,
    timeTracking.isActive,
    timeTracking.isPaused,
  ]);

  const createWordsQueue = () => {
    const words = [...wordSets[selectedClass].words];
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, wordCount);
  };

  const resetGame = () => {
    const queue = createWordsQueue();
    setWordsQueue(queue);
    setCurrentWords([...queue].sort(() => Math.random() - 0.5));
    setRemainingWords([...queue]);
    setAvailableWords([...queue]);
    setTargetWord("");
    setSelectedWordIndex(null);
    setCorrectWords(new Set());
    setWrongWords(new Set());
    setWrongSelections(new Set());
    setScore(0);
    setStreak(0);
    setGameStarted(false);
    setCompletedWordsCount(0);
    setGameCompleted(false);
    setGameEnded(false);
    setIsContinuousPlaying(false);
    setCelebrationMode(false);
    timeTracking.resetTracking();
  };

  const startGame = () => {
    setGameStarted(true);
    setShowInstructions(false);
    timeTracking.startSession();
    setIsContinuousPlaying(dictationMode === "continuous");
    nextWord();
  };

const getRandomWord = () => {
  if (availableWords.length === 0) {
    return null;
  }
  
  // Get a random word from remaining available words
  const randomIndex = Math.floor(Math.random() * availableWords.length);
  const word = availableWords[randomIndex];
  return word;
};

  const speakWord = (word) => {
    if (speechSynthesis.current && word) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = speechSpeed * (selectedClass === 'Class I-II' ? 0.8 : selectedClass === 'Class III-V' ? 0.9 : 1.0);
      utterance.volume = speechVolume;
      utterance.lang = 'en-US';
      speechSynthesis.current.speak(utterance);
    }
  };

  
  const nextWord = () => {
    if (availableWords.length === 0) {
      endGame();
      return;
    }

    const newTarget = getRandomWord();
    if (!newTarget) {
      endGame();
      return;
    }

    setTargetWord(newTarget);
    speakWord(newTarget);
    timeTracking.startWordTimer(completedWordsCount);
  };

const selectWord = (wordIndex) => {
  const selectedWord = currentWords[wordIndex];

  // Prevent selecting already judged words
  if (correctWords.has(wordIndex) || wrongSelections.has(selectedWord)) {
    return;
  }

  if (selectedWord === targetWord) {
    // Correct selection
    setCorrectWords((prev) => new Set([...prev, wordIndex]));
    setScore((prev) => prev + 1);
    setStreak((prev) => prev + 1);
    setBestStreak((prev) => Math.max(prev, streak + 1));
    
    setFeedbackMessage("Correct! 🎉");
    setTimeout(() => setFeedbackMessage(""), 1500);
    
    timeTracking.endWordTimer(completedWordsCount, true);
    setCompletedWordsCount((prev) => prev + 1);
    
    // Remove from available words
    setAvailableWords((prev) => prev.filter((w) => w !== selectedWord));
    
    if (autoAdvance) {
      setTimeout(() => {
        nextWord();
      }, 1500);
    }
    
  } else {
    // Wrong selection - mark as wrong AND remove from findable words
    setWrongSelections((prev) => new Set([...prev, selectedWord]));
    setStreak(0);
    
    // Also remove the wrongly selected word from available words
    setAvailableWords((prev) => prev.filter((w) => w !== selectedWord));
    
    setFeedbackMessage(`Incorrect! Moving to next word...`);
    setTimeout(() => setFeedbackMessage(""), 1500);
    
    timeTracking.endWordTimer(completedWordsCount, false);
    setCompletedWordsCount((prev) => prev + 1);
    
    // Auto-advance to next word after wrong selection
    if (autoAdvance) {
      setTimeout(() => {
        nextWord();
      }, 1500);
    }
  }
};

  const advanceToNextWord = () => {
    if (completedWordsCount < wordCount) {
      setCompletedWordsCount((prev) => prev + 1);
      nextWord();
    }
  };

  const skipCurrentWord = () => {
    timeTracking.endWordTimer(completedWordsCount, false);
    setStreak(0);
    if (completedWordsCount < wordCount) {
      setCompletedWordsCount((prev) => prev + 1);
      nextWord();
    }
  };

  const repeatWord = () => {
    if (targetWord && speechSynthesis.current) {
      const utterance = new SpeechSynthesisUtterance(targetWord);
      utterance.rate =
        speechSpeed *
        (selectedClass === "Class I-II"
          ? 0.8
          : selectedClass === "Class III-V"
          ? 0.9
          : 1.0);
      utterance.volume = speechVolume;
      utterance.lang = "en-US";
      speechSynthesis.current.speak(utterance);
    }
  };

  const endGame = () => {
    setGameCompleted(true);
    setIsContinuousPlaying(false);
    timeTracking.endSession();
    setCelebrationMode(true);
    setTimeout(() => setCelebrationMode(false), 3000);
  };

  const endGameEarly = () => {
    setGameEnded(true);
    setGameStarted(false);
    setIsContinuousPlaying(false);
    timeTracking.endSession();
  };

  const getClassIcon = (classLevel) => {
    switch (classLevel) {
      case "Class I-II":
        return <BookOpen className="w-5 h-5" />;
      case "Class III-V":
        return <Users className="w-5 h-5" />;
      case "Class VI-X":
        return <GraduationCap className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "from-green-400 to-emerald-600";
      case "Medium":
        return "from-yellow-400 to-orange-600";
      case "Hard":
        return "from-red-400 to-pink-600";
      default:
        return "from-blue-400 to-purple-600";
    }
  };

  const getGridColsClass = () => {
    const baseCols = wordSets[selectedClass].gridSize.cols;
    if (window.innerWidth < 640) {
      return "grid-cols-3";
    } else if (window.innerWidth < 768) {
      return "grid-cols-4";
    }
    return `grid-cols-${baseCols}`;
  };

  const stats = timeTracking.getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 relative overflow-hidden">
      {/* Celebration overlay */}
      {celebrationMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="text-8xl animate-bounce">🎉</div>
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-600/20 animate-pulse"></div>
        </div>
      )}

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-red-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-2xl">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              Word Reading Challenge
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-white/80 drop-shadow-lg">
            Listen, Find & Learn - Master Your Reading Skills!
          </p>
        </div>

        {!gameStarted && !gameCompleted && !gameEnded ? (
          // Show game settings screen
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-white">
                Game Settings
              </h2>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Class Level Selection */}
              <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Select Class Level
                </h3>
                <div className="flex flex-col gap-2">
                  {Object.keys(wordSets).map((classLevel) => (
                    <button
                      key={classLevel}
                      onClick={() => setSelectedClass(classLevel)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-lg border flex items-center gap-2 ${
                        selectedClass === classLevel
                          ? "bg-white/20 border-white/40 text-white shadow-lg shadow-white/20"
                          : "bg-white/10 border-white/20 text-white/80 hover:bg-white/15"
                      }`}
                    >
                      {getClassIcon(classLevel)}
                      {classLevel}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Words */}
              <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <List className="w-5 h-5" />
                  Number of Words
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {wordCountOptions.map((count) => (
                    <button
                      key={count}
                      onClick={() => setWordCount(count)}
                      className={`px-3 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                        wordCount === count
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30"
                          : "bg-white/10 border border-white/20 text-white/80 hover:bg-white/15"
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dictation Mode */}
              <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Mic className="w-5 h-5" />
                  Dictation Mode
                </h3>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setDictationMode("one-word")}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                      dictationMode === "one-word"
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30"
                        : "bg-white/10 border border-white/20 text-white/80 hover:bg-white/15"
                    }`}
                  >
                    One Word at a Time
                  </button>
                  <button
                    onClick={() => setDictationMode("continuous")}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                      dictationMode === "continuous"
                        ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/30"
                        : "bg-white/10 border border-white/20 text-white/80 hover:bg-white/15"
                    }`}
                  >
                    Continuous Play
                  </button>
                </div>
              </div>
            </div>

            {/* Advanced Settings Panel */}
            {showSettings && (
              <div className="mb-6 backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Advanced Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Speech Speed: {speechSpeed.toFixed(1)}x
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={speechSpeed}
                      onChange={(e) =>
                        setSpeechSpeed(parseFloat(e.target.value))
                      }
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Speech Volume: {Math.round(speechVolume * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.1"
                      value={speechVolume}
                      onChange={(e) =>
                        setSpeechVolume(parseFloat(e.target.value))
                      }
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-center gap-4">
                    <button
                      onClick={() => setAutoAdvance(!autoAdvance)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                        autoAdvance
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30"
                          : "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/30"
                      }`}
                    >
                      {autoAdvance ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      Auto-Advance
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Start Game Button */}
            <div className="text-center mb-8">
              <button
                onClick={startGame}
                className="px-8 sm:px-12 py-4 sm:py-6 rounded-3xl font-bold text-lg sm:text-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-2xl shadow-green-500/30 flex items-center gap-3 mx-auto"
              >
                <Play className="w-6 h-6 sm:w-8 sm:h-8" />
                Start Word Challenge
              </button>
            </div>

            {/* Instructions */}
            {showInstructions && (
              <div className="mb-8">
                <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Target className="w-6 h-6" />
                    How to Play
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white/80">
                    <div>
                      <h4 className="font-semibold text-white mb-2">
                        🎯 Game Objective
                      </h4>
                      <ul className="space-y-2">
                        <li>• Listen to the spoken word carefully</li>
                        <li>• Find and click the matching word in the grid</li>
                        <li>• Build your reading and listening skills</li>
                        <li>• Achieve the highest streak possible!</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">
                        ⚡ Enhanced Features
                      </h4>
                      <ul className="space-y-2">
                        <li>• Adjustable speech speed and volume</li>
                        <li>• Skip difficult words when needed</li>
                        <li>• Detailed performance tracking</li>
                        <li>• Celebration effects for achievements</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl border border-blue-400/30">
                    <h4 className="font-semibold text-blue-200 mb-2">
                      💡 Pro Tips
                    </h4>
                    <div className="text-blue-100/80 text-sm">
                      <p>• Focus carefully on the pronunciation of each word</p>
                      <p>• Adjust speech speed to match your comfort level</p>
                      <p>• Try to maintain a streak for bonus achievements</p>
                      <p>
                        • Don't hesitate to skip challenging words and come back
                        to them
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : gameStarted && !gameCompleted && !gameEnded ? (
          // Show game in progress
          <>
            {/* Timer and Stats */}
            <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Clock className="w-6 h-6" /> Game Timer
                  </h3>
                  <button
                    onClick={timeTracking.togglePause}
                    className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                      timeTracking.isPaused
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30"
                        : "bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg shadow-yellow-500/30"
                    }`}
                  >
                    {timeTracking.isPaused ? (
                      <Play className="w-4 h-4" />
                    ) : (
                      <Pause className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <TimeDisplay
                    time={timeTracking.totalSessionTime}
                    label="Total Time"
                  />
                  <TimeDisplay time={currentWordTime} label="Current Word" />
                </div>
              </div>

              <StatisticsPanel
                stats={stats}
                wordTimes={timeTracking.wordTimes}
                streak={streak}
                bestStreak={bestStreak}
              />
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-white font-semibold">Progress</span>
                  <span className="text-white/80">
                    {completedWordsCount} / {wordCount}
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 mb-4">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-blue-600 h-3 rounded-full transition-all duration-500 shadow-lg"
                    style={{
                      width: `${(completedWordsCount / wordCount) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between gap-2">
                  <div className="flex items-center gap-4">
                    <span className="text-white/80 flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      Score: {score}
                    </span>
                    <span className="text-white/80 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Streak: {streak}
                    </span>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full bg-gradient-to-r ${getDifficultyColor(
                      wordSets[selectedClass].difficulty
                    )} text-white font-semibold text-sm`}
                  >
                    {wordSets[selectedClass].difficulty}
                  </div>
                </div>
              </div>
            </div>

            {/* Current Word Prompt */}
            {gameStarted && !gameCompleted && !gameEnded && (
              <div className="mb-8">
                <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl text-center">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">
                    {dictationMode === "continuous"
                      ? "Listen carefully for the words:"
                      : "Find this word in the grid:"}
                  </h3>
                  <div className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-4 animate-pulse">
                    "{targetWord}"
                  </div>

                  {feedbackMessage && (
                    <div
                      className={`text-lg font-semibold mb-4 transition-all duration-300 ${
                        feedbackMessage.includes("Correct")
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {feedbackMessage}
                    </div>
                  )}
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                    <button
                      onClick={repeatWord}
                      className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl shadow-blue-500/30 flex items-center gap-2"
                    >
                      {speechVolume > 0.5 ? (
                        <Volume2 className="w-5 h-5" />
                      ) : speechVolume > 0 ? (
                        <Volume1 className="w-5 h-5" />
                      ) : (
                        <VolumeX className="w-5 h-5" />
                      )}
                      Repeat Word
                    </button>

                    {!autoAdvance && (
                      <button
                        onClick={advanceToNextWord}
                        className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-2xl shadow-green-500/30 flex items-center gap-2"
                        disabled={completedWordsCount >= wordCount}
                      >
                        <ArrowRight className="w-5 h-5" />
                        Next Word
                      </button>
                    )}

                    <button
                      onClick={skipCurrentWord}
                      className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-2xl shadow-orange-500/30 flex items-center gap-2"
                    >
                      <SkipForward className="w-5 h-5" />
                      Skip Word
                    </button>

                    {dictationMode === "continuous" && (
                      <button
                        onClick={() =>
                          setIsContinuousPlaying(!isContinuousPlaying)
                        }
                        className={`px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                          isContinuousPlaying
                            ? "bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-2xl shadow-yellow-500/30"
                            : "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-2xl shadow-gray-500/30"
                        }`}
                      >
                        {isContinuousPlaying ? (
                          <>
                            <Pause className="w-5 h-5" />
                            <span className="hidden sm:inline">
                              Pause Auto-Play
                            </span>
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5" />
                            <span className="hidden sm:inline">
                              Resume Auto-Play
                            </span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Word Grid */}
            {gameStarted && !gameCompleted && !gameEnded && (
              <div className="mb-8">
                <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
                  <div className={`grid gap-4 ${getGridColsClass()}`}>
                   {currentWords.map((word, index) => (
  <WordCard
    key={`${word}-${index}`}
    word={word}
    isCorrect={correctWords.has(index)}
    isWrong={wrongSelections.has(word)}
    isDisabled={correctWords.has(index) || wrongSelections.has(word)}
    onClick={() => selectWord(index)}
  />
))}
                  </div>
                </div>
              </div>
            )}

            {/* Game Controls */}
            {gameStarted && !gameCompleted && !gameEnded && (
              <div className="mb-8">
                <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-4 border border-white/20 shadow-2xl">
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                    <button
                      onClick={endGameEarly}
                      className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-2xl shadow-red-500/30 flex items-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      End Game
                    </button>
                    <button
                      onClick={resetGame}
                      className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-2xl shadow-gray-500/30 flex items-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Restart
                    </button>
                    <button
                      onClick={() => {
                        const newQueue = createWordsQueue();
                        setWordsQueue(newQueue);
                        setCurrentWords(
                          [...newQueue].sort(() => Math.random() - 0.5)
                        );
                        setRemainingWords([...newQueue]);
                        setAvailableWords([...newQueue]);
                      }}
                      className="px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-2xl shadow-indigo-500/30 flex items-center gap-2"
                    >
                      <Shuffle className="w-5 h-5" />
                      Shuffle Words
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Achievements */}
            {gameStarted && !gameEnded && (
              <div className="mb-8">
                <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Award className="w-6 h-6" />
                    Achievements
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div
                      className={`p-4 rounded-xl text-center transition-all duration-300 ${
                        streak >= 5
                          ? "bg-gradient-to-br from-yellow-400/30 to-orange-600/30 border-2 border-yellow-400/60"
                          : "bg-white/5 border border-white/10"
                      }`}
                    >
                      <div className="text-2xl mb-1">🔥</div>
                      <div className="text-sm font-medium text-white">
                        Hot Streak
                      </div>
                      <div className="text-xs text-white/70">5 in a row</div>
                    </div>

                    <div
                      className={`p-4 rounded-xl text-center transition-all duration-300 ${
                        stats.accuracyRate >= 90
                          ? "bg-gradient-to-br from-green-400/30 to-emerald-600/30 border-2 border-green-400/60"
                          : "bg-white/5 border border-white/10"
                      }`}
                    >
                      <div className="text-2xl mb-1">🎯</div>
                      <div className="text-sm font-medium text-white">
                        Sharp Shooter
                      </div>
                      <div className="text-xs text-white/70">90% accuracy</div>
                    </div>

                    <div
                      className={`p-4 rounded-xl text-center transition-all duration-300 ${
                        stats.totalWords >= 20
                          ? "bg-gradient-to-br from-blue-400/30 to-purple-600/30 border-2 border-blue-400/60"
                          : "bg-white/5 border border-white/10"
                      }`}
                    >
                      <div className="text-2xl mb-1">📚</div>
                      <div className="text-sm font-medium text-white">
                        Word Master
                      </div>
                      <div className="text-xs text-white/70">20 words read</div>
                    </div>

                    <div
                      className={`p-4 rounded-xl text-center transition-all duration-300 ${
                        bestStreak >= 10
                          ? "bg-gradient-to-br from-purple-400/30 to-pink-600/30 border-2 border-purple-400/60"
                          : "bg-white/5 border border-white/10"
                      }`}
                    >
                      <div className="text-2xl mb-1">👑</div>
                      <div className="text-sm font-medium text-white">
                        Champion
                      </div>
                      <div className="text-xs text-white/70">
                        10 streak record
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          // Show summary screen
          <div className="mb-8">
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl text-center">
              <div className="text-6xl mb-4">{gameCompleted ? "🎉" : "📊"}</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {gameCompleted ? "Congratulations!" : "Game Summary"}
              </h2>
              <p className="text-lg sm:text-xl text-white/80 mb-6">
                {gameCompleted
                  ? `You've completed the ${selectedClass} Word Reading Challenge!`
                  : `Here's your performance summary for ${selectedClass}`}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl p-4">
                  <div className="text-2xl sm:text-3xl font-bold text-green-400">
                    {score}
                  </div>
                  <div className="text-sm text-white/70">Words Found</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-xl p-4">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-400">
                    {Math.round(stats.accuracyRate) || 0}%
                  </div>
                  <div className="text-sm text-white/70">Accuracy</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-600/20 rounded-xl p-4">
                  <div className="text-2xl sm:text-3xl font-bold text-yellow-400">
                    {bestStreak}
                  </div>
                  <div className="text-sm text-white/70">Best Streak</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl p-4">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-400">
                    {Math.round(timeTracking.totalSessionTime / 1000)}s
                  </div>
                  <div className="text-sm text-white/70">Total Time</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-xl p-4 border border-cyan-400/20">
                  <h4 className="text-lg font-semibold text-cyan-400 mb-3">
                    Performance Breakdown
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/70">Words Attempted:</span>
                      <span className="text-white font-medium">
                        {stats.totalWords || completedWordsCount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Correct Answers:</span>
                      <span className="text-green-400 font-medium">
                        {stats.correctWords || score}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Wrong Answers:</span>
                      <span className="text-red-400 font-medium">
                        {(stats.totalWords || completedWordsCount) -
                          (stats.correctWords || score)}
                      </span>
                    </div>
                    {stats.averageTimePerWord > 0 && (
                      <div className="flex justify-between">
                        <span className="text-white/70">Avg Time/Word:</span>
                        <span className="text-purple-400 font-medium">
                          {Math.round(stats.averageTimePerWord / 1000)}s
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-xl p-4 border border-green-400/20">
                  <h4 className="text-lg font-semibold text-green-400 mb-3">
                    Achievement Status
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Hot Streak (5+):</span>
                      <span
                        className={
                          streak >= 5 ? "text-yellow-400" : "text-white/50"
                        }
                      >
                        {streak >= 5 ? "🔥 Achieved!" : "❌ Not reached"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">
                        Sharp Shooter (90%+):
                      </span>
                      <span
                        className={
                          stats.accuracyRate >= 90
                            ? "text-green-400"
                            : "text-white/50"
                        }
                      >
                        {stats.accuracyRate >= 90
                          ? "🎯 Achieved!"
                          : "❌ Not reached"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Word Master (20+):</span>
                      <span
                        className={
                          stats.totalWords >= 20
                            ? "text-blue-400"
                            : "text-white/50"
                        }
                      >
                        {stats.totalWords >= 20
                          ? "📚 Achieved!"
                          : "❌ Not reached"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">
                        Champion (10+ streak):
                      </span>
                      <span
                        className={
                          bestStreak >= 10 ? "text-purple-400" : "text-white/50"
                        }
                      >
                        {bestStreak >= 10 ? "👑 Achieved!" : "❌ Not reached"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-xl p-4 border border-indigo-400/30 mb-6">
                <h4 className="text-lg font-semibold text-indigo-300 mb-2">
                  Learning Progress
                </h4>
                <p className="text-indigo-100/80 text-sm">
                  {stats.accuracyRate >= 90
                    ? "Excellent work! Your reading and listening skills are developing beautifully. Keep up the great practice!"
                    : stats.accuracyRate >= 70
                    ? "Good progress! With more practice, you'll master these words. Try focusing on listening carefully to each word."
                    : "Keep practicing! Reading and listening skills take time to develop. Each attempt makes you stronger!"}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={resetGame}
                  className="px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-2xl shadow-cyan-500/30 flex items-center gap-2 justify-center"
                >
                  <RotateCcw className="w-5 h-5" />
                  Play Again
                </button>

                <button
                  onClick={() => {
                    resetGame();
                    setShowInstructions(true);
                  }}
                  className="px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-2xl shadow-purple-500/30 flex items-center gap-2 justify-center"
                >
                  <BookOpen className="w-5 h-5" />
                  Change Level
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordReadingChallenge;