import { motion } from 'motion/react';
import { AlertTriangle, Heart, CheckCircle, Info, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface AnalysisResult {
  analysis: {
    grade: string;
    confidence: number;
    health_impact: string;
  };
  risks: {
    risk_words: string[];
    severity: string;
  };
  allergens: {
    detected: string[];
  };
  usage: {
    daily_recommendation: string;
  };
  personalized: {
    conditions: string[];
    advice: string[];
  };
  recommendations: string[];
  extracted_text?: string;
}

interface ResultProps {
  result: AnalysisResult;
  onReset: () => void;
}

export default function Result({ result, onReset }: ResultProps) {
  const [showText, setShowText] = useState(false);

  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      A: 'from-green-500 to-emerald-600',
      B: 'from-lime-500 to-green-600',
      C: 'from-yellow-500 to-orange-500',
      D: 'from-orange-500 to-red-500',
      E: 'from-red-500 to-rose-600',
    };
    return colors[grade] || colors.C;
  };

  const getGradePercentage = (grade: string) => {
    const percentages: Record<string, number> = {
      A: 90,
      B: 75,
      C: 60,
      D: 40,
      E: 20,
    };
    return percentages[grade] || 50;
  };

  const getSeverityColor = (severity: string) => {
    if (severity === 'high') return 'bg-red-500';
    if (severity === 'medium') return 'bg-orange-500';
    return 'bg-yellow-500';
  };

  const gradePercentage = getGradePercentage(result.analysis.grade);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-6xl mx-auto space-y-6"
    >
      {/* Header with Reset Button */}
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-white dark:hover:bg-slate-800 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Scan Again
        </motion.button>
      </div>

      {/* Grade Circle & Usage Bar */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Circular Grade Meter */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-slate-200 dark:border-slate-700 p-8"
        >
          <h3 className="mb-6 text-slate-900 dark:text-white">Health Score</h3>
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-slate-200 dark:text-slate-700"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 553 }}
                  animate={{ strokeDashoffset: 553 - (553 * gradePercentage) / 100 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  style={{ strokeDasharray: 553 }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" className={`bg-gradient-to-r ${getGradeColor(result.analysis.grade)}`} stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-6xl font-bold bg-gradient-to-r ${getGradeColor(result.analysis.grade)} bg-clip-text text-transparent`}>
                  {result.analysis.grade}
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {Math.round(result.analysis.confidence * 100)}% confidence
                </span>
              </div>
            </div>
            <p className="mt-6 text-center text-slate-700 dark:text-slate-300">
              {result.analysis.health_impact}
            </p>
          </div>
        </motion.div>

        {/* Daily Usage Meter */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-slate-200 dark:border-slate-700 p-8"
        >
          <h3 className="mb-6 text-slate-900 dark:text-white">Daily Usage</h3>
          <div className="flex flex-col justify-center h-[calc(100%-3rem)]">
            <div className="text-center mb-4">
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                {result.usage.daily_recommendation}
              </p>
            </div>
            <div className="relative h-8 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${gradePercentage}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className={`h-full bg-gradient-to-r ${getGradeColor(result.analysis.grade)} rounded-full`}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-600 dark:text-slate-400">
              <span>Avoid</span>
              <span>Moderate</span>
              <span>Safe</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Risks & Allergens */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Risks */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-slate-200 dark:border-slate-700 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h3 className="text-slate-900 dark:text-white">Risk Factors</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.risks.risk_words.length > 0 ? (
              result.risks.risk_words.map((risk, index) => (
                <motion.span
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`px-4 py-2 rounded-2xl ${getSeverityColor(result.risks.severity)} text-white text-sm`}
                >
                  {risk}
                </motion.span>
              ))
            ) : (
              <p className="text-slate-600 dark:text-slate-400">No significant risks detected</p>
            )}
          </div>
        </motion.div>

        {/* Allergens */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-slate-200 dark:border-slate-700 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-red-500" />
            <h3 className="text-slate-900 dark:text-white">Allergens</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.allergens.detected.length > 0 ? (
              result.allergens.detected.map((allergen, index) => (
                <motion.span
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="px-4 py-2 rounded-2xl bg-red-500 text-white text-sm"
                >
                  {allergen}
                </motion.span>
              ))
            ) : (
              <p className="text-green-600 dark:text-green-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                No allergens detected
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="rounded-3xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-slate-200 dark:border-slate-700 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-blue-500" />
            <h3 className="text-slate-900 dark:text-white">Recommendations</h3>
          </div>
          <ul className="space-y-2">
            {result.recommendations.map((rec, index) => (
              <motion.li
                key={index}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-start gap-2 text-slate-700 dark:text-slate-300"
              >
                <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                <span>{rec}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Personalized Advice */}
      {result.personalized.conditions.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="rounded-3xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 backdrop-blur-lg border border-purple-300 dark:border-purple-700 p-6"
        >
          <h3 className="mb-4 text-slate-900 dark:text-white">Personalized for You</h3>
          <div className="mb-3">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Your conditions:</p>
            <div className="flex flex-wrap gap-2">
              {result.personalized.conditions.map((condition, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 text-sm"
                >
                  {condition}
                </span>
              ))}
            </div>
          </div>
          {result.personalized.advice.length > 0 && (
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Advice:</p>
              <ul className="space-y-1">
                {result.personalized.advice.map((advice, index) => (
                  <li key={index} className="text-slate-700 dark:text-slate-300 text-sm">
                    • {advice}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}

      {/* Extracted Text (Collapsible) */}
      {result.extracted_text && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="rounded-3xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          <button
            onClick={() => setShowText(!showText)}
            className="w-full p-6 flex items-center justify-between text-left hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <h3 className="text-slate-900 dark:text-white">Extracted Text</h3>
            {showText ? (
              <ChevronUp className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            )}
          </button>
          {showText && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              className="px-6 pb-6"
            >
              <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono bg-slate-100 dark:bg-slate-900 p-4 rounded-2xl max-h-64 overflow-y-auto">
                {result.extracted_text}
              </pre>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
