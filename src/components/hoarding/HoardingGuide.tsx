'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Info,
  Wrench,
  Heart,
  Bomb,
  Cpu,
  Flame,
  Dog,
  Eye,
  EyeOff,
  Lock,
  Undo2,
  X,
  Cloud,
  Crosshair,
  HardHat,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { cn } from '@/lib/utils';
import { ITEMS } from '@/data/items';
import {
  WORKSHOP_STATIONS,
  SCRAPPY_UPGRADES,
  HOARDING_CATEGORIES,
  HOARDING_TIPS,
} from '@/data/hoarding';
import { useProgress, useAuth } from '@/context';
import type { StashItem, Rarity } from '@/types';

const SIGNIN_BANNER_DISMISSED_KEY = 'arc-raiders-signin-banner-dismissed';

// All possible views: checklist, scrappy, or any workshop station ID
type ViewType = 'checklist' | 'scrappy' | 'gunsmith' | 'gear_bench' | 'medical_lab' | 'explosives_station' | 'utility_station' | 'refiner';

// Tab configuration for the view selector
const VIEW_TABS: { id: ViewType; label: string; icon?: typeof Wrench }[] = [
  { id: 'checklist', label: 'Checklist' },
  { id: 'scrappy', label: 'Scrappy', icon: Dog },
  { id: 'gunsmith', label: 'Gunsmith', icon: Crosshair },
  { id: 'gear_bench', label: 'Gear Bench', icon: HardHat },
  { id: 'medical_lab', label: 'Medical', icon: Heart },
  { id: 'explosives_station', label: 'Explosives', icon: Bomb },
  { id: 'utility_station', label: 'Utility', icon: Cpu },
  { id: 'refiner', label: 'Refiner', icon: Flame },
];

interface HoardingGuideProps {
  stash: StashItem[];
  onSignIn?: () => void;
}

const stationIcons: Record<string, typeof Wrench> = {
  gunsmith: Crosshair,
  gear_bench: HardHat,
  medical_lab: Heart,
  explosives_station: Bomb,
  utility_station: Cpu,
  refiner: Flame,
};

const priorityColors = {
  critical: 'text-red-400 bg-red-500/10 border-red-500/30',
  high: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  medium: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  low: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/30',
};

const priorityLabels = {
  critical: 'Critical',
  high: 'High Priority',
  medium: 'Medium',
  low: 'Low',
};

const rarityBgColors: Record<Rarity, string> = {
  common: 'bg-zinc-700',
  uncommon: 'bg-green-900/50',
  rare: 'bg-blue-900/50',
  epic: 'bg-purple-900/50',
  legendary: 'bg-amber-900/50',
};

