'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';
import {
  WORKSHOP_STATIONS,
  SCRAPPY_UPGRADES,
} from '@/data/hoarding';

// Types for progress tracking
export interface UpgradeProgress {
  // Workshop stations: { stationId: completedLevel } e.g., { gunsmith: 2, gear_bench: 1 }
  workshopLevels: Record<string, number>;
  // Scrappy level (1-5, where 1 is starting level)
  scrappyLevel: number;
}

interface ProgressContextType {
  progress: UpgradeProgress;
  loading: boolean;
  // Workshop station methods
  markWorkshopLevelComplete: (stationId: string, level: number) => Promise<void>;
  unmarkWorkshopLevelComplete: (stationId: string, level: number) => Promise<void>;
  getWorkshopLevel: (stationId: string) => number;
  isWorkshopLevelComplete: (stationId: string, level: number) => boolean;
  // Scrappy methods
  markScrappyLevelComplete: (level: number) => Promise<void>;
  unmarkScrappyLevelComplete: (level: number) => Promise<void>;
  isScrappyLevelComplete: (level: number) => boolean;
  // Check if an item is still required for any incomplete upgrade
  isItemStillRequired: (itemId: string) => boolean;
  getItemRemainingRequirements: (itemId: string) => { source: string; quantity: number }[];
  // UI state
  showCompletedLevels: boolean;
  setShowCompletedLevels: (show: boolean) => void;
}

const STORAGE_KEY = 'arc-raiders-progress';

const defaultProgress: UpgradeProgress = {
  workshopLevels: {},
  scrappyLevel: 1,
};

const ProgressContext = createContext<ProgressContextType | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user, userProfile } = useAuth();
  const [progress, setProgress] = useState<UpgradeProgress>(defaultProgress);
  const [loading, setLoading] = useState(true);
  const [showCompletedLevels, setShowCompletedLevels] = useState(false);

  // Load progress from localStorage or Firebase
  useEffect(() => {
    const loadProgress = async () => {
      setLoading(true);

      if (user && userProfile) {
        // Load from Firebase user profile
        const firebaseProgress: UpgradeProgress = {
          workshopLevels: userProfile.hideoutLevels || {},
          scrappyLevel: userProfile.scrappyLevel || 1,
        };
        setProgress(firebaseProgress);
      } else {
        // Load from localStorage for guests
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored) as UpgradeProgress;
            setProgress(parsed);
          }
        } catch (error) {
          console.error('Error loading progress from localStorage:', error);
        }
      }

      setLoading(false);
    };

    loadProgress();
  }, [user, userProfile]);

  // Save progress to localStorage or Firebase
  const saveProgress = useCallback(async (newProgress: UpgradeProgress) => {
    setProgress(newProgress);

    if (user && db) {
      // Save to Firebase
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          hideoutLevels: newProgress.workshopLevels,
          scrappyLevel: newProgress.scrappyLevel,
        });
      } catch (error) {
        console.error('Error saving progress to Firebase:', error);
      }
    } else {
      // Save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
      } catch (error) {
        console.error('Error saving progress to localStorage:', error);
      }
    }
  }, [user]);

  // Workshop methods
  const getWorkshopLevel = useCallback((stationId: string): number => {
    return progress.workshopLevels[stationId] || 0;
  }, [progress.workshopLevels]);

  const isWorkshopLevelComplete = useCallback((stationId: string, level: number): boolean => {
    return getWorkshopLevel(stationId) >= level;
  }, [getWorkshopLevel]);

  const markWorkshopLevelComplete = useCallback(async (stationId: string, level: number) => {
    const currentLevel = getWorkshopLevel(stationId);
    // Only allow marking the next level or same level
    if (level <= currentLevel + 1) {
      const newProgress: UpgradeProgress = {
        ...progress,
        workshopLevels: {
          ...progress.workshopLevels,
          [stationId]: Math.max(currentLevel, level),
        },
      };
      await saveProgress(newProgress);
    }
  }, [progress, getWorkshopLevel, saveProgress]);

  const unmarkWorkshopLevelComplete = useCallback(async (stationId: string, level: number) => {
    const currentLevel = getWorkshopLevel(stationId);
    // Only allow unmarking the current highest level
    if (level === currentLevel && level > 0) {
      const newProgress: UpgradeProgress = {
        ...progress,
        workshopLevels: {
          ...progress.workshopLevels,
          [stationId]: level - 1,
        },
      };
      await saveProgress(newProgress);
    }
  }, [progress, getWorkshopLevel, saveProgress]);

  // Scrappy methods
  const isScrappyLevelComplete = useCallback((level: number): boolean => {
    return progress.scrappyLevel >= level;
  }, [progress.scrappyLevel]);

  const markScrappyLevelComplete = useCallback(async (level: number) => {
    // Only allow marking levels up to the next one
    if (level <= progress.scrappyLevel + 1) {
      const newProgress: UpgradeProgress = {
        ...progress,
        scrappyLevel: Math.max(progress.scrappyLevel, level),
      };
      await saveProgress(newProgress);
    }
  }, [progress, saveProgress]);

  const unmarkScrappyLevelComplete = useCallback(async (level: number) => {
    // Only allow unmarking the current level (can't go below level 1)
    if (level === progress.scrappyLevel && level > 1) {
      const newProgress: UpgradeProgress = {
        ...progress,
        scrappyLevel: level - 1,
      };
      await saveProgress(newProgress);
    }
  }, [progress, saveProgress]);

  // Calculate which items are still required based on incomplete upgrades
  const remainingRequirements = useMemo(() => {
    const requirements = new Map<string, { source: string; quantity: number }[]>();

    // Check workshop stations
    for (const station of WORKSHOP_STATIONS) {
      const completedLevel = progress.workshopLevels[station.id] || 0;

      for (const level of station.levels) {
        // Skip completed levels
        if (level.level <= completedLevel) continue;

        for (const req of level.requirements) {
          const existing = requirements.get(req.itemId) || [];
          existing.push({
            source: `${station.name} Level ${level.level}`,
            quantity: req.quantity,
          });
          requirements.set(req.itemId, existing);
        }
      }
    }

    // Check Scrappy upgrades
    for (const level of SCRAPPY_UPGRADES) {
      // Skip completed levels
      if (level.level <= progress.scrappyLevel) continue;

      for (const req of level.requirements) {
        const existing = requirements.get(req.itemId) || [];
        existing.push({
          source: `Scrappy Level ${level.level}`,
          quantity: req.quantity,
        });
        requirements.set(req.itemId, existing);
      }
    }

    return requirements;
  }, [progress]);

  const isItemStillRequired = useCallback((itemId: string): boolean => {
    return remainingRequirements.has(itemId);
  }, [remainingRequirements]);

  const getItemRemainingRequirements = useCallback((itemId: string): { source: string; quantity: number }[] => {
    return remainingRequirements.get(itemId) || [];
  }, [remainingRequirements]);

  return (
    <ProgressContext.Provider
      value={{
        progress,
        loading,
        markWorkshopLevelComplete,
        unmarkWorkshopLevelComplete,
        getWorkshopLevel,
        isWorkshopLevelComplete,
        markScrappyLevelComplete,
        unmarkScrappyLevelComplete,
        isScrappyLevelComplete,
        isItemStillRequired,
        getItemRemainingRequirements,
        showCompletedLevels,
        setShowCompletedLevels,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
