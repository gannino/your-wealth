/**
 * Training Module Types
 *
 * Shared types for all training modules.
 */

/**
 * Screen types supported by training modules
 */
export type ScreenType =
  | 'content'        // Static content with text/media
  | 'quiz'          // Knowledge check with multiple choice
  | 'scenario'      // Interactive scenario with options
  | 'reflection'    // Open-ended reflection prompt
  | 'intro';        // Module introduction

/**
 * Quiz option for knowledge checks
 */
export interface QuizOption {
  value: string;
  label: string;
  feedback?: string;
  isCorrect?: boolean;
}

/**
 * Screen content definition
 */
export interface ScreenContent {
  id: string;
  type: ScreenType;
  title?: string;
  subtitle?: string;
  content?: string;
  question?: string;         // For quiz screens
  scenario?: string;         // For scenario screens
  options?: QuizOption[];
  correctAnswer?: string;
  meta?: {
    duration?: string;       // Estimated time to complete
    chapterRef?: string;     // Reference to skill chapter for content loading
  };
}

/**
 * Module configuration
 */
export interface ModuleConfig {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  screens: ScreenContent[];
  estimatedDuration: string;
  learningObjective: string;
}

/**
 * Props for screen components
 */
export interface ScreenProps {
  screen: ScreenContent;
  currentIndex: number;
  totalScreens: number;
  onNext: () => void;
  onBack: () => void;
  onAnswerSelect?: (answer: string) => void;
  selectedAnswer?: string | null;
  showFeedback?: boolean;
}
