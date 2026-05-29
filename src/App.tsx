import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Welcome } from './components/psychology/Welcome';
import { Layout } from './components/shared/Layout';
import { NotFound } from './components/shared/NotFound';

// Lazy load heavy components for code splitting
const ResultsDashboard = lazy(() => import('./components/results/ResultsDashboard'));
const TrainingHub = lazy(() => import('./components/training/TrainingHub'));
const Module1_Foundation = lazy(() => import('./components/training/modules/Module1_Foundation/Module1'));
const Module2_MythBusting = lazy(() => import('./components/training/modules/Module2_MythBusting/Module2'));
const Module3_Strategy = lazy(() => import('./components/training/modules/Module3_Strategy/Module3'));
const Module4_Execution = lazy(() => import('./components/training/modules/Module4_Execution/Module4'));
const Module5_Mastery = lazy(() => import('./components/training/modules/Module5_Mastery/Module5'));

// Psychology components
const MindsetAssessment = lazy(() => import('./components/psychology/MindsetAssessment'));
const LimitingBeliefs = lazy(() => import('./components/psychology/LimitingBeliefs'));
const BeliefTransformation = lazy(() => import('./components/psychology/BeliefTransformation'));
const SuccessFormula = lazy(() => import('./components/psychology/SuccessFormula'));
const ChangeProcess = lazy(() => import('./components/psychology/ChangeProcess'));
const ActionCommitment = lazy(() => import('./components/psychology/ActionCommitment'));
const PsychologyResults = lazy(() => import('./components/psychology/PsychologyResults'));

// Assessment components
const BlueprintAssessment = lazy(() => import('./components/assessments/BlueprintAssessment'));
const CurrencySelector = lazy(() => import('./components/shared/CurrencySelector'));
const FinancialDataWizard = lazy(() => import('./components/assessments/FinancialDataWizard'));

// Planning components
const FinancialPlanGenerator = lazy(() => import('./components/planning/FinancialPlanGenerator'));
const ScenarioComparison = lazy(() => import('./components/planning/ScenarioComparison'));

// Loading fallback component
function LoadingFallback() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <div className="loading">Loading...</div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Welcome />} />

        {/* Results Dashboard */}
        <Route
          path="results"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ResultsDashboard />
            </Suspense>
          }
        />

        {/* Training Routes */}
        <Route
          path="training/hub"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <TrainingHub />
            </Suspense>
          }
        />
        <Route
          path="training/module-1-foundation"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Module1_Foundation />
            </Suspense>
          }
        />
        <Route
          path="training/module-2-mythbusting"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Module2_MythBusting />
            </Suspense>
          }
        />
        <Route
          path="training/module-3-strategy"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Module3_Strategy />
            </Suspense>
          }
        />
        <Route
          path="training/module-4-execution"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Module4_Execution />
            </Suspense>
          }
        />
        <Route
          path="training/module-5-mastery"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Module5_Mastery />
            </Suspense>
          }
        />

        {/* Psychology Assessment Routes */}
        <Route
          path="psychology/mindset-assessment"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <MindsetAssessment />
            </Suspense>
          }
        />
        <Route
          path="psychology/limiting-beliefs"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <LimitingBeliefs />
            </Suspense>
          }
        />
        <Route
          path="psychology/belief-transformation"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <BeliefTransformation />
            </Suspense>
          }
        />
        <Route
          path="psychology/success-formula"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <SuccessFormula />
            </Suspense>
          }
        />
        <Route
          path="psychology/change-process"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ChangeProcess />
            </Suspense>
          }
        />
        <Route
          path="psychology/action-commitment"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ActionCommitment />
            </Suspense>
          }
        />
        <Route
          path="psychology/results"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <PsychologyResults />
            </Suspense>
          }
        />

        {/* Assessment Routes */}
        <Route
          path="assessments/blueprint"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <BlueprintAssessment />
            </Suspense>
          }
        />
        <Route
          path="assessments/currency"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <CurrencySelector />
            </Suspense>
          }
        />
        <Route
          path="assessments/financial-data"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <FinancialDataWizard />
            </Suspense>
          }
        />
        {/* Planning Routes */}
        <Route
          path="planning/generate"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <FinancialPlanGenerator />
            </Suspense>
          }
        />
        <Route
          path="planning/scenarios"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ScenarioComparison />
            </Suspense>
          }
        />

        {/* Goals Routes */}
        <Route path="goals/five-dreams" element={<div>Five Dreams - Coming Soon</div>} />
        <Route path="goals/progress" element={<div>Progress Tracker - Coming Soon</div>} />
      </Route>

      {/* 404 - Catch all unmatched routes (must be outside Layout route) */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
