'use client';

import { useState } from 'react';
import { Crosshair, Target, Wrench, Construction } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TierList } from './TierList';
import {
  PVE_WEAPONS_TIER_LIST,
  PVP_WEAPONS_TIER_LIST,
  ATTACHMENTS_TIER_LIST,
} from '@/data/tier-lists';

type TierListTab = 'pvp' | 'pve' | 'attachments';

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  comingSoon?: boolean;
}

function TabButton({ active, onClick, icon, label, comingSoon }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200',
        'text-sm sm:text-base',
        active
          ? 'bg-accent text-black shadow-lg shadow-accent/25'
          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
      )}
    >
      {icon}
      <span>{label}</span>
      {comingSoon && (
        <span className="text-[10px] px-1.5 py-0.5 bg-zinc-700 rounded text-zinc-300 uppercase">
          Soon
        </span>
      )}
    </button>
  );
}

function PlaceholderContent({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-6 border border-zinc-700">
        <Construction className="w-10 h-10 text-accent" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-zinc-400 max-w-md">{description}</p>
      <div className="mt-6 flex items-center gap-2 text-accent">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <span className="text-sm font-medium">Coming Soon</span>
      </div>
    </div>
  );
}

export function TierListPage() {
  const [activeTab, setActiveTab] = useState<TierListTab>('pvp');

  // Check if tier list has any content
  const attachmentsHasContent = ATTACHMENTS_TIER_LIST.tiers.some(t => t.attachments.length > 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Weapon Tier Lists</h1>
        <p className="text-zinc-400 mt-1">
          Community-curated rankings for weapons and attachments
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        <TabButton
          active={activeTab === 'pvp'}
          onClick={() => setActiveTab('pvp')}
          icon={<Crosshair className="w-5 h-5" />}
          label="PvP Weapons"
        />
        <TabButton
          active={activeTab === 'pve'}
          onClick={() => setActiveTab('pve')}
          icon={<Target className="w-5 h-5" />}
          label="PvE Weapons"
        />
        <TabButton
          active={activeTab === 'attachments'}
          onClick={() => setActiveTab('attachments')}
          icon={<Wrench className="w-5 h-5" />}
          label="Attachments"
          comingSoon={!attachmentsHasContent}
        />
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        {activeTab === 'pvp' && <TierList data={PVP_WEAPONS_TIER_LIST} />}

        {activeTab === 'pve' && <TierList data={PVE_WEAPONS_TIER_LIST} />}

        {activeTab === 'attachments' && (
          attachmentsHasContent ? (
            <div>Attachments tier list</div>
          ) : (
            <PlaceholderContent
              title="Attachments Tier List"
              description="Attachment rankings are in the works. Soon you'll know exactly which mods to prioritize for your loadouts."
            />
          )
        )}
      </div>
    </div>
  );
}
