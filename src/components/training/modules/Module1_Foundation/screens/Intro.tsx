/**
 * Intro Screen Component
 *
 * First screen of Module 1 - Foundation
 * Welcome screen introducing the module
 */

import { createSanitizedMarkup } from '../../../../../lib/utils/sanitizeHtml';
import type { ScreenProps } from '../../types';

export default function IntroScreen({ screen, currentIndex, totalScreens, onNext, onBack }: ScreenProps) {
  const progress = ((currentIndex + 1) / totalScreens) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Screen {currentIndex + 1} of {totalScreens}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-dark-bg rounded-full h-2">
            <div
              className="bg-primary-teal h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-dark-surface border border-dark-border rounded-lg p-8">
          {/* Header */}
          {screen.title && (
            <h1 className="text-4xl font-bold text-white mb-4">
              {screen.title}
            </h1>
          )}
          {screen.subtitle && (
            <p className="text-xl text-primary-teal mb-6">
              {screen.subtitle}
            </p>
          )}

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            {screen.content && (
              <div
                className="text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={createSanitizedMarkup(screen.content)}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={onBack}
              className="px-6 py-3 rounded-lg border border-dark-border text-gray-300 hover:border-gray-500 hover:text-white transition-colors font-semibold"
            >
              ← Back to Training Hub
            </button>
            <button
              onClick={onNext}
              className="px-6 py-3 rounded-lg bg-primary-teal hover:bg-teal-600 text-white font-semibold transition-colors"
            >
              Begin Your Foundation Journey →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
