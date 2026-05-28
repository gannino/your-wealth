/**
 * Progress Dashboard Component
 *
 * Shows user's progress across all 5 training modules
 * Displays completion status, achievements, and personalized recommendations
 */

import { useTrainingStore } from '../../../stores/trainingStore';
import {
  getOverallTrainingProgress,
  calculateTrainingScore,
  generateModuleBasedTips,
} from '../../../lib/assessments/enhancedScoring';

const MODULE_INFO: Record<string, { title: string; icon: string; description: string }> = {
  'module-1-foundation': {
    title: 'Module 1: Foundation',
    icon: '🏛️',
    description: 'Money psychology and financial baseline',
  },
  'module-2-mythbusting': {
    title: 'Module 2: Myth-Busting',
    icon: '💡',
    description: 'Fees, myths, and index funds',
  },
  'module-3-strategy': {
    title: 'Module 3: Strategy',
    icon: '♟️',
    description: 'Asset allocation and principles',
  },
  'module-4-execution': {
    title: 'Module 4: Execution',
    icon: '🎯',
    description: 'Investments and advisors',
  },
  'module-5-mastery': {
    title: 'Module 5: Mastery',
    icon: '🏆',
    description: 'Bear markets and long-term psychology',
  },
};

const ACHIEVEMENTS: Record<string, { title: string; icon: string; requirement: string }> = {
  'first-module': {
    title: 'Quick Learner',
    icon: '⚡',
    requirement: 'Complete your first module',
  },
  'half-complete': {
    title: 'Halfway There',
    icon: '📊',
    requirement: 'Complete 3 out of 5 modules',
  },
  'all-complete': {
    title: 'Your Wealth Graduate',
    icon: '🎓',
    requirement: 'Complete all 5 training modules',
  },
  'perfect-quiz': {
    title: 'Knowledge Master',
    icon: '🧠',
    requirement: 'Score 100% on any module quiz',
  },
};

export default function ProgressDashboard() {
  const { moduleProgress, isModuleComplete, achievements } = useTrainingStore();
  const overallProgress = getOverallTrainingProgress();
  const trainingScore = calculateTrainingScore();
  const tips = generateModuleBasedTips();

  const completedModules = Object.keys(MODULE_INFO).filter(m => isModuleComplete(m));
  const earnedBadges = achievements.map((a) => a.badge);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Your Training Progress
          </h1>
          <p className="text-xl text-gray-300">
            Track your journey to financial mastery
          </p>
        </div>

        {/* Overall Progress Card */}
        <div className="bg-dark-surface border border-dark-border rounded-lg p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Modules Complete</p>
              <p className="text-5xl font-bold text-primary-teal">
                {completedModules.length}/5
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Overall Progress</p>
              <div className="relative pt-2">
                <div className="w-full bg-dark-bg rounded-full h-4">
                  <div
                    className="bg-primary-teal h-4 rounded-full transition-all"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
                <p className="text-2xl font-bold text-white mt-2">
                  {overallProgress}%
                </p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">Training Score</p>
              <p className="text-5xl font-bold text-green-400">
                {trainingScore}
              </p>
            </div>
          </div>
        </div>

        {/* Module Progress */}
        <div className="bg-dark-surface border border-dark-border rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Module Progress</h2>
          <div className="space-y-4">
            {Object.entries(MODULE_INFO).map(([moduleId, info]) => {
              const progress = moduleProgress[moduleId];
              const isComplete = isModuleComplete(moduleId);
              const percentComplete = progress?.percentComplete || 0;

              return (
                <div
                  key={moduleId}
                  className={`border-2 rounded-lg p-4 transition-all ${
                    isComplete
                      ? 'border-green-400/50 bg-green-400/5'
                      : percentComplete > 0
                      ? 'border-yellow-400/50 bg-yellow-400/5'
                      : 'border-dark-border'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{info.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-white">{info.title}</h3>
                        {isComplete && (
                          <span className="text-green-400 text-sm">✓ Complete</span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-2">{info.description}</p>
                      <div className="w-full bg-dark-bg rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            isComplete
                              ? 'bg-green-400'
                              : 'bg-primary-teal'
                          }`}
                          style={{ width: `${percentComplete}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {percentComplete}% complete
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-dark-surface border border-dark-border rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(ACHIEVEMENTS).map(([key, achievement]) => {
              const isEarned = earnedBadges.includes(key);

              return (
                <div
                  key={key}
                  className={`p-4 rounded-lg border text-center ${
                    isEarned
                      ? 'border-yellow-400/50 bg-yellow-400/10'
                      : 'border-dark-border opacity-50'
                  }`}
                >
                  <span className="text-4xl block mb-2">{achievement.icon}</span>
                  <h3 className={`font-bold mb-1 ${isEarned ? 'text-yellow-400' : 'text-gray-500'}`}>
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-gray-400">{achievement.requirement}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Personalized Tips */}
        {tips.length > 0 && (
          <div className="bg-dark-surface border border-dark-border rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Personalized Tips</h2>
            <ul className="space-y-3">
              {tips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary-teal mt-1">💡</span>
                  <p className="text-gray-300 flex-1">{tip}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Continue Learning CTA */}
        {completedModules.length < 5 && (
          <div className="bg-gradient-to-r from-primary-teal/20 to-teal-600/20 border border-primary-teal/50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Continue Your Journey
            </h3>
            <p className="text-gray-300 mb-6">
              {completedModules.length === 0
                ? 'Start with Module 1 to build your foundation'
                : completedModules.length < 5
                ? `Complete ${5 - completedModules.length} more module${5 - completedModules.length > 1 ? 's' : ''} to graduate`
                : 'All modules complete! Ready for assessments.'}
            </p>
            <a
              href="/training/hub"
              className="inline-block px-8 py-3 rounded-lg bg-primary-teal hover:bg-teal-600 text-white font-semibold transition-colors"
            >
              Go to Training Hub →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
