import { useState, useRef } from 'react';
import { exportAndDownload, importFromFile, getDaysSinceLastBackup } from '../../lib/storage/backup';

export default function DataManagement() {
  const [showImportModal, setShowImportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState('');
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const daysSinceBackup = getDaysSinceLastBackup();
  const needsBackup = daysSinceBackup >= 7;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportAndDownload();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    setImportError('');
    setImportProgress('');
    setShowImportModal(true);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportError('');
    setImportProgress('Starting import...');

    try {
      await importFromFile(file, (message) => {
        setImportProgress(message);
      });

      // Success - reload the page after a short delay
      setImportProgress('Import successful! Reloading...');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Import failed:', error);
      setImportError(error instanceof Error ? error.message : 'Failed to import data. Please try again.');
      setImportProgress('');
    } finally {
      setIsImporting(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setImportError('Please upload a JSON file.');
      return;
    }

    setIsImporting(true);
    setImportError('');
    setImportProgress('Starting import...');

    try {
      await importFromFile(file, (message) => {
        setImportProgress(message);
      });

      // Success - reload the page after a short delay
      setImportProgress('Import successful! Reloading...');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Import failed:', error);
      setImportError(error instanceof Error ? error.message : 'Failed to import data. Please try again.');
      setImportProgress('');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Data Management</h3>
            <p className="text-gray-400 text-sm">
              {needsBackup
                ? `Last backed up ${daysSinceBackup === 999 ? 'never' : `${daysSinceBackup} days ago`}`
                : `Last backed up ${daysSinceBackup === 999 ? 'never' : `${daysSinceBackup} days ago`}`
              }
            </p>
          </div>
          {needsBackup && (
            <div className="bg-yellow-400/20 border border-yellow-400/30 rounded-lg px-3 py-1 text-yellow-400 text-xs font-semibold">
              Backup Recommended
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 px-4 py-2 rounded-lg border border-primary-teal text-primary-teal hover:bg-primary-teal/10 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-teal border-t-transparent rounded-full animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export Data
              </>
            )}
          </button>

          <button
            onClick={handleImportClick}
            disabled={isImporting}
            className="flex-1 px-4 py-2 rounded-lg border border-dark-border text-gray-300 hover:border-gray-500 hover:text-white transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import Data
          </button>
        </div>

        <p className="text-gray-500 text-xs mt-3">
          Export your data as a backup or to transfer to another device. Import to restore from a backup file.
        </p>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
          <div className="bg-dark-surface border border-dark-border rounded-lg p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Import Data</h3>
              <button
                onClick={() => setShowImportModal(false)}
                disabled={isImporting}
                className="text-gray-400 hover:text-white disabled:opacity-50"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {!isImporting && !importProgress && (
              <>
                <p className="text-gray-300 mb-6">
                  Upload your Your Wealth backup file to restore your data. This will replace all current data.
                </p>

                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-dark-border rounded-lg p-8 text-center hover:border-primary-teal transition-colors cursor-pointer mb-4"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-primary-teal hover:text-primary-teal/80 font-semibold"
                  >
                    Click to upload
                  </button>
                  <span className="text-gray-400"> or drag and drop</span>
                  <p className="text-gray-500 text-sm mt-2">JSON files only</p>
                </div>

                <div className="bg-red-400/10 border border-red-400/30 rounded-lg p-4">
                  <p className="text-red-400 text-sm font-semibold mb-2">⚠️ Warning</p>
                  <p className="text-gray-300 text-sm">
                    Importing will replace all your current data. Make sure to export a backup first if you want to keep your existing information.
                  </p>
                </div>
              </>
            )}

            {isImporting && (
              <div className="text-center py-8">
                <div className="w-16 h-16 border-4 border-primary-teal border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white text-lg font-semibold mb-2">Importing Data</p>
                <p className="text-gray-400">{importProgress}</p>
              </div>
            )}

            {importError && (
              <div className="bg-red-400/10 border border-red-400/30 rounded-lg p-4 mb-4">
                <p className="text-red-400 text-sm font-semibold mb-1">Import Failed</p>
                <p className="text-gray-300 text-sm">{importError}</p>
              </div>
            )}

            {!isImporting && (
              <button
                onClick={() => setShowImportModal(false)}
                className="w-full mt-6 px-4 py-3 rounded-lg border border-dark-border text-gray-300 hover:border-gray-500 hover:text-white transition-colors font-semibold"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
