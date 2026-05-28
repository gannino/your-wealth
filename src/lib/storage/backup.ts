import { useUserStore, usePsychologyStore, useAssessmentStore, useFinancialPlanStore } from '../../stores';
import type { ExportData, Belief, ActionCommitment } from '../../types';

/**
 * Export all user data to a JSON file
 * @returns The export data object
 */
export async function exportAllData(): Promise<ExportData> {
  // Get data from Zustand stores
  const userStore = useUserStore.getState();
  const psychologyStore = usePsychologyStore.getState();
  const assessmentStore = useAssessmentStore.getState();
  const financialPlanStore = useFinancialPlanStore.getState();

  // Get data from IndexedDB
  const userProfile = {
    id: userStore.id,
    name: userStore.name,
    email: userStore.email,
    createdAt: userStore.createdAt,
    lastVisit: userStore.lastVisit,
  };

  const psychologyAssessment = {
    currentStep: psychologyStore.currentStep,
    stepsCompleted: psychologyStore.stepsCompleted,
    mindsetResponses: psychologyStore.mindsetResponses,
    limitingBeliefs: psychologyStore.limitingBeliefs,
    empoweringBeliefs: psychologyStore.empoweringBeliefs,
    actionCommitments: psychologyStore.actionCommitments,
  };

  const assessments = {
    blueprint: assessmentStore.blueprintAssessment ?? undefined,
    mindset: assessmentStore.mindsetAssessment ?? undefined,
  };

  const exportData: ExportData = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    userProfile,
    psychologyAssessment,
    assessments,
    financialData: financialPlanStore.financialData ?? undefined,
    customReturnRates: financialPlanStore.customReturnRates,
    financialPlans: [],
    goals: [],
  };

  return exportData;
}

/**
 * Download export data as a JSON file
 * @param data - The export data to download
 */
export function downloadExportFile(data: ExportData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const timestamp = new Date().toISOString().split('T')[0];

  link.href = url;
  link.download = `your-wealth-backup-${timestamp}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export all data and trigger download
 */
export async function exportAndDownload(): Promise<void> {
  try {
    const data = await exportAllData();
    downloadExportFile(data);
    updateLastBackupDate();
  } catch (error) {
    console.error('Export failed:', error);
    throw new Error('Failed to export data. Please try again.', { cause: error });
  }
}

/**
 * Validate imported data structure
 */
export function validateImportData(data: unknown): data is ExportData {
  if (!data || typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;
  if (!obj.version || typeof obj.version !== 'string') return false;
  if (!obj.exportDate || typeof obj.exportDate !== 'string') return false;
  if (!obj.userProfile || typeof obj.userProfile !== 'object') return false;

  // Validate required fields
  const requiredFields = [
    'userProfile',
    'psychologyAssessment',
    'assessments',
  ];

  for (const field of requiredFields) {
    if (!obj[field]) return false;
  }

  return true;
}

/**
 * Import user data from an ExportData object
 */
export async function importUserData(
  data: ExportData,
  onProgress?: (message: string) => void
): Promise<void> {
  try {
    onProgress?.('Validating data...');

    // Validate data structure
    if (!validateImportData(data)) {
      throw new Error('Invalid backup file. Please ensure you\'re using a valid Your Wealth backup.');
    }

    onProgress?.('Restoring user profile...');
    const userStore = useUserStore.getState();
    userStore.setProfile({
      id: data.userProfile.id,
      name: data.userProfile.name,
      email: data.userProfile.email,
      createdAt: data.userProfile.createdAt,
      lastVisit: data.userProfile.lastVisit,
    });

    onProgress?.('Restoring psychology assessment...');
    const psychologyStore = usePsychologyStore.getState();
    psychologyStore.setCurrentStep(data.psychologyAssessment.currentStep);
    data.psychologyAssessment.stepsCompleted.forEach((step: number) => {
      psychologyStore.completeStep(step);
    });
    psychologyStore.setMindsetResponses(data.psychologyAssessment.mindsetResponses);
    data.psychologyAssessment.limitingBeliefs.forEach((belief: Belief) => {
      psychologyStore.addLimitingBelief(belief.belief);
    });
    data.psychologyAssessment.empoweringBeliefs.forEach((belief: Belief) => {
      psychologyStore.addEmpoweringBelief(belief.belief);
    });
    data.psychologyAssessment.actionCommitments.forEach((commitment: ActionCommitment) => {
      psychologyStore.addActionCommitment(commitment.commitment, commitment.deadline);
    });

    onProgress?.('Restoring assessments...');
    const assessmentStore = useAssessmentStore.getState();
    if (data.assessments.blueprint) {
      assessmentStore.setBlueprintAssessment(data.assessments.blueprint);
    }
    if (data.assessments.mindset) {
      assessmentStore.setMindsetAssessment(data.assessments.mindset);
    }

    onProgress?.('Restoring financial data...');
    const financialPlanStore = useFinancialPlanStore.getState();
    if (data.financialData) {
      financialPlanStore.setFinancialData(data.financialData);
    }
    if (data.customReturnRates) {
      financialPlanStore.setCustomReturnRates(data.customReturnRates);
    }

    onProgress?.('Import complete!');
  } catch (error) {
    console.error('Import failed:', error);
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON file. Please ensure you\'re uploading a valid backup file.', { cause: error });
    }
    throw error;
  }
}

/**
 * Import user data from a JSON file
 */
export async function importFromFile(
  file: File,
  onProgress?: (message: string) => void
): Promise<void> {
  try {
    onProgress?.('Reading file...');

    // Read file
    const text = await file.text();
    const data = JSON.parse(text);

    await importUserData(data, onProgress);
  } catch (error) {
    console.error('Import failed:', error);
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON file. Please ensure you\'re uploading a valid backup file.', { cause: error });
    }
    throw error;
  }
}

/**
 * Get the last backup date from localStorage
 * @returns ISO date string of last backup, or null if never backed up
 */
export function getLastBackupDate(): string | null {
  return localStorage.getItem('your-wealth-last-backup');
}

/**
 * Update the last backup date to now
 */
export function updateLastBackupDate(): void {
  localStorage.setItem('your-wealth-last-backup', new Date().toISOString());
}

/**
 * Check if a backup reminder should be shown (every 7 days)
 * @returns true if backup reminder should be shown
 */
export function shouldShowBackupReminder(): boolean {
  const lastBackup = getLastBackupDate();
  if (!lastBackup) return true;

  const daysSinceBackup = Math.floor(
    (Date.now() - new Date(lastBackup).getTime()) / (1000 * 60 * 60 * 24)
  );

  return daysSinceBackup >= 7;
}

/**
 * Get days since last backup
 */
export function getDaysSinceLastBackup(): number {
  const lastBackup = getLastBackupDate();
  if (!lastBackup) return 999; // Large number to indicate never backed up

  const lastBackupDate = new Date(lastBackup);
  return Math.floor(
    (Date.now() - lastBackupDate.getTime()) / (1000 * 60 * 60 * 24)
  );
}
