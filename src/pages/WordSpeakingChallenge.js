import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Volume2, Play, Pause, RotateCcw, CheckCircle, 
  XCircle, BookOpen, Users, GraduationCap, Clock, Timer, 
  BarChart3, Target, Brain, Trophy
} from 'lucide-react';

// Enhanced Time Tracking Hook (from DictationMaster)
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
      setWordTimes(prev => [...prev, {
        wordIndex,
        time: wordTime,
        isCorrect,
        timestamp: new Date().toISOString()
      }]);
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
    if (wordTimes.length === 0) return {
      averageTimePerWord: 0,
      fastestWord: 0,
      slowestWord: 0,
      accuracyRate: 0,
      totalWords: 0,
      correctWords: 0
    };

    const times = wordTimes.map(w => w.time);
    const correctWords = wordTimes.filter(w => w.isCorrect).length;
    return {
      averageTimePerWord: times.reduce((a, b) => a + b, 0) / times.length,
      fastestWord: Math.min(...times),
      slowestWord: Math.max(...times),
      accuracyRate: (correctWords / wordTimes.length) * 100,
      totalWords: wordTimes.length,
      correctWords
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
    getStats
  };
};

// Time Display Component
const TimeDisplay = ({ time, label, className = "" }) => {
  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
    }
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className={`text-center ${className}`}>
      <div className="text-2xl font-bold text-white">{formatTime(time)}</div>
      <div className="text-sm text-white/70">{label}</div>
    </div>
  );
};

// Word pronunciation checker function
function areWordsEquivalent(expected, actual) {
  const normalize = (str) => str.toLowerCase().trim().replace(/[^\w]/g, '');
  return normalize(expected) === normalize(actual);
}

// Word Card Component for Grid
const WordCard = ({ 
  word, 
  isActive, 
  isCompleted, 
  isCorrect, 
  isWrong, 
  onClick,
  difficulty,
  index
}) => {
  const getCardStyle = () => {
    if (isCompleted && isCorrect) return 'bg-gradient-to-br from-green-400/30 to-emerald-600/30 border-green-400/60 text-green-100 shadow-green-500/30';
    if (isCompleted && isWrong) return 'bg-gradient-to-br from-red-400/30 to-pink-600/30 border-red-400/60 text-red-100 shadow-red-500/30';
    if (isActive) return 'bg-gradient-to-br from-yellow-400/30 to-orange-600/30 border-yellow-400/60 text-yellow-100 shadow-yellow-500/30 animate-pulse';
    return 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 text-white/60';
  };

  const getDifficultySize = () => {
    switch (difficulty) {
      case 'Easy': return 'text-lg md:text-xl';
      case 'Medium': return 'text-base md:text-lg';
      case 'Hard': return 'text-sm md:text-base';
      default: return 'text-lg md:text-xl';
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`
        relative p-4 rounded-2xl border-2 transition-all duration-300 transform
        ${isActive ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
        backdrop-blur-lg shadow-xl
        ${getCardStyle()}
      `}
      style={{ minHeight: '80px' }}
    >
      <div className={`font-bold text-center ${getDifficultySize()}`}>
        {word}
      </div>
      
      {isCompleted && isCorrect && (
        <div className="absolute -top-2 -right-2">
          <CheckCircle className="w-6 h-6 text-green-400 bg-white rounded-full" />
        </div>
      )}
      
      {isCompleted && isWrong && (
        <div className="absolute -top-2 -right-2">
          <XCircle className="w-6 h-6 text-red-400 bg-white rounded-full" />
        </div>
      )}
      
      {isActive && (
        <div className="absolute -top-2 -right-2">
          <div className="w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
        </div>
      )}
      
      <div className="absolute top-1 left-1 text-xs text-white/50 font-medium">
        #{index + 1}
      </div>
    </div>
  );
};

