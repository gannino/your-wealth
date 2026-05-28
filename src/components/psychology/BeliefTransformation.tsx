import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePsychologyStore } from '../../stores';

interface Transformation {
  limiting: string;
  empowering: string;
}

const defaultTransformations: Record<string, string> = {
  "Money is the root of all evil": "Money is a tool that can create positive change",
  "Rich people are greedy": "Wealthy people are resourceful and create value",
  "I don't deserve to be wealthy": "I deserve abundance and can use it to help others",
  "Money changes people for the worse": "Money reveals who you truly are",
  "I'm not good with money": "I can learn to master money and make it work for me",
  "You have to work hard to make money": "I can create value that generates wealth",
  "Money can't buy happiness": "Money provides freedom to pursue what makes me happy",
  "I'll never be rich": "I am building wealth every day through smart decisions",
  "Investing is risky": "Not investing is the riskiest path to financial freedom",
  "I'm not smart enough to be wealthy": "I have unique talents that can create wealth",
  "Other people determine my financial success": "I am the architect of my financial future",
  "I'll start saving when I earn more": "I start now, no matter how small the amount"
};

export default function BeliefTransformation() {
  const navigate = useNavigate();
  const { limitingBeliefs, addEmpoweringBelief, completeStep } = usePsychologyStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [customEmpowering, setCustomEmpowering] = useState('');
  const [transformations, setTransformations] = useState<Transformation[]>([]);

  const currentBelief = limitingBeliefs[currentIndex];
  const defaultEmpowering = currentBelief
    ? defaultTransformations[currentBelief.belief] || ""
    : "";

  const handleAcceptDefault = () => {
    if (currentBelief && defaultEmpowering) {
      addEmpoweringBelief(defaultEmpowering);
      setTransformations([...transformations, {
        limiting: currentBelief.belief,
        empowering: defaultEmpowering
      }]);
      nextBelief();
    }
  };

  const handleCustom = () => {
    if (customEmpowering.trim() && currentBelief) {
      addEmpoweringBelief(customEmpowering.trim());
      setTransformations([...transformations, {
        limiting: currentBelief.belief,
        empowering: customEmpowering.trim()
      }]);
      setCustomEmpowering('');
      nextBelief();
    }
  };

  const nextBelief = () => {
    if (currentIndex < limitingBeliefs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      completeStep(4);
      navigate('/psychology/success-formula');
    }
  };

  const skipBelief = () => {
    nextBelief();
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      navigate('/psychology/limiting-beliefs');
    }
  };

  if (!currentBelief) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-dark-surface border border-dark-border rounded-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">No Limiting Beliefs Identified</h1>
            <p className="text-gray-400 mb-6">
              You haven't identified any limiting beliefs yet. Let's continue your journey.
            </p>
            <button
              onClick={() => navigate('/psychology/success-formula')}
              className="bg-primary-teal hover:bg-primary-teal/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / limitingBeliefs.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-dark-surface border border-dark-border rounded-lg p-8 mb-6">
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Transforming belief {currentIndex + 1} of {limitingBeliefs.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-dark-bg rounded-full h-2">
              <div
                className="bg-primary-purple h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleBack}
            className="text-gray-400 hover:text-white text-sm mb-4 flex items-center gap-2"
          >
            ← Back
          </button>

          <span className="text-primary-pink text-sm font-semibold">STEP 4 OF 7</span>
          <h1 className="text-3xl font-bold text-white mt-2 mb-6">Transform Your Beliefs</h1>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-red-400 mb-3">❌ Limiting Belief</h2>
            <p className="text-white text-xl">{currentBelief.belief}</p>
            <p className="text-gray-400 text-sm mt-3">
              This belief has been holding you back. Let's replace it with an empowering one.
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <h2 className="text-lg font-semibold text-white">✨ Empowering Alternative</h2>

            {defaultEmpowering && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                <p className="text-gray-300 text-sm mb-3">Suggested transformation:</p>
                <p className="text-white text-lg mb-4">{defaultEmpowering}</p>
                <button
                  onClick={handleAcceptDefault}
                  className="bg-primary-teal hover:bg-primary-teal/90 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Use This Belief
                </button>
              </div>
            )}

            <div className="bg-dark-bg border border-dark-border rounded-lg p-6">
              <p className="text-gray-300 text-sm mb-3">Or create your own:</p>
              <textarea
                value={customEmpowering}
                onChange={(e) => setCustomEmpowering(e.target.value)}
                placeholder="Write your empowering belief..."
                rows={3}
                className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-teal resize-none"
              />
              <button
                onClick={handleCustom}
                disabled={!customEmpowering.trim()}
                className="mt-3 bg-primary-purple hover:bg-primary-purple/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Use Custom Belief
              </button>
            </div>
          </div>

          <div className="bg-primary-teal/10 border border-primary-teal/30 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-primary-teal mb-3">💡 The Power of Belief</h3>
            <p className="text-gray-300 leading-relaxed">
              Your brain cannot distinguish between what you imagine and what is real.
              By consistently repeating your empowering beliefs, you rewire your neural
              pathways and create new possibilities for yourself.
            </p>
          </div>

          <button
            onClick={skipBelief}
            className="text-gray-400 hover:text-gray-300 text-sm w-full text-center"
          >
            Skip this belief
          </button>
        </div>

        {transformations.length > 0 && (
          <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Transformations ({transformations.length})
            </h3>
            <div className="space-y-3">
              {transformations.map((t, i) => (
                <div key={i} className="bg-dark-bg rounded-lg p-4">
                  <p className="text-red-400 text-sm line-through mb-2">{t.limiting}</p>
                  <p className="text-green-400">{t.empowering}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
