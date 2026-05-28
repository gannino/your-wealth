import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePsychologyStore } from '../../stores';

const suggestedCommitments = [
  { commitment: "Save 15% of my income every month", category: "savings" },
  { commitment: "Review my finances every Sunday evening", category: "routine" },
  { commitment: "Read one financial book per month", category: "education" },
  { commitment: "Automate my savings transfers", category: "automation" },
  { commitment: "Track every expense for 30 days", category: "awareness" },
  { commitment: "Pay off my credit card balance in full each month", category: "debt" },
  { commitment: "Invest in my retirement account every paycheck", category: "investing" },
  { commitment: "Review my investment portfolio quarterly", category: "review" },
  { commitment: "Cancel unused subscriptions", category: "savings" },
  { commitment: "Find one way to increase my income this month", category: "income" }
] as const;

export default function ActionCommitment() {
  const navigate = useNavigate();
  const { actionCommitments, addActionCommitment, completeStep } = usePsychologyStore();
  const [customCommitment, setCustomCommitment] = useState('');
  const [customDeadline, setCustomDeadline] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [pendingCommitment, setPendingCommitment] = useState<string | null>(null);
  const [pendingDeadline, setPendingDeadline] = useState('');

  const openDeadlineModal = (commitment: string) => {
    setPendingCommitment(commitment);
    const defaultDeadline = new Date();
    defaultDeadline.setDate(defaultDeadline.getDate() + 30);
    setPendingDeadline(defaultDeadline.toISOString().split('T')[0]);
  };

  const closeDeadlineModal = () => {
    setPendingCommitment(null);
    setPendingDeadline('');
  };

  const confirmPendingCommitment = () => {
    if (pendingCommitment && pendingDeadline) {
      addActionCommitment(pendingCommitment, pendingDeadline);
      closeDeadlineModal();
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
  };

  const handleAddCustom = () => {
    if (customCommitment.trim() && customDeadline) {
      addActionCommitment(customCommitment.trim(), customDeadline);
      setCustomCommitment('');
      setCustomDeadline('');
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
  };

  const handleContinue = () => {
    completeStep(7);
    navigate('/psychology/results');
  };

  const handleBack = () => {
    navigate('/psychology/change-process');
  };

  // Get unique categories in order of first appearance
  const categories = Array.from(
    new Map(
      suggestedCommitments.map(c => [c.category, true])
    ).keys()
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-dark-surface border border-dark-border rounded-lg p-8 mb-6">
          <button
            onClick={handleBack}
            className="text-gray-400 hover:text-white text-sm mb-4 flex items-center gap-2"
          >
            ← Back
          </button>
          <span className="text-primary-teal text-sm font-semibold">STEP 7 OF 7</span>
          <h1 className="text-3xl font-bold text-white mt-2 mb-4">Make Your Action Commitment</h1>
          <p className="text-gray-400 mb-6">
            A commitment without action is just a wish. Choose at least one action you'll take
            in the next 30 days to move toward your financial goals.
          </p>

          {actionCommitments.length > 0 && (
            <div className="bg-primary-teal/10 border border-primary-teal/30 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-primary-teal mb-4">
                Your Commitments ({actionCommitments.length})
              </h3>
              <ul className="space-y-3">
                {actionCommitments.map((ac, i) => (
                  <li key={i} className="flex items-center justify-between bg-dark-bg rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-primary-teal">✓</span>
                      <span className="text-gray-200">{ac.commitment}</span>
                    </div>
                    <span className="text-sm text-gray-400">
                      Due: {new Date(ac.deadline).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Suggested Commitments</h2>
            <p className="text-gray-400 mb-4">Click any commitment to add it to your list:</p>

            {categories.map(category => (
              <div key={category} className="mb-6">
                <h3 className="text-sm font-semibold text-primary-purple uppercase mb-3">
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {suggestedCommitments
                    .filter(c => c.category === category)
                    .map((item, i) => (
                      <button
                        key={i}
                        onClick={() => openDeadlineModal(item.commitment)}
                        className="text-left p-4 bg-dark-bg border border-dark-border hover:border-primary-teal hover:bg-primary-teal/10 rounded-lg transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-gray-500 rounded group-hover:border-primary-teal group-hover:bg-primary-teal/20 transition-all" />
                          <span className="text-gray-300 group-hover:text-white">{item.commitment}</span>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-dark-bg border border-dark-border rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Create Your Own</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  I commit to...
                </label>
                <input
                  type="text"
                  value={customCommitment}
                  onChange={(e) => setCustomCommitment(e.target.value)}
                  placeholder="e.g., Save an extra $500 this month"
                  className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-teal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  value={customDeadline}
                  onChange={(e) => setCustomDeadline(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-teal"
                />
              </div>
              <button
                onClick={handleAddCustom}
                disabled={!customCommitment.trim() || !customDeadline}
                className="w-full bg-primary-purple hover:bg-primary-purple/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Add My Commitment
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary-teal/20 to-primary-purple/20 border border-primary-teal/30 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">🎯 The Power of Commitment</h3>
            <p className="text-gray-300 leading-relaxed">
              Public commitment dramatically increases your likelihood of follow-through.
              By writing down your commitments and setting deadlines, you move from wishful
              thinking to actionable planning. Review your commitments weekly and celebrate
              each one you complete.
            </p>
          </div>

          <button
            onClick={handleContinue}
            className="w-full bg-primary-teal hover:bg-primary-teal/90 text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg"
          >
            Complete Training & Start Your Journey →
          </button>
        </div>

        {showCelebration && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-dark-surface border border-primary-teal rounded-lg p-8 text-center animate-bounce">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-white mb-2">Commitment Added!</h3>
              <p className="text-gray-400">You're one step closer to financial freedom.</p>
            </div>
          </div>
        )}

        {pendingCommitment && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-dark-surface border border-dark-border rounded-lg p-8 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-white mb-4">Set Your Deadline</h3>
              <p className="text-gray-300 mb-6">{pendingCommitment}</p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  When will you complete this commitment?
                </label>
                <input
                  type="date"
                  value={pendingDeadline}
                  onChange={(e) => setPendingDeadline(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-teal"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeDeadlineModal}
                  className="flex-1 px-4 py-3 rounded-lg border border-dark-border text-gray-300 hover:border-gray-500 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPendingCommitment}
                  disabled={!pendingDeadline}
                  className="flex-1 px-4 py-3 rounded-lg bg-primary-teal hover:bg-primary-teal/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold transition-colors"
                >
                  Add Commitment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
