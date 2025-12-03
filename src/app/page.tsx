'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Package,
  TrendingUp,
  Target,
  Building2,
  Hammer,
  Recycle,
  Shirt,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { StashAnalyzer, ItemPicker } from '@/components/stash';
import { LoadoutManager } from '@/components/loadouts';
import { HoardingGuide } from '@/components/hoarding';
import { RecyclablesGuide } from '@/components/recyclables';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { useAuth, useSubscription, useProgress } from '@/context';
import { DashboardAd } from '@/components/subscription';
import { ThemeSelector } from '@/components/settings';
import { DEFAULT_LOADOUTS } from '@/data';
import type { StashItem, Loadout } from '@/types';

// Demo data for non-authenticated users
const DEMO_STASH: StashItem[] = [
  // Basic Materials
  { itemId: 'chemicals', quantity: 87, addedAt: new Date() },
  { itemId: 'fabric', quantity: 45, addedAt: new Date() },
  { itemId: 'plastic_parts', quantity: 23, addedAt: new Date() },
  { itemId: 'metal_parts', quantity: 32, addedAt: new Date() },
  { itemId: 'rubber_parts', quantity: 18, addedAt: new Date() },
  // Topside Materials
  { itemId: 'arc_alloy', quantity: 8, addedAt: new Date() },
  { itemId: 'arc_circuitry', quantity: 12, addedAt: new Date() },
  { itemId: 'arc_powercell', quantity: 15, addedAt: new Date() },
  // Advanced Materials
  { itemId: 'advanced_arc_powercell', quantity: 4, addedAt: new Date() },
  { itemId: 'complex_gun_parts', quantity: 2, addedAt: new Date() },
  // Weapons
  { itemId: 'burletta_i', quantity: 2, addedAt: new Date() },
  { itemId: 'ferro_i', quantity: 1, addedAt: new Date() },
  { itemId: 'rattler_i', quantity: 1, addedAt: new Date() },
  // Quick Use
  { itemId: 'defibrillator', quantity: 3, addedAt: new Date() },
  { itemId: 'bandage', quantity: 8, addedAt: new Date() },
  { itemId: 'adrenaline_shot', quantity: 2, addedAt: new Date() },
  // Trinkets
  { itemId: 'fine_wristwatch', quantity: 2, addedAt: new Date() },
  { itemId: 'film_reel', quantity: 3, addedAt: new Date() },
  // Keys
  { itemId: 'blue_gate_cellar_key', quantity: 1, addedAt: new Date() },
  { itemId: 'dam_staff_room_key', quantity: 1, addedAt: new Date() },
  // Ammo
  { itemId: 'light_ammo', quantity: 90, addedAt: new Date() },
  { itemId: 'medium_ammo', quantity: 45, addedAt: new Date() },
  { itemId: 'shotgun_ammo', quantity: 20, addedAt: new Date() },
  // Recyclables
  { itemId: 'alarm_clock', quantity: 5, addedAt: new Date() },
  { itemId: 'duct_tape', quantity: 8, addedAt: new Date() },
];

const DEMO_ACTIVE_QUESTS: string[] = [];
const DEMO_COMPLETED_QUESTS: string[] = [];

