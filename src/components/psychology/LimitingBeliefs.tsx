import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePsychologyStore } from '../../stores';

const commonLimitingBeliefs = [
  "Money is the root of all evil",
  "Rich people are greedy",
  "I don't deserve to be wealthy",
  "Money changes people for the worse",
  "I'm not good with money",
  "You have to work hard to make money",
  "Money can't buy happiness",
  "I'll never be rich",
  "Investing is risky",
  "I'm not smart enough to be wealthy",
  "Other people determine my financial success",
  "I'll start saving when I earn more"
] as const;

export default function LimitingBeliefs() {
  const navigate = useNavigate();
  const { limitingBeliefs, addLimitingBelief, completeStep } = usePsychologyStore();
  const [selectedBeliefs, setSelectedBeliefs] = useState<string[]>(
    limitingBeliefs.map(b => b.belief)
  );
  const [customBelief, setCustomBelief] = useState('');

  const toggleBelief = (belief: string) => {
    if (selectedBeliefs.includes(belief)) {
      setSelectedBeliefs(selectedBeliefs.filter(b => b !== belief));
    } else {
      setSelectedBeliefs([...selectedBeliefs, belief]);
    }
  };

  const handleAddCustom = () => {
    if (customBelief.trim()) {
      addLimitingBelief(customBelief.trim());
      setCustomBelief('');
    }
  };

  const handleContinue = () => {
    selectedBeliefs.forEach(belief => {
      if (!limitingBeliefs.find(lb => lb.belief === belief)) {
        addLimitingBelief(belief);
      }
    });
    completeStep(3);
    navigate('/psychology/belief-transformation');
  };

  const handleBack = () => {
    navigate('/psychology/mindset-assessment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-dark-surface border border-dark-border rounded-lg p-8 mb-6">
          <div className="mb-6">
            <button
              onClick={handleBack}
              className="text-gray-400 hover:text-white text-sm mb-4 flex items-center gap-2"
            >
              ← Back
            </button>
            <span className="text-primary-teal text-sm font-semibold">STEP 3 OF 7</span>
            <h1 className="text-3xl font-bold text-white mt-2">Identify Your Limiting Beliefs</h1>
            <p className="text-gray-400 mt-3">
              Select the beliefs that resonate with you. These are the invisible barriers
              that may be holding you back from financial success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {commonLimitingBeliefs.map((belief) => (
              <button
                key={belief}
                onClick={() => toggleBelief(belief)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedBeliefs.includes(belief)
                    ? 'border-primary-pink bg-primary-pink/10 text-white'
                    : 'border-dark-border bg-dark-bg text-gray-300 hover:border-dark-border'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    selectedBeliefs.includes(belief)
                      ? 'border-primary-pink bg-primary-pink'
                      : 'border-gray-500'
                  }`}>
                    {selectedBeliefs.includes(belief) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm">{belief}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-dark-bg border border-dark-border rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Add Your Own</h3>
            <p className="text-gray-400 text-sm mb-4">
              Is there another limiting belief you have about money? Add it here.
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={customBelief}
                onChange={(e) => setCustomBelief(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustom()}
                placeholder="Type your limiting belief..."
                className="flex-1 bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-teal"
              />
              <button
                onClick={handleAddCustom}
                className="bg-primary-teal hover:bg-primary-teal/90 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          <div className="bg-primary-purple/10 border border-primary-purple/30 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-primary-purple mb-3">Why This Matters</h3>
            <p className="text-gray-300 leading-relaxed">
              Your beliefs shape your reality. If you believe "money is evil," your subconscious
              will sabotage your financial success. Identifying these beliefs is the first step
              to replacing them with empowering ones.
            </p>
          </div>

          <button
            onClick={handleContinue}
            disabled={selectedBeliefs.length === 0}
            className="w-full bg-primary-teal hover:bg-primary-teal/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Continue to Belief Transformation →
          </button>
        </div>
      </div>
    </div>
  );
}