export function HoardingGuide({ stash, onSignIn }: HoardingGuideProps) {
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['arcParts', 'brokenItems']));
  const [activeView, setActiveView] = useState<ViewType>('checklist');
  const [signInBannerDismissed, setSignInBannerDismissed] = useState(true); // Start true to prevent flash

  const { user } = useAuth();

  // Load banner dismissal state from localStorage
  useEffect(() => {
    const dismissed = localStorage.getItem(SIGNIN_BANNER_DISMISSED_KEY);
    setSignInBannerDismissed(dismissed === 'true');
  }, []);

  const dismissSignInBanner = () => {
    setSignInBannerDismissed(true);
    localStorage.setItem(SIGNIN_BANNER_DISMISSED_KEY, 'true');
  };

  const {
    isWorkshopLevelComplete,
    markWorkshopLevelComplete,
    unmarkWorkshopLevelComplete,
    getWorkshopLevel,
    isScrappyLevelComplete,
    markScrappyLevelComplete,
    unmarkScrappyLevelComplete,
    isItemStillRequired,
    showCompletedLevels,
    setShowCompletedLevels,
    progress,
  } = useProgress();

  // Create a map of stash quantities for quick lookup
  const stashQuantities = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of stash) {
      map.set(item.itemId, item.quantity);
    }
    return map;
  }, [stash]);

  const toggleLevel = (levelKey: string) => {
    setExpandedLevels((prev) => {
      const next = new Set(prev);
      if (next.has(levelKey)) {
        next.delete(levelKey);
      } else {
        next.add(levelKey);
      }
      return next;
    });
  };

  // Check if the active view is a workshop station
  const isWorkshopView = activeView !== 'checklist' && activeView !== 'scrappy';
  const activeStation = isWorkshopView ? WORKSHOP_STATIONS.find(s => s.id === activeView) : null;

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  // Calculate overall progress based on completed upgrades
  const overallProgress = useMemo(() => {
    // Count total upgrade levels and completed ones
    let totalLevels = 0;
    let completedLevels = 0;

    // Workshop stations
    for (const station of WORKSHOP_STATIONS) {
      for (const level of station.levels) {
        totalLevels++;
        if (isWorkshopLevelComplete(station.id, level.level)) {
          completedLevels++;
        }
      }
    }

    // Scrappy upgrades (levels 2-5, since level 1 is starting)
    for (const upgrade of SCRAPPY_UPGRADES) {
      if (upgrade.level > 1) {
        totalLevels++;
        if (isScrappyLevelComplete(upgrade.level)) {
          completedLevels++;
        }
      }
    }

    return totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0;
  }, [isWorkshopLevelComplete, isScrappyLevelComplete]);

  // Calculate workshop completion stats
  const workshopStats = useMemo(() => {
    let completed = 0;
    let total = 0;
    for (const station of WORKSHOP_STATIONS) {
      for (const level of station.levels) {
        total++;
        if (isWorkshopLevelComplete(station.id, level.level)) {
          completed++;
        }
      }
    }
    return { completed, total };
  }, [isWorkshopLevelComplete]);

  // Calculate scrappy completion stats
  const scrappyStats = useMemo(() => {
    const maxLevel = Math.max(...SCRAPPY_UPGRADES.map(u => u.level));
    return {
      currentLevel: progress.scrappyLevel,
      maxLevel,
    };
  }, [progress.scrappyLevel]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Workshop Upgrades</h1>
          <p className="text-zinc-400 mt-1">
            Track items you need for Workshop and Scrappy upgrades
          </p>
        </div>
        <button
          onClick={() => setShowCompletedLevels(!showCompletedLevels)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20 cursor-pointer"
        >
          {showCompletedLevels ? (
            <>
              <EyeOff className="w-4 h-4" />
              Hide Completed
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Show Completed
            </>
          )}
        </button>
      </div>

      {/* Sign-in Banner for guests */}
      {!user && !signInBannerDismissed && (
        <div className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <Cloud className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-blue-200">
              Your progress is saved locally on this device.{' '}
              <button
                onClick={onSignIn}
                className="text-blue-400 font-medium hover:text-blue-300 hover:underline transition-colors"
              >
                Sign in
              </button>{' '}
              to sync across all your devices and never lose your data.
            </p>
          </div>
          <button
            onClick={dismissSignInBanner}
            className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-zinc-300">Items Progress</span>
              <span className="text-sm font-bold text-amber-400">{overallProgress}%</span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              Items collected for remaining upgrades
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-zinc-300">Workshop</span>
              <span className="text-sm font-bold text-emerald-400">
                {workshopStats.completed}/{workshopStats.total}
              </span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-500"
                style={{ width: `${(workshopStats.completed / workshopStats.total) * 100}%` }}
              />
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              Levels completed across all stations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-zinc-300">Scrappy</span>
              <span className="text-sm font-bold text-purple-400">
                Level {scrappyStats.currentLevel}/{scrappyStats.maxLevel}
              </span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${(scrappyStats.currentLevel / scrappyStats.maxLevel) * 100}%` }}
              />
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              Your companion&apos;s level
            </p>
          </CardContent>
        </Card>
      </div>

      {/* View Tabs - Scrollable */}
      <div className="overflow-x-auto -mx-6 px-6 lg:-mx-8 lg:px-8">
        <div className="flex gap-1.5 border-b border-zinc-800 pb-2 min-w-max">
          {VIEW_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;

            // Get completion status for workshop stations
            let completionBadge = null;
            if (tab.id !== 'checklist' && tab.id !== 'scrappy') {
              const station = WORKSHOP_STATIONS.find(s => s.id === tab.id);
              if (station) {
                const currentLevel = getWorkshopLevel(station.id);
                const maxLevel = station.levels.length;
                if (currentLevel >= maxLevel) {
                  completionBadge = <CheckCircle2 className="w-3 h-3 text-emerald-400" />;
                }
              }
            } else if (tab.id === 'scrappy') {
              const maxScrappy = Math.max(...SCRAPPY_UPGRADES.map(u => u.level));
              if (progress.scrappyLevel >= maxScrappy) {
                completionBadge = <CheckCircle2 className="w-3 h-3 text-emerald-400" />;
              }
            }

            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer',
                  isActive
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                )}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {tab.label}
                {completionBadge}
              </button>
            );
          })}
        </div>
      </div>

      {/* Checklist View */}
      {activeView === 'checklist' && (
        <div className="space-y-4 animate-in fade-in-0 duration-200">
          {/* Pro Tips */}
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400" />
                Pro Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {HOARDING_TIPS.slice(0, 3).map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      tip.priority === 'critical' ? 'text-red-400' : 'text-amber-400'
                    }`} />
                    <div>
                      <span className="font-medium text-zinc-200">{tip.title}:</span>{' '}
                      <span className="text-zinc-400">{tip.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Categories */}
          {Object.entries(HOARDING_CATEGORIES).map(([categoryId, category]) => {
            const isExpanded = expandedCategories.has(categoryId);
            // Filter items to only show those still required
            const relevantItems = category.items.filter(item =>
              showCompletedLevels || isItemStillRequired(item.itemId)
            );

            if (relevantItems.length === 0 && !showCompletedLevels) return null;

            const categoryProgress = relevantItems.reduce((acc, item) => {
              const have = stashQuantities.get(item.itemId) || 0;
              return acc + (have >= item.totalNeeded ? 1 : 0);
            }, 0);
            const totalItems = relevantItems.length;

            return (
              <Card key={categoryId}>
                <button
                  onClick={() => toggleCategory(categoryId)}
                  className="w-full cursor-pointer"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-zinc-500" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-zinc-500" />
                        )}
                        <div className="text-left">
                          <CardTitle className="text-base">{category.name}</CardTitle>
                          <p className="text-xs text-zinc-500 mt-0.5">{category.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-1 rounded border ${priorityColors[category.priority]}`}>
                          {priorityLabels[category.priority]}
                        </span>
                        <span className="text-sm text-zinc-400">
                          {categoryProgress}/{totalItems}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                </button>

                {isExpanded && (
                  <CardContent className="pt-0 animate-expand">
                    <div className="border-t border-zinc-800 pt-4">
                      <div className="grid gap-2">
                        {relevantItems.map((item) => {
                          const have = stashQuantities.get(item.itemId) || 0;
                          const hasEnough = have >= item.totalNeeded;
                          const stillRequired = isItemStillRequired(item.itemId);
                          const itemData = ITEMS[item.itemId];

                          return (
                            <div
                              key={item.itemId}
                              className={cn(
                                'flex items-center gap-3 p-3 rounded-lg',
                                !stillRequired && 'opacity-50',
                                hasEnough ? 'bg-emerald-500/10' : 'bg-zinc-800/50'
                              )}
                            >
                              {/* Item Image */}
                              <div className={cn(
                                'w-10 h-10 rounded flex items-center justify-center overflow-hidden flex-shrink-0',
                                itemData?.rarity ? rarityBgColors[itemData.rarity] : 'bg-zinc-700'
                              )}>
                                {itemData?.imageUrl ? (
                                  <img
                                    src={itemData.imageUrl}
                                    alt={item.itemName}
                                    className="w-8 h-8 object-contain"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <Package className="w-5 h-5 text-zinc-500" />
                                )}
                              </div>

                              {/* Item Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className={cn(
                                    'font-medium',
                                    !stillRequired ? 'text-zinc-500 line-through' : hasEnough ? 'text-emerald-400' : 'text-white'
                                  )}>
                                    {item.itemName}
                                  </span>
                                  {!stillRequired && (
                                    <span className="text-xs px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">
                                      Complete
                                    </span>
                                  )}
                                  {stillRequired && hasEnough && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                  )}
                                </div>
                                <p className="text-xs text-zinc-500 truncate">{item.source}</p>
                              </div>

                              {/* Quantity */}
                              <div className="text-right">
                                <div className={`text-sm font-mono ${
                                  !stillRequired ? 'text-zinc-500' : hasEnough ? 'text-emerald-400' : have > 0 ? 'text-amber-400' : 'text-zinc-400'
                                }`}>
                                  {have}/{item.totalNeeded}
                                </div>
                                {stillRequired && !hasEnough && have > 0 && (
                                  <div className="text-xs text-zinc-500">
                                    Need {item.totalNeeded - have} more
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Individual Workshop Station View */}
      {isWorkshopView && activeStation && (
        <div className="space-y-4 animate-in fade-in-0 duration-200">
          {/* Station Header Card */}
          <Card className="border-amber-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    {(() => {
                      const Icon = stationIcons[activeStation.id] || Wrench;
                      return <Icon className="w-6 h-6 text-amber-400" />;
                    })()}
                  </div>
                  <div>
                    <CardTitle>{activeStation.name}</CardTitle>
                    <p className="text-sm text-zinc-400 mt-1">
                      {activeStation.description}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-zinc-400">
                  Level {getWorkshopLevel(activeStation.id)}/{activeStation.levels.length}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(() => {
                  const currentLevel = getWorkshopLevel(activeStation.id);
                  const visibleLevels = activeStation.levels.filter(level =>
                    showCompletedLevels || level.level > currentLevel
                  );

                  // If all levels complete and not showing completed
                  if (visibleLevels.length === 0 && !showCompletedLevels) {
                    return (
                      <div className="text-center py-8 slide-down">
                        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                        <p className="text-emerald-400 font-medium">{activeStation.name} is fully upgraded!</p>
                        <p className="text-zinc-500 text-sm mt-1">Toggle show completed to see past upgrades</p>
                      </div>
                    );
                  }

                  return visibleLevels.map((level) => {
                    const isLevelComplete = isWorkshopLevelComplete(activeStation.id, level.level);
                    const canComplete = level.level === currentLevel + 1;
                    const isExpanded = expandedLevels.has(`${activeStation.id}-${level.level}`);
                    const levelKey = `${activeStation.id}-${level.level}`;

                    return (
                      <div
                        key={level.level}
                        className={cn(
                          'rounded-lg border',
                          isLevelComplete
                            ? 'border-emerald-500/30 bg-emerald-500/5'
                            : 'border-zinc-800 bg-zinc-900/50'
                        )}
                      >
                        {/* Level Header - Collapsible */}
                        <div className="flex items-center justify-between p-3">
                          <div
                            className="flex items-center gap-2 cursor-pointer flex-1 hover:bg-zinc-800/50 rounded-lg -mx-2 px-2 py-1"
                            onClick={() => toggleLevel(levelKey)}
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-zinc-500" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-zinc-500" />
                            )}
                            <h4 className={cn(
                              'text-sm font-semibold flex items-center gap-2',
                              isLevelComplete ? 'text-emerald-400' : 'text-zinc-300'
                            )}>
                              Level {level.level}
                              {isLevelComplete && <CheckCircle2 className="w-4 h-4" />}
                            </h4>
                            <span className="text-xs text-zinc-500">
                              {level.unlocks.join(', ')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {isLevelComplete ? (
                              level.level === currentLevel && (
                                <button
                                  onClick={() => unmarkWorkshopLevelComplete(activeStation.id, level.level)}
                                  className="px-3 py-1 rounded text-xs font-medium transition-colors bg-zinc-700 text-zinc-300 hover:bg-zinc-600 flex items-center gap-1.5 cursor-pointer"
                                  title="Undo - mark as incomplete"
                                >
                                  <Undo2 className="w-3 h-3" />
                                  Undo
                                </button>
                              )
                            ) : (
                              <button
                                onClick={() => {
                                  if (canComplete) {
                                    markWorkshopLevelComplete(activeStation.id, level.level);
                                  }
                                }}
                                disabled={!canComplete}
                                className={cn(
                                  'px-3 py-1 rounded text-xs font-medium transition-colors',
                                  canComplete
                                    ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 cursor-pointer'
                                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                )}
                                title={!canComplete ? 'Complete previous levels first' : 'Mark as completed in-game'}
                              >
                                {canComplete ? (
                                  'Mark Complete'
                                ) : (
                                  <Lock className="w-3 h-3" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Level Requirements - Collapsible Content */}
                        {isExpanded && (
                          <div className="px-3 pb-3 animate-expand">
                            <div className="border-t border-zinc-800 pt-3 grid gap-2">
                              {level.requirements.map((req) => {
                                const have = stashQuantities.get(req.itemId) || 0;
                                const hasEnough = have >= req.quantity;
                                const itemData = ITEMS[req.itemId];

                                return (
                                  <div
                                    key={req.itemId}
                                    className={cn(
                                      'flex items-center gap-3 p-2 rounded',
                                      isLevelComplete ? 'bg-transparent' : hasEnough ? 'bg-emerald-500/10' : 'bg-zinc-800/50'
                                    )}
                                  >
                                    <div className={cn(
                                      'w-8 h-8 rounded flex items-center justify-center overflow-hidden flex-shrink-0',
                                      itemData?.rarity ? rarityBgColors[itemData.rarity] : 'bg-zinc-700'
                                    )}>
                                      {itemData?.imageUrl ? (
                                        <img
                                          src={itemData.imageUrl}
                                          alt={req.itemName}
                                          className="w-6 h-6 object-contain"
                                          onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                          }}
                                        />
                                      ) : (
                                        <Package className="w-4 h-4 text-zinc-500" />
                                      )}
                                    </div>
                                    <span className={cn(
                                      'flex-1 text-sm',
                                      isLevelComplete ? 'text-zinc-500 line-through' : hasEnough ? 'text-emerald-400' : 'text-zinc-300'
                                    )}>
                                      {req.itemName}
                                    </span>
                                    <span className={cn(
                                      'text-sm font-mono',
                                      isLevelComplete ? 'text-zinc-600' : hasEnough ? 'text-emerald-400' : have > 0 ? 'text-amber-400' : 'text-zinc-500'
                                    )}>
                                      {have}/{req.quantity}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Scrappy View */}
      {activeView === 'scrappy' && (
        <div className="space-y-4 animate-in fade-in-0 duration-200">
          <Card className="border-amber-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Dog className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <CardTitle>Scrappy Upgrades</CardTitle>
                    <p className="text-sm text-zinc-400 mt-1">
                      Your rooster companion - Level {progress.scrappyLevel}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {SCRAPPY_UPGRADES.map((level) => {
                  const isLevelComplete = isScrappyLevelComplete(level.level);
                  const canComplete = level.level === progress.scrappyLevel + 1;
                  const itemsReady = level.requirements.every((req) => {
                    const have = stashQuantities.get(req.itemId) || 0;
                    return have >= req.quantity;
                  });

                  // Hide completed levels unless showing
                  if (isLevelComplete && !showCompletedLevels) return null;

                  return (
                    <div
                      key={level.level}
                      className={cn(
                        'space-y-2 p-3 rounded-lg',
                        isLevelComplete && 'opacity-50 bg-zinc-800/30'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className={cn(
                          'text-sm font-semibold flex items-center gap-2',
                          isLevelComplete ? 'text-emerald-400' : 'text-zinc-300'
                        )}>
                          Level {level.level}
                          {isLevelComplete && <CheckCircle2 className="w-4 h-4" />}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-500">
                            {level.unlocks.join(', ')}
                          </span>
                          {isLevelComplete ? (
                            // Show undo button only for the current level (highest completed)
                            level.level === progress.scrappyLevel && level.level > 1 && (
                              <button
                                onClick={() => {
                                  unmarkScrappyLevelComplete(level.level);
                                }}
                                className="px-3 py-1 rounded text-xs font-medium transition-colors bg-zinc-700 text-zinc-300 hover:bg-zinc-600 flex items-center gap-1.5 cursor-pointer"
                                title="Undo - mark as incomplete"
                              >
                                <Undo2 className="w-3 h-3" />
                                Undo
                              </button>
                            )
                          ) : (
                            <button
                              onClick={() => {
                                if (canComplete) {
                                  markScrappyLevelComplete(level.level);
                                }
                              }}
                              disabled={!canComplete}
                              className={cn(
                                'px-3 py-1 rounded text-xs font-medium transition-colors',
                                canComplete
                                  ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 cursor-pointer'
                                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                              )}
                              title={!canComplete ? 'Complete previous levels first' : 'Mark as completed in-game'}
                            >
                              {canComplete ? (
                                'Mark Complete'
                              ) : (
                                <Lock className="w-3 h-3" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="grid gap-2">
                        {level.requirements.map((req) => {
                          const have = stashQuantities.get(req.itemId) || 0;
                          const hasEnough = have >= req.quantity;
                          const itemData = ITEMS[req.itemId];

                          return (
                            <div
                              key={req.itemId}
                              className={cn(
                                'flex items-center gap-3 p-3 rounded-lg',
                                isLevelComplete ? 'bg-transparent' : hasEnough ? 'bg-emerald-500/10' : 'bg-zinc-800/50'
                              )}
                            >
                              <div className={cn(
                                'w-10 h-10 rounded flex items-center justify-center overflow-hidden flex-shrink-0',
                                itemData?.rarity ? rarityBgColors[itemData.rarity] : 'bg-zinc-700'
                              )}>
                                {itemData?.imageUrl ? (
                                  <img
                                    src={itemData.imageUrl}
                                    alt={req.itemName}
                                    className="w-8 h-8 object-contain"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <Package className="w-5 h-5 text-zinc-500" />
                                )}
                              </div>
                              <div className="flex-1">
                                <span className={cn(
                                  'font-medium',
                                  isLevelComplete ? 'text-zinc-500 line-through' : hasEnough ? 'text-emerald-400' : 'text-white'
                                )}>
                                  {req.itemName}
                                </span>
                                {itemData && (
                                  <p className="text-xs text-zinc-500">{itemData.description}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <div className={cn(
                                  'text-sm font-mono',
                                  isLevelComplete ? 'text-zinc-600' : hasEnough ? 'text-emerald-400' : have > 0 ? 'text-amber-400' : 'text-zinc-400'
                                )}>
                                  {have}/{req.quantity}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* All complete message */}
                {progress.scrappyLevel >= Math.max(...SCRAPPY_UPGRADES.map(u => u.level)) && !showCompletedLevels && (
                  <div className="text-center py-8 slide-down">
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                    <p className="text-emerald-400 font-medium">Scrappy is fully upgraded!</p>
                    <p className="text-zinc-500 text-sm mt-1">Toggle show completed to see past upgrades</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Warning about trinkets - only show if there are still trinkets needed */}
          {(isItemStillRequired('dog_collar') || isItemStillRequired('cat_bed') || isItemStillRequired('very_comfortable_pillow')) && (
            <Card className="border-red-500/30 bg-red-500/5 slide-down">
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-400">Important Warning</h4>
                    <p className="text-sm text-zinc-400 mt-1">
                      Dog Collar, Cat Bed, and Very Comfortable Pillow are <strong>trinkets</strong> that
                      look like they should be sold. <strong>DO NOT SELL THEM!</strong> They are required
                      for Scrappy upgrades and are difficult to find again.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
