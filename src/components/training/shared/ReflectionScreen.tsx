import { createSanitizedMarkup } from '../../../lib/utils/sanitizeHtml';
import type { ScreenContent } from '../modules/types';

/**
 * Reflection Screen Component
 *
 * Reusable component for training module reflection screens.
 * Displays reflection content and provides a textarea for user input.
 *
 * Props:
 * - screen: The screen content data
 * - response: Current user's reflection response
 * - onResponseChange: Callback when user types in textarea
 * - onSubmit: Callback when user submits reflection
 * - onBack: Callback when user clicks back button
 */
interface ReflectionScreenProps {
  screen: ScreenContent;
  response: string;
  onResponseChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export function ReflectionScreen({
  screen,
  response,
  onResponseChange,
  onSubmit,
  onBack
}: ReflectionScreenProps) {
  return (
    <div>
      {/* Reflection Prompt */}
      <div
        className="text-gray-300 leading-relaxed mb-6"
        dangerouslySetInnerHTML={createSanitizedMarkup(screen.content || '')}
      />

      {/* Textarea Input */}
      <textarea
        value={response}
        onChange={(e) => onResponseChange(e.target.value)}
        placeholder="Type your reflection here..."
        className="w-full h-40 bg-dark-bg border border-dark-border rounded-lg p-4 text-gray-200 placeholder-gray-500 focus:border-primary-teal focus:outline-none resize-none"
      />

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-lg border border-dark-border text-gray-300 hover:border-gray-500 hover:text-white transition-colors font-semibold"
        >
          ← Back
        </button>
        <button
          onClick={onSubmit}
          disabled={!response.trim()}
          className="px-6 py-3 rounded-lg bg-primary-teal hover:bg-teal-600 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save & Continue →
        </button>
      </div>
    </div>
  );
}