export default function Home() {
  const { user, userProfile, loading, signInWithGoogle, signOut, updateUserProfile, isNewAccount } = useAuth();
  const { progress } = useProgress();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showItemPicker, setShowItemPicker] = useState(false);

  // Local state for demo mode (when not signed in)
  const [localStash, setLocalStash] = useState<StashItem[]>([]);
  const [stashInitialized, setStashInitialized] = useState(false);
  const [localLoadouts, setLocalLoadouts] = useState<Loadout[]>([]);
  const [loadoutsInitialized, setLoadoutsInitialized] = useState(false);
  const [dataTransferred, setDataTransferred] = useState(false);

  // Initialize stash from localStorage or defaults on mount
  useEffect(() => {
    const storedStash = localStorage.getItem('arc-companion-stash');
    if (storedStash) {
      try {
        const parsed = JSON.parse(storedStash);
        // Convert stored dates back to Date objects
        const stash = parsed.map((s: StashItem) => ({
          ...s,
          addedAt: new Date(s.addedAt),
        }));
        setLocalStash(stash);
      } catch {
        // If parsing fails, use demo stash
        setLocalStash([...DEMO_STASH]);
      }
    } else {
      // First time - use demo stash
      setLocalStash([...DEMO_STASH]);
    }
    setStashInitialized(true);
  }, []);

  // Save stash to localStorage whenever it changes
  useEffect(() => {
    if (stashInitialized) {
      localStorage.setItem('arc-companion-stash', JSON.stringify(localStash));
    }
  }, [localStash, stashInitialized]);

  // Initialize loadouts from localStorage or defaults on mount
  useEffect(() => {
    const storedLoadouts = localStorage.getItem('arc-companion-loadouts');
    if (storedLoadouts) {
      try {
        const parsed = JSON.parse(storedLoadouts);
        // Convert stored dates back to Date objects
        const loadouts = parsed.map((l: Loadout) => ({
          ...l,
          createdAt: new Date(l.createdAt),
          updatedAt: new Date(l.updatedAt),
        }));
        setLocalLoadouts(loadouts);
      } catch {
        // If parsing fails, use default loadouts
        setLocalLoadouts([...DEFAULT_LOADOUTS]);
      }
    } else {
      // First time - use default loadouts
      setLocalLoadouts([...DEFAULT_LOADOUTS]);
    }
    setLoadoutsInitialized(true);
  }, []);

  // Save loadouts to localStorage whenever they change
  useEffect(() => {
    if (loadoutsInitialized && localLoadouts.length > 0) {
      localStorage.setItem('arc-companion-loadouts', JSON.stringify(localLoadouts));
    }
  }, [localLoadouts, loadoutsInitialized]);

  // Transfer local data to new account when user signs in for the first time
  useEffect(() => {
    if (
      isNewAccount &&
      user &&
      stashInitialized &&
      loadoutsInitialized &&
      !dataTransferred &&
      updateUserProfile
    ) {
      // Only transfer if there's actual local data (not just demo defaults)
      const hasLocalStashData = localStash.length > 0;
      const hasCustomLoadouts = localLoadouts.some(l => !l.isDefault);

      if (hasLocalStashData || hasCustomLoadouts) {
        // Transfer local stash and loadouts to the new account
        updateUserProfile({
          stash: localStash,
          loadouts: localLoadouts,
        });
        setDataTransferred(true);
      }
    }
  }, [isNewAccount, user, stashInitialized, loadoutsInitialized, dataTransferred, localStash, localLoadouts, updateUserProfile]);

  // Use profile data if signed in, otherwise demo data
  const stash = userProfile?.stash || localStash;
  const activeQuests = userProfile?.activeQuests || DEMO_ACTIVE_QUESTS;
  const completedQuests = userProfile?.completedQuests || DEMO_COMPLETED_QUESTS;
  const loadouts = userProfile?.loadouts || localLoadouts;

  const handleAddItems = useCallback((items: { itemId: string; quantity: number }[]) => {
    // Calculate the new stash
    const currentStash = user && userProfile?.stash ? userProfile.stash : localStash;
    let updated = [...currentStash];
    for (const { itemId, quantity } of items) {
      const existingIndex = updated.findIndex((item) => item.itemId === itemId);
      if (existingIndex >= 0) {
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
      } else {
        updated.push({ itemId, quantity, addedAt: new Date() });
      }
    }

    if (user && updateUserProfile) {
      // Sync to Firebase when logged in
      updateUserProfile({ stash: updated });
    } else {
      // Update local state for guests
      setLocalStash(updated);
    }
  }, [user, userProfile?.stash, localStash, updateUserProfile]);

  const handleRemoveItem = useCallback((itemId: string, quantity: number) => {
    const currentStash = user && userProfile?.stash ? userProfile.stash : localStash;
    const existingIndex = currentStash.findIndex((item) => item.itemId === itemId);
    if (existingIndex === -1) return;

    const existing = currentStash[existingIndex];
    let updated: StashItem[];
    if (quantity >= existing.quantity) {
      // Remove the item entirely
      updated = currentStash.filter((item) => item.itemId !== itemId);
    } else {
      // Decrease quantity
      updated = [...currentStash];
      updated[existingIndex] = {
        ...existing,
        quantity: existing.quantity - quantity,
      };
    }

    if (user && updateUserProfile) {
      // Sync to Firebase when logged in
      updateUserProfile({ stash: updated });
    } else {
      // Update local state for guests
      setLocalStash(updated);
    }
  }, [user, userProfile?.stash, localStash, updateUserProfile]);

  const handleClearStash = useCallback(() => {
    if (user && updateUserProfile) {
      // Sync to Firebase when logged in
      updateUserProfile({ stash: [] });
    } else {
      // Update local state for guests
      setLocalStash([]);
    }
  }, [user, updateUserProfile]);

  const handleUpdateLoadouts = useCallback((loadouts: Loadout[]) => {
    if (user && updateUserProfile) {
      // Sync to Firebase when logged in
      updateUserProfile({ loadouts });
    } else {
      // Update local state for guests
      setLocalLoadouts(loadouts);
    }
  }, [user, updateUserProfile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-zinc-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header
        user={user ? { displayName: user.displayName || 'Raider', email: user.email || '' } : null}
        onLogin={signInWithGoogle}
        onLogout={signOut}
        onToggleSidebar={() => setMobileSidebarOpen(true)}
      />

      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
          onCollapsedChange={setSidebarCollapsed}
        />

        {/* Main content with left margin to account for fixed sidebar */}
        <main className={`flex-1 p-6 lg:p-8 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-14' : 'lg:ml-56'}`}>
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-zinc-400 mt-1">
                  Your Arc Raiders companion at a glance
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  icon={Package}
                  label="Items in Stash"
                  value={stash.length}
                  color="accent"
                />
                <StatCard
                  icon={Target}
                  label="Active Quests"
                  value={activeQuests.length}
                  color="accent"
                />
                <StatCard
                  icon={Hammer}
                  label="Workshop Upgrades"
                  value={Object.values(progress.workshopLevels).reduce((a, b) => a + b, 0) + (progress.scrappyLevel - 1)}
                  color="emerald"
                />
                <StatCard
                  icon={TrendingUp}
                  label="Loadouts"
                  value={loadouts.length}
                  color="violet"
                />
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    <button
                      onClick={() => setActiveTab('stash')}
                      className="p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors text-left"
                    >
                      <Package className="w-6 h-6 text-accent mb-2" />
                      <p className="font-medium text-white">Raider Stash</p>
                      <p className="text-xs text-zinc-500 mt-1">
                        Get KEEP/SELL/RECYCLE advice
                      </p>
                    </button>
                    <button
                      onClick={() => setActiveTab('hoarding')}
                      className="p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors text-left"
                    >
                      <Hammer className="w-6 h-6 text-red-400 mb-2" />
                      <p className="font-medium text-white">Workshop Upgrades</p>
                      <p className="text-xs text-zinc-500 mt-1">
                        Items to save for upgrades
                      </p>
                    </button>
                    <button
                      onClick={() => setActiveTab('recyclables')}
                      className="p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors text-left"
                    >
                      <Recycle className="w-6 h-6 text-emerald-400 mb-2" />
                      <p className="font-medium text-white">Recycle & Sell</p>
                      <p className="text-xs text-zinc-500 mt-1">
                        What to recycle vs sell
                      </p>
                    </button>
                    <button
                      onClick={() => setActiveTab('loadouts')}
                      className="p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors text-left"
                    >
                      <Shirt className="w-6 h-6 text-emerald-400 mb-2" />
                      <p className="font-medium text-white">Manage Loadouts</p>
                      <p className="text-xs text-zinc-500 mt-1">
                        Create gear presets
                      </p>
                    </button>
                    <button
                      onClick={() => setActiveTab('quests')}
                      className="p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors text-left"
                    >
                      <TrendingUp className="w-6 h-6 text-blue-400 mb-2" />
                      <p className="font-medium text-white">Quest Tracker</p>
                      <p className="text-xs text-zinc-500 mt-1">
                        Track requirements
                      </p>
                    </button>
                    <button
                      onClick={() => setActiveTab('hideout')}
                      className="p-4 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors text-left"
                    >
                      <Building2 className="w-6 h-6 text-violet-400 mb-2" />
                      <p className="font-medium text-white">Hideout Planner</p>
                      <p className="text-xs text-zinc-500 mt-1">
                        Plan upgrades
                      </p>
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity / Tips */}
              <Card>
                <CardHeader>
                  <CardTitle>Pro Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-zinc-400">
                    <li className="flex items-start gap-2">
                      <span className="text-accent">💡</span>
                      <span>
                        Common materials like Scrap Metal and Plastic can be sold
                        once you have 100+. You&apos;ll always find more.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">💡</span>
                      <span>
                        Keycards are always worth keeping - they grant access to
                        high-value loot areas.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent">💡</span>
                      <span>
                        Recycling common weapons often yields more value than
                        selling them directly.
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Dashboard Ad for free users */}
              <DashboardAd />
            </div>
          )}

          {/* Stash Tab */}
          {activeTab === 'stash' && (
            showItemPicker ? (
              <ItemPicker
                existingItems={stash}
                onAddItems={handleAddItems}
                onClose={() => setShowItemPicker(false)}
                sidebarCollapsed={sidebarCollapsed}
              />
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-white">
                      Raider Stash
                    </h1>
                    <p className="text-zinc-400 mt-1">
                      Smart recommendations for your inventory
                    </p>
                  </div>
                  <button
                    onClick={() => setShowItemPicker(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-light text-black font-medium rounded-lg transition-colors"
                  >
                    <Package className="w-4 h-4" />
                    Add Items to Stash
                  </button>
                </div>

                <StashAnalyzer
                  stash={stash}
                  activeQuests={activeQuests}
                  completedQuests={completedQuests}
                  hideoutLevels={{}}
                  onRemoveItem={handleRemoveItem}
                  onClearStash={handleClearStash}
                  onSignIn={signInWithGoogle}
                />
              </div>
            )
          )}

          {/* Hoarding Guide Tab */}
          {activeTab === 'hoarding' && (
            <HoardingGuide stash={stash} onSignIn={signInWithGoogle} />
          )}

          {/* Recyclables Guide Tab */}
          {activeTab === 'recyclables' && (
            <RecyclablesGuide />
          )}

          {/* Loadouts Tab */}
          {activeTab === 'loadouts' && (loadoutsInitialized || userProfile?.loadouts) && (
            <LoadoutManager
              loadouts={loadouts}
              onUpdateLoadouts={handleUpdateLoadouts}
              onSignIn={signInWithGoogle}
            />
          )}

          {/* Quests Tab - Coming Soon */}
          {activeTab === 'quests' && (
            <ComingSoon
              title="Quest Tracker"
              description="Track quest requirements, see what items you need, and plan your raids."
            />
          )}

          {/* Hideout Tab - Coming Soon */}
          {activeTab === 'hideout' && (
            <ComingSoon
              title="Hideout Planner"
              description="Plan your hideout upgrades and see material requirements."
            />
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-zinc-400 mt-1">
                  Customize your experience
                </p>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <ThemeSelector />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Help Tab - Coming Soon */}
          {activeTab === 'help' && (
            <ComingSoon
              title="Help & FAQ"
              description="Get help using Arc Raiders Companion and learn tips for your raids."
            />
          )}
        </main>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: typeof Package;
  label: string;
  value: number;
  color: 'blue' | 'accent' | 'emerald' | 'violet';
}

function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-400',
    accent: 'bg-accent/10 text-accent',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    violet: 'bg-violet-500/10 text-violet-400',
  };

  return (
    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
      <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-zinc-500">{label}</p>
    </div>
  );
}

interface ComingSoonProps {
  title: string;
  description: string;
}

function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
        <span className="text-3xl">🚧</span>
      </div>
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <p className="text-zinc-400 mt-2 max-w-md">{description}</p>
      <p className="text-accent mt-4 text-sm font-medium">Coming Soon</p>
    </div>
  );
}