// Main Word Speaking Challenge Component
const WordSpeakingChallenge = () => {
  // Word sets for different difficulty levels
  const wordSets = {
    'Class I-II': {
      words: [
        'cat', 'dog', 'sun', 'run', 'big', 'red', 'hat', 'bat', 'map', 'cup',
        'pen', 'bag', 'sit', 'top', 'box', 'fox', 'egg', 'leg', 'net', 'wet',
        'bus', 'fun', 'gun', 'hut', 'jam', 'kit', 'log', 'mom', 'nap', 'owl'
      ],
      difficulty: 'Easy',
      gridSize: { cols: 5, rows: 6 }
    },
    'Class III-V': {
      words: [
        'school', 'friend', 'family', 'happy', 'garden', 'student', 'teacher', 'library',
        'science', 'history', 'english', 'drawing', 'painting', 'reading', 'writing',
        'computer', 'kitchen', 'bedroom', 'bathroom', 'morning', 'evening', 'chicken',
        'elephant', 'giraffe', 'butterfly', 'mountain', 'rainbow', 'thunder', 'lightning'
      ],
      difficulty: 'Medium',
      gridSize: { cols: 5, rows: 6 }
    },
    'Class VI-X': {
      words: [
        'imagination', 'responsibility', 'environment', 'technology', 'development',
        'communication', 'independence', 'opportunity', 'achievement', 'literature',
        'mathematics', 'geography', 'democracy', 'philosophy', 'psychology',
        'architecture', 'photography', 'archaeology', 'astronomy', 'biology',
        'chemistry', 'economics', 'sociology', 'anthropology', 'encyclopedia',
        'extraordinary', 'consciousness', 'appreciation', 'sophisticated', 'magnificent'
      ],
      difficulty: 'Hard',
      gridSize: { cols: 5, rows: 6 }
    }
  };

  // Game state
  const [selectedClass, setSelectedClass] = useState('Class I-II');
  const [currentWords, setCurrentWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [completedWords, setCompletedWords] = useState({});
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isAutoListening, setIsAutoListening] = useState(false);

  // Speech recognition refs
  const recognition = useRef(null);
  const speechSynthesis = useRef(window.speechSynthesis);
  const silenceTimer = useRef(null);
  const timeTracking = useTimeTracking();
  const [currentWordTime, setCurrentWordTime] = useState(0);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = (event) => {
        let finalTranscript = '';
        let interim = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interim += transcript + ' ';
          }
        }

        if (finalTranscript.trim()) {
          setUserAnswer(finalTranscript.trim());
          setInterimTranscript('');
          checkPronunciation(finalTranscript.trim());
        } else {
          setInterimTranscript(interim.trim());
        }
      };

      recognition.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        if (isAutoListening) {
          // Restart recognition if in auto mode
          setTimeout(() => {
            if (recognition.current && !gameCompleted) {
              try {
                recognition.current.start();
              } catch (e) {
                console.warn('Could not restart recognition');
              }
            }
          }, 1000);
        }
      };

      recognition.current.onend = () => {
        if (isAutoListening && !gameCompleted) {
          // Automatically restart recognition for continuous listening
          setTimeout(() => {
            if (recognition.current) {
              try {
                recognition.current.start();
              } catch (e) {
                console.warn('Could not restart recognition');
              }
            }
          }, 100);
        }
      };
    }

    return () => {
      if (recognition.current) recognition.current.stop();
      clearTimeout(silenceTimer.current);
      if (speechSynthesis.current) speechSynthesis.current.cancel();
    };
  }, [isAutoListening, gameCompleted]);

  // Initialize game
  useEffect(() => {
    resetGame();
  }, [selectedClass]);

  // Current word timer
  useEffect(() => {
    let interval;
    if (timeTracking.currentWordStartTime && timeTracking.isActive && !timeTracking.isPaused) {
      interval = setInterval(() => {
        setCurrentWordTime(Date.now() - timeTracking.currentWordStartTime);
      }, 1000);
    } else {
      setCurrentWordTime(0);
    }
    return () => clearInterval(interval);
  }, [timeTracking.currentWordStartTime, timeTracking.isActive, timeTracking.isPaused]);

  const resetGame = () => {
    const words = [...wordSets[selectedClass].words];
    const shuffled = words.sort(() => Math.random() - 0.5);
    setCurrentWords(shuffled.slice(0, wordSets[selectedClass].gridSize.cols * wordSets[selectedClass].gridSize.rows));
    setCurrentWordIndex(0);
    setCompletedWords({});
    setScore(0);
    setGameStarted(false);
    setGameCompleted(false);
    setUserAnswer('');
    setInterimTranscript('');
    setIsListening(false);
    setIsAutoListening(false);
    timeTracking.resetTracking();
    if (recognition.current) recognition.current.stop();
  };

  const startGame = () => {
    setGameStarted(true);
    setIsAutoListening(true);
    timeTracking.startSession();
    timeTracking.startWordTimer(0);
    
    // Start continuous listening
    if (recognition.current) {
      try {
        recognition.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Could not start recognition');
      }
    }
  };

  const checkPronunciation = (spokenWord) => {
    if (currentWordIndex >= currentWords.length) return;
    
    const expectedWord = currentWords[currentWordIndex];
    const isCorrect = areWordsEquivalent(expectedWord, spokenWord);
    
    setCompletedWords(prev => ({
      ...prev,
      [currentWordIndex]: { correct: isCorrect, spokenWord }
    }));

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    timeTracking.endWordTimer(currentWordIndex, isCorrect);
    
    // Auto-advance immediately to next word
    setTimeout(() => {
      nextWord();
    }, 500);
  };

  const nextWord = () => {
    if (currentWordIndex < currentWords.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setUserAnswer('');
      setInterimTranscript('');
      timeTracking.startWordTimer(currentWordIndex + 1);
    } else {
      // Game completed
      setGameCompleted(true);
      setIsAutoListening(false);
      setIsListening(false);
      timeTracking.endSession();
      if (recognition.current) recognition.current.stop();
    }
  };

  const skipWord = () => {
    setCompletedWords(prev => ({
      ...prev,
      [currentWordIndex]: { correct: false, spokenWord: 'skipped' }
    }));
    timeTracking.endWordTimer(currentWordIndex, false);
    nextWord();
  };

  const playWordPronunciation = (word) => {
    if (speechSynthesis.current) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = selectedClass === 'Class I-II' ? 0.8 : selectedClass === 'Class III-V' ? 0.9 : 1.0;
      utterance.lang = 'en-US';
      speechSynthesis.current.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (isAutoListening) {
      setIsAutoListening(false);
      setIsListening(false);
      if (recognition.current) recognition.current.stop();
    } else {
      setIsAutoListening(true);
      setIsListening(true);
      if (recognition.current) {
        try {
          recognition.current.start();
        } catch (e) {
          console.warn('Could not start recognition');
        }
      }
    }
  };

  const getClassIcon = (classLevel) => {
    switch (classLevel) {
      case 'Class I-II': return <BookOpen className="w-5 h-5" />;
      case 'Class III-V': return <Users className="w-5 h-5" />;
      case 'Class VI-X': return <GraduationCap className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const stats = timeTracking.getStats();
  const currentWord = gameStarted && !gameCompleted ? currentWords[currentWordIndex] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-red-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-2xl">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              Word Speaking Challenge
            </span>
          </h1>
          <p className="text-xl text-white/80 drop-shadow-lg">
            Speak Each Word - Typing Test Style!
          </p>
        </div>

        {/* Class Selection */}
        {!gameStarted && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4 text-center">
              Select Your Class Level
            </h2>
            <div className="flex justify-center gap-4 flex-wrap">
              {Object.keys(wordSets).map((classLevel) => (
                <button
                  key={classLevel}
                  onClick={() => setSelectedClass(classLevel)}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-lg border flex items-center gap-2 ${
                    selectedClass === classLevel
                      ? 'bg-white/20 border-white/40 text-white shadow-2xl shadow-white/20'
                      : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/15'
                  }`}
                >
                  {getClassIcon(classLevel)}
                  {classLevel}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Game Header with Controls */}
        {gameStarted && !gameCompleted && (
          <div className="mb-8">
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
              <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                
                {/* Timer and Stats Section */}
                <div className="flex flex-col lg:flex-row gap-6 items-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-400">
                      {Math.floor(timeTracking.totalSessionTime / 60000)}:
                      {Math.floor((timeTracking.totalSessionTime % 60000) / 1000).toString().padStart(2, '0')}
                    </div>
                    <div className="text-sm text-white/70">Total Time</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">{score}</div>
                    <div className="text-sm text-white/70">Correct</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">{Math.round(stats.accuracyRate) || 0}%</div>
                    <div className="text-sm text-white/70">Accuracy</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400">{currentWordIndex + 1}/{currentWords.length}</div>
                    <div className="text-sm text-white/70">Progress</div>
                  </div>
                </div>

                {/* Game Controls */}
                <div className="flex flex-col lg:flex-row gap-3">
                  {/* Mic Control */}
                  <button
                    onClick={toggleListening}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                      isAutoListening
                        ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/30'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                    }`}
                  >
                    {isAutoListening ? (
                      <>
                        <MicOff className="w-5 h-5" />
                        Stop Mic
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5" />
                        Start Mic
                      </>
                    )}
                  </button>

                  {/* Hear Word */}
                  <button
                    onClick={() => currentWord && playWordPronunciation(currentWord)}
                    className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 flex items-center gap-2"
                  >
                    <Volume2 className="w-5 h-5" />
                    Hear Word
                  </button>

                  {/* Pause/Resume */}
                  <button
                    onClick={timeTracking.togglePause}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                      timeTracking.isPaused
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                        : 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg shadow-yellow-500/30'
                    }`}
                  >
                    {timeTracking.isPaused ? (
                      <>
                        <Play className="w-5 h-5" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause className="w-5 h-5" />
                        Pause
                      </>
                    )}
                  </button>

                  {/* Skip Word */}
                  <button
                    onClick={skipWord}
                    className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/30 flex items-center gap-2"
                  >
                    <Target className="w-5 h-5" />
                    Skip
                  </button>

                  {/* End Game */}
                  <button
                    onClick={() => {
                      setGameCompleted(true);
                      setIsAutoListening(false);
                      setIsListening(false);
                      timeTracking.endSession();
                      if (recognition.current) recognition.current.stop();
                    }}
                    className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/30 flex items-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    End Game
                  </button>

                  {/* Main Menu */}
                  <button
                    onClick={() => {
                      setGameStarted(false);
                      setGameCompleted(false);
                      setIsAutoListening(false);
                      setIsListening(false);
                      timeTracking.resetTracking();
                      if (recognition.current) recognition.current.stop();
                    }}
                    className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Main Menu
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {gameStarted && !gameCompleted && (
          <div className="mb-8">
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white font-semibold">Progress</span>
                <span className="text-white/80">{currentWordIndex + 1} / {currentWords.length}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-blue-600 h-3 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${((currentWordIndex + 1) / currentWords.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Current Word Display */}
        {gameStarted && !gameCompleted && currentWord && (
          <div className="mb-8">
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 border border-white/20 shadow-2xl text-center">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Current Word:
              </h3>
              <div className="text-6xl font-bold text-cyan-400 mb-6">
                {currentWord}
              </div>
              
              {/* Speech Recognition Feedback */}
              {isListening && (
                <div className="mb-4">
                  <p className="text-cyan-400 font-semibold animate-pulse flex items-center justify-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                    </span>
                    Listening... Say "{currentWord}"
                  </p>
                  {interimTranscript && (
                    <p className="mt-2 text-lg text-cyan-200">
                      "{interimTranscript}"
                    </p>
                  )}
                </div>
              )}

              {!isListening && (
                <p className="text-white/60">Start listening to begin speaking words</p>
              )}
            </div>
          </div>
        )}

        {/* Word Grid Display */}
        {gameStarted && (
          <div className="mb-8">
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
              <h3 className="text-xl font-semibold text-white mb-4 text-center">Word Grid Progress</h3>
              <div className="grid grid-cols-5 gap-4">
                {currentWords.map((word, index) => (
                  <WordCard
                    key={`${word}-${index}`}
                    word={word}
                    isActive={index === currentWordIndex && !gameCompleted}
                    isCompleted={completedWords[index] !== undefined}
                    isCorrect={completedWords[index]?.correct}
                    isWrong={completedWords[index] && !completedWords[index]?.correct}
                    onClick={() => playWordPronunciation(word)}
                    difficulty={wordSets[selectedClass].difficulty}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Start Game Button */}
        {!gameStarted && !gameCompleted && (
          <div className="text-center mb-8">
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 border border-white/20 shadow-2xl mb-8">
              <h3 className="text-2xl font-semibold text-white mb-4 flex items-center justify-center gap-2">
                <Target className="w-6 h-6" /> Ready to Start?
              </h3>
              <p className="text-white/80 mb-6">
                You'll speak each word one by one through the grid. Just like a typing test, but with your voice!
              </p>
              <button
                onClick={startGame}
                className="px-12 py-4 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-110 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-2xl shadow-green-500/30 flex items-center gap-3 mx-auto"
              >
                <Play className="w-6 h-6" />
                Start Speaking Challenge
              </button>
            </div>
          </div>
        )}

        {/* Game Completed */}
        {gameCompleted && (
          <div className="text-center mb-8">
            <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-8 border border-white/20 shadow-2xl">
              <h3 className="text-4xl font-bold text-white mb-6 flex items-center justify-center gap-3">
                <Trophy className="w-10 h-10 text-yellow-400" />
                Challenge Complete!
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">{score}</div>
                  <div className="text-lg text-white/80">Words Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400 mb-2">{Math.round(stats.accuracyRate)}%</div>
                  <div className="text-lg text-white/80">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-400 mb-2">
                    {Math.round(timeTracking.totalSessionTime / 1000)}s
                  </div>
                  <div className="text-lg text-white/80">Total Time</div>
                </div>
              </div>

              {stats.averageTimePerWord > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400 mb-2">
                      {(stats.averageTimePerWord / 1000).toFixed(1)}s
                    </div>
                    <div className="text-white/80">Avg Time per Word</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400 mb-2">
                      {(stats.fastestWord / 1000).toFixed(1)}s
                    </div>
                    <div className="text-white/80">Fastest Word</div>
                  </div>
                </div>
              )}

              <div className="flex justify-center gap-4 flex-wrap">
                <button
                  onClick={resetGame}
                  className="px-8 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-2xl shadow-blue-500/30 flex items-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Try Again
                </button>
                <button
                  onClick={() => {
                    setGameStarted(false);
                    setGameCompleted(false);
                    timeTracking.resetTracking();
                  }}
                  className="px-8 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-2xl shadow-indigo-500/30 flex items-center gap-2"
                >
                  <BookOpen className="w-5 h-5" />
                  Main Menu
                </button>
                <button
                  onClick={() => {
                    resetGame();
                    setSelectedClass(selectedClass === 'Class I-II' ? 'Class III-V' : selectedClass === 'Class III-V' ? 'Class VI-X' : 'Class I-II');
                  }}
                  className="px-8 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-2xl shadow-green-500/30 flex items-center gap-2"
                >
                  <Brain className="w-5 h-5" />
                  Next Level
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!gameStarted && (
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 shadow-2xl">
            <h3 className="text-xl font-semibold text-white mb-4 text-center">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-3">
                  <span className="text-white font-bold">1</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Start Challenge</h4>
                <p className="text-white/70 text-sm">Click start and microphone will begin listening continuously</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-3">
                  <span className="text-white font-bold">2</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Speak Words</h4>
                <p className="text-white/70 text-sm">Say each highlighted word clearly, one by one through the grid</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mb-3">
                  <span className="text-white font-bold">3</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Auto Progress</h4>
                <p className="text-white/70 text-sm">Game automatically moves to next word when you speak correctly</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordSpeakingChallenge;