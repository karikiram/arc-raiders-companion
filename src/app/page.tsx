'use client';

import { useState, useCallback, useEffect } from 'react';
import { Package } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { StashAnalyzer, ItemPicker } from '@/components/stash';
import { LoadoutManager } from '@/components/loadouts';
import { HoardingGuide } from '@/components/hoarding';
import { RecyclablesGuide } from '@/components/recyclables';
import { ItemsDatabase } from '@/components/items-database';
import { Dashboard } from '@/components/dashboard';
import { TierListPage } from '@/components/tier-lists';
import { TwitchStreamsView } from '@/components/twitch/TwitchStreamsView';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { useAuth } from '@/context';
import { DashboardAd } from '@/components/subscription';
import { ThemeSelector } from '@/components/settings';
import { DEFAULT_LOADOUTS } from '@/data';
import type { StashItem, Loadout } from '@/types';

// Demo stash item IDs and quantities (dates added on client side to avoid hydration mismatch)
const DEMO_STASH_DATA = [
  // Basic Materials
  { itemId: 'chemicals', quantity: 87 },
  { itemId: 'fabric', quantity: 45 },
  { itemId: 'plastic_parts', quantity: 23 },
  { itemId: 'metal_parts', quantity: 32 },
  { itemId: 'rubber_parts', quantity: 18 },
  // Topside Materials
  { itemId: 'arc_alloy', quantity: 8 },
  { itemId: 'arc_circuitry', quantity: 12 },
  { itemId: 'arc_powercell', quantity: 15 },
  // Advanced Materials
  { itemId: 'advanced_arc_powercell', quantity: 4 },
  { itemId: 'complex_gun_parts', quantity: 2 },
  // Weapons
  { itemId: 'burletta_i', quantity: 2 },
  { itemId: 'ferro_i', quantity: 1 },
  { itemId: 'rattler_i', quantity: 1 },
  // Quick Use
  { itemId: 'defibrillator', quantity: 3 },
  { itemId: 'bandage', quantity: 8 },
  { itemId: 'adrenaline_shot', quantity: 2 },
  // Trinkets
  { itemId: 'fine_wristwatch', quantity: 2 },
  { itemId: 'film_reel', quantity: 3 },
  // Keys
  { itemId: 'blue_gate_cellar_key', quantity: 1 },
  { itemId: 'dam_staff_room_key', quantity: 1 },
  // Ammo
  { itemId: 'light_ammo', quantity: 90 },
  { itemId: 'medium_ammo', quantity: 45 },
  { itemId: 'shotgun_ammo', quantity: 20 },
  // Recyclables
  { itemId: 'alarm_clock', quantity: 5 },
  { itemId: 'duct_tape', quantity: 8 },
];

// Helper to create demo stash with dates (called on client side only)
const createDemoStash = (): StashItem[] =>
  DEMO_STASH_DATA.map(item => ({ ...item, addedAt: new Date() }));

const DEMO_ACTIVE_QUESTS: string[] = [];
const DEMO_COMPLETED_QUESTS: string[] = [];

export default function Home() {
  const { user, userProfile, loading, signInWithGoogle, signOut, updateUserProfile, isNewAccount } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
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
        setLocalStash(createDemoStash());
      }
    } else {
      // First time - use demo stash
      setLocalStash(createDemoStash());
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
          onHoverChange={setSidebarHovered}
        />

        {/* Main content with left margin to account for fixed sidebar */}
        <main className={`flex-1 p-6 lg:p-8 transition-all duration-200 ${sidebarHovered ? 'lg:ml-56' : 'lg:ml-14'}`}>
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <>
              <Dashboard onNavigate={setActiveTab} />
              {/* Dashboard Ad for free users */}
              <div className="mt-8">
                <DashboardAd />
              </div>
            </>
          )}

          {/* Stash Tab */}
          {activeTab === 'stash' && (
            showItemPicker ? (
              <ItemPicker
                existingItems={stash}
                onAddItems={handleAddItems}
                onClose={() => setShowItemPicker(false)}
                sidebarExpanded={sidebarHovered}
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

          {/* Items Database Tab */}
          {activeTab === 'items' && (
            <ItemsDatabase />
          )}

          {/* Tier Lists Tab */}
          {activeTab === 'tier-lists' && (
            <TierListPage />
          )}

          {/* Twitch Streams Tab */}
          {activeTab === 'twitch' && (
            <TwitchStreamsView />
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

          {/* Help Tab */}
          {activeTab === 'help' && (
            <HelpPanel />
          )}
        </main>
      </div>
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

function HelpPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Help & FAQ</h2>
        <p className="text-zinc-400 mt-1">Get help using Arc Raiders Companion</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Getting Started */}
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Getting Started</h3>
          <ul className="space-y-3 text-zinc-300">
            <li className="flex gap-3">
              <span className="text-accent font-bold">1.</span>
              <span>Sign in with Google to sync your data across devices</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold">2.</span>
              <span>Add items to your stash from the Dashboard</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold">3.</span>
              <span>Track your Workshop upgrades to get smart recommendations</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold">4.</span>
              <span>Create loadouts to plan your raids</span>
            </li>
          </ul>
        </div>

        {/* FAQ */}
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div>
              <p className="text-white font-medium">Is my data saved?</p>
              <p className="text-zinc-400 text-sm mt-1">
                Yes! When signed in, your data syncs to the cloud automatically.
              </p>
            </div>
            <div>
              <p className="text-white font-medium">How do recommendations work?</p>
              <p className="text-zinc-400 text-sm mt-1">
                We analyze your workshop progress to tell you what items to keep, sell, or recycle.
              </p>
            </div>
            <div>
              <p className="text-white font-medium">Is this app official?</p>
              <p className="text-zinc-400 text-sm mt-1">
                No, this is a fan-made tool not affiliated with Embark Studios.
              </p>
            </div>
          </div>
        </div>

        {/* Contact & Feedback */}
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Contact & Feedback</h3>
          <p className="text-zinc-400 mb-4">
            Found a bug or have a suggestion? We&apos;d love to hear from you!
          </p>
          <a
            href="mailto:support@arc-companion.com"
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-black font-medium rounded-lg transition-colors"
          >
            Send Feedback
          </a>
        </div>

        {/* Legal */}
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
          <div className="space-y-3">
            <a
              href="/privacy"
              className="block text-zinc-300 hover:text-accent transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="block text-zinc-300 hover:text-accent transition-colors"
            >
              Terms of Service
            </a>
          </div>
          <p className="text-zinc-500 text-sm mt-4">
            Arc Raiders Companion is not affiliated with Embark Studios.
          </p>
        </div>
      </div>
    </div>
  );
}
