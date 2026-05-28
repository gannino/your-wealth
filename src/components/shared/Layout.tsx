import { Outlet, Link } from 'react-router-dom';
import { useState } from 'react';
import { useFinancialPlanStore } from '../../stores';

export function Layout() {
  const { financialData } = useFinancialPlanStore();
  const hasFinancialData = financialData !== null && financialData !== undefined;
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearData = () => {
    // Clear all Your Wealth data from localStorage
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith('your-wealth-')) {
        localStorage.removeItem(key);
      }
    });
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <nav className="bg-dark-surface border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary-teal">
                Your Wealth
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link
                to="/training/hub"
                className="text-gray-300 hover:text-primary-teal transition-colors"
              >
                Training
              </Link>
              <Link
                to="/assessments/blueprint"
                className="text-gray-300 hover:text-primary-teal transition-colors"
              >
                Assessments
              </Link>
              <Link
                to="/assessments/currency"
                className="text-gray-300 hover:text-primary-teal transition-colors"
              >
                Financial Data
              </Link>
              <Link
                to={hasFinancialData ? "/planning/generate" : "/assessments/currency"}
                className="text-gray-300 hover:text-primary-teal transition-colors"
              >
                {hasFinancialData ? 'Planning' : 'Financial Plan'}
              </Link>
              <button
                onClick={() => setShowClearConfirm(true)}
                className="text-gray-400 hover:text-red-400 transition-colors text-sm"
                title="Clear all data"
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="bg-dark-surface border-t border-dark-border mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-400 text-sm">
            © 2026 Your Wealth. All data stored locally in your browser.
          </p>
        </div>
      </footer>

      {showClearConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-dark-surface border border-dark-border rounded-lg p-6 max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Clear All Data?</h3>
            <p className="text-gray-300 mb-6">
              This will permanently delete all your progress, including psychology training,
              assessments, and financial data. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-dark-border text-gray-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
