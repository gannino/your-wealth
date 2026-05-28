import { useNavigate } from 'react-router-dom';
import { useTrainingStore } from '../../stores';

interface ModuleCard {
  id: string;
  title: string;
  icon: string;
  duration: string;
  description: string;
  route: string;
}

const modules: ModuleCard[] = [
  {
    id: 'module-1-foundation',
    title: 'Module 1: Foundation',
    icon: '🏛️',
    duration: '12-15 min',
    description: 'Master your money psychology and establish your financial baseline. Uncover the 80/20 principle and your personal money story.',
    route: '/training/module-1-foundation',
  },
  {
    id: 'module-2-mythbusting',
    title: 'Module 2: Myth-Busting',
    icon: '💡',
    duration: '12-15 min',
    description: 'Shatter the 9 financial myths that destroy wealth. Understand hidden fees and the power of index funds.',
    route: '/training/module-2-mythbusting',
  },
  {
    id: 'module-3-strategy',
    title: 'Module 3: Strategy',
    icon: '♟️',
    duration: '15-18 min',
    description: 'Master asset allocation and core investment principles. Learn the Three-Bucket system and Core Four approach.',
    route: '/training/module-3-strategy',
  },
  {
    id: 'module-4-execution',
    title: 'Module 4: Execution',
    icon: '🎯',
    duration: '12-15 min',
    description: 'Select investments and advisors wisely. Learn to distinguish brokers from fiduciaries and ask the right questions.',
    route: '/training/module-4-execution',
  },
  {
    id: 'module-5-mastery',
    title: 'Module 5: Mastery',
    icon: '🏆',
    duration: '10-12 min',
    description: 'Navigate market volatility and master long-term psychology. Learn the Seven Freedom Facts and bear market strategies.',
    route: '/training/module-5-mastery',
  },
];

export default function TrainingHub() {
  const navigate = useNavigate();
  const { moduleProgress, isModuleComplete } = useTrainingStore();

  const getModuleStatus = (moduleId: string) => {
    const completed = isModuleComplete(moduleId);
    if (completed) return 'complete';
    const progress = moduleProgress[moduleId];
    return progress?.percentComplete && progress.percentComplete > 0 ? 'in-progress' : 'not-started';
  };

  const getModuleProgress = (moduleId: string) => {
    return moduleProgress[moduleId]?.percentComplete || 0;
  };

  const completedCount = modules.filter(m => isModuleComplete(m.id)).length;

  const handleModuleClick = (module: ModuleCard) => {
    navigate(module.route);
  };

  const handleBeginAssessments = () => {
    navigate('/psychology/mindset-assessment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Training Center
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Build your foundation before assessments
          </p>
          {completedCount > 0 && (
            <p className="text-primary-teal font-semibold">
              {completedCount} of {modules.length} modules complete
            </p>
          )}
        </div>

        {/* Why Train Section */}
        <div className="bg-dark-surface border border-dark-border rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Why Complete Training?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Accurate Results</h3>
                <p className="text-gray-400 text-sm">
                  Understanding key concepts leads to more accurate self-assessment
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Better Decisions</h3>
                <p className="text-gray-400 text-sm">
                  Learn proven principles that guide successful financial planning
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Faster Progress</h3>
                <p className="text-gray-400 text-sm">
                  Build the mental framework that accelerates your wealth journey
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {modules.map((module) => {
            const status = getModuleStatus(module.id);
            const progress = getModuleProgress(module.id);
            const isComplete = status === 'complete';
            const isInProgress = status === 'in-progress';

            return (
              <div
                key={module.id}
                className={`bg-dark-surface border-2 rounded-lg p-6 transition-all cursor-pointer hover:border-primary-teal ${
                  isComplete ? 'border-green-400/50' : 'border-dark-border'
                }`}
                onClick={() => handleModuleClick(module)}
              >
                {/* Icon and Title */}
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-3xl shrink-0">{module.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-white leading-tight mb-1">{module.title}</h3>
                    <p className="text-gray-400 text-sm">{module.duration}</p>
                  </div>
                  {isComplete && (
                    <span className="text-green-400 text-xl shrink-0 mt-1">✓</span>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4">{module.description}</p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-dark-bg rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isComplete ? 'bg-green-400' : 'bg-primary-teal'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-semibold ${
                    isComplete ? 'text-green-400' : isInProgress ? 'text-yellow-400' : 'text-gray-400'
                  }`}>
                    {isComplete ? 'Complete' : isInProgress ? 'In Progress' : 'Not Started'}
                  </span>
                  <span className="text-primary-teal text-sm font-semibold">
                    {isComplete ? 'Review' : isInProgress ? 'Continue' : 'Start'} →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <p className="text-gray-300">
              {completedCount === 0
                ? 'Training is optional but recommended for best results.'
                : completedCount < modules.length
                ? `${modules.length - completedCount} module${modules.length - completedCount > 1 ? 's' : ''} remaining.`
                : 'All training modules complete! Ready for assessments.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 rounded-lg border border-dark-border text-gray-300 hover:border-gray-500 hover:text-white transition-colors font-semibold"
              >
                Back to Home
              </button>
              <button
                onClick={handleBeginAssessments}
                className="px-6 py-3 rounded-lg bg-primary-teal hover:bg-teal-600 text-white font-semibold transition-colors"
              >
                Begin Assessments →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
