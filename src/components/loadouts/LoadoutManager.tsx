'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Plus,
  Swords,
  Lock,
  AlertTriangle,
  X,
  Cloud,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createEmptySlots } from '@/data';
import { LoadoutCard } from './LoadoutCard';
import { LoadoutSlotPicker } from './LoadoutSlotPicker';
import { useAuth, useSubscription } from '@/context';
import type { Loadout, LoadoutSlotType } from '@/types';

const SIGNIN_BANNER_DISMISSED_KEY = 'arc-raiders-loadouts-signin-banner-dismissed';

interface LoadoutManagerProps {
  loadouts: Loadout[];
  onUpdateLoadouts: (loadouts: Loadout[]) => void;
  onSignIn?: () => void;
}

interface EditingSlot {
  loadoutId: string;
  slotId: LoadoutSlotType;
}

export function LoadoutManager({
  loadouts,
  onUpdateLoadouts,
  onSignIn,
}: LoadoutManagerProps) {
  const [editingSlot, setEditingSlot] = useState<EditingSlot | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Loadout | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<Loadout | null>(null);
  const [newLoadoutName, setNewLoadoutName] = useState('');
  const [newLoadoutDescription, setNewLoadoutDescription] = useState('');
  const [editLoadoutName, setEditLoadoutName] = useState('');
  const [editLoadoutDescription, setEditLoadoutDescription] = useState('');
  const [signInBannerDismissed, setSignInBannerDismissed] = useState(true);

  const { user } = useAuth();
  const { canCreateLoadout: canCreateFromSub, maxLoadouts } = useSubscription();

  // Load banner dismissal state from localStorage
  useEffect(() => {
    const dismissed = localStorage.getItem(SIGNIN_BANNER_DISMISSED_KEY);
    setSignInBannerDismissed(dismissed === 'true');
  }, []);

  const dismissSignInBanner = () => {
    setSignInBannerDismissed(true);
    localStorage.setItem(SIGNIN_BANNER_DISMISSED_KEY, 'true');
  };

  // Calculate custom loadouts count (non-default loadouts)
  const customLoadoutCount = loadouts.filter(l => !l.isDefault).length;
  const remainingFreeSlots = Math.max(0, maxLoadouts - customLoadoutCount);
  const canCreate = canCreateFromSub(customLoadoutCount);

  // Get all loadouts (defaults + custom)
  const allLoadouts = [...loadouts];

  // Handle slot click
  const handleSlotClick = useCallback(
    (loadout: Loadout, slotId: LoadoutSlotType) => {
      setEditingSlot({ loadoutId: loadout.id, slotId });
    },
    []
  );

  // Handle item selection for slot
  const handleSelectItem = useCallback(
    (itemId: string | null) => {
      if (!editingSlot) return;

      const updatedLoadouts = loadouts.map((loadout) => {
        if (loadout.id === editingSlot.loadoutId) {
          return {
            ...loadout,
            slots: {
              ...loadout.slots,
              [editingSlot.slotId]: itemId,
            },
            updatedAt: new Date(),
          };
        }
        return loadout;
      });

      onUpdateLoadouts(updatedLoadouts);
      setEditingSlot(null);
    },
    [editingSlot, loadouts, onUpdateLoadouts]
  );

  // Handle duplicate
  const handleDuplicate = useCallback(
    (loadout: Loadout) => {
      if (!canCreate) return;

      const newLoadout: Loadout = {
        ...loadout,
        id: `custom-${Date.now()}`,
        name: `${loadout.name} (Copy)`,
        isDefault: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      onUpdateLoadouts([...loadouts, newLoadout]);
    },
    [loadouts, onUpdateLoadouts, canCreate]
  );

  // Handle delete
  const handleDelete = useCallback(
    (loadout: Loadout) => {
      if (loadout.isDefault) return;
      const updatedLoadouts = loadouts.filter((l) => l.id !== loadout.id);
      onUpdateLoadouts(updatedLoadouts);
      setShowDeleteConfirm(null);
    },
    [loadouts, onUpdateLoadouts]
  );

  // Handle create new loadout
  const handleCreate = useCallback(() => {
    if (!canCreate || !newLoadoutName.trim()) return;

    const newLoadout: Loadout = {
      id: `custom-${Date.now()}`,
      name: newLoadoutName.trim(),
      description: newLoadoutDescription.trim() || 'Custom loadout',
      icon: 'Swords',
      isDefault: false,
      slots: createEmptySlots(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onUpdateLoadouts([...loadouts, newLoadout]);
    setShowCreateModal(false);
    setNewLoadoutName('');
    setNewLoadoutDescription('');
  }, [loadouts, onUpdateLoadouts, canCreate, newLoadoutName, newLoadoutDescription]);

  // Handle opening edit modal
  const handleOpenEdit = useCallback((loadout: Loadout) => {
    setEditLoadoutName(loadout.name);
    setEditLoadoutDescription(loadout.description);
    setShowEditModal(loadout);
  }, []);

  // Handle saving edit
  const handleSaveEdit = useCallback(() => {
    if (!showEditModal || !editLoadoutName.trim()) return;

    const updatedLoadouts = loadouts.map((loadout) => {
      if (loadout.id === showEditModal.id) {
        return {
          ...loadout,
          name: editLoadoutName.trim(),
          description: editLoadoutDescription.trim() || loadout.description,
          updatedAt: new Date(),
        };
      }
      return loadout;
    });

    onUpdateLoadouts(updatedLoadouts);
    setShowEditModal(null);
    setEditLoadoutName('');
    setEditLoadoutDescription('');
  }, [showEditModal, loadouts, onUpdateLoadouts, editLoadoutName, editLoadoutDescription]);

  // Get current editing loadout and slot
  const editingLoadout = editingSlot
    ? allLoadouts.find((l) => l.id === editingSlot.loadoutId)
    : null;
  const currentSlotItemId = editingLoadout
    ? editingLoadout.slots[editingSlot!.slotId]
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Swords className="w-6 h-6 text-accent" />
            Loadouts
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Plan your gear for different playstyles
          </p>
        </div>

        {/* Sign-in Banner for guests */}
        {!user && !signInBannerDismissed && (
          <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg flex-1 sm:flex-initial sm:max-w-md">
            <Cloud className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <p className="text-sm text-blue-200 flex-1">
              <button
                onClick={onSignIn}
                className="text-blue-400 font-medium hover:text-blue-300 hover:underline transition-colors"
              >
                Sign in
              </button>{' '}
              to sync loadouts across devices.
            </p>
            <button
              onClick={dismissSignInBanner}
              className="p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Create Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          disabled={!canCreate}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
            canCreate
              ? 'bg-accent text-black hover:bg-accent-light'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          )}
        >
          {canCreate ? (
            <>
              <Plus className="w-5 h-5" />
              Create Loadout
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              Upgrade to Create More
            </>
          )}
        </button>
      </div>

      {/* Slots Info */}
      {remainingFreeSlots <= 2 && (
        <div className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700">
          <Swords className="w-5 h-5 text-accent" />
          <p className="text-sm text-zinc-400">
            {remainingFreeSlots > 0 ? (
              <>
                {remainingFreeSlots} custom loadout slot{remainingFreeSlots !== 1 ? 's' : ''} remaining
              </>
            ) : (
              'You\'ve used all custom loadout slots. Delete one to create a new loadout.'
            )}
          </p>
        </div>
      )}

      {/* Loadout Grid */}
      <div className="space-y-4">
        {allLoadouts.map((loadout) => (
          <LoadoutCard
            key={loadout.id}
            loadout={loadout}
            onEdit={() => handleOpenEdit(loadout)}
            onDuplicate={handleDuplicate}
            onDelete={() => setShowDeleteConfirm(loadout)}
            onSlotClick={handleSlotClick}
            canDuplicate={canCreate}
          />
        ))}

        {allLoadouts.length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            <Swords className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No loadouts yet. Create your first loadout!</p>
          </div>
        )}
      </div>

      {/* Slot Picker Modal */}
      {editingSlot && (
        <LoadoutSlotPicker
          isOpen={true}
          onClose={() => setEditingSlot(null)}
          slotId={editingSlot.slotId}
          currentItemId={currentSlotItemId}
          onSelectItem={handleSelectItem}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(null)}
          />
          <div className="relative bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Delete Loadout?</h3>
                <p className="text-sm text-zinc-400">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-zinc-300 mb-6">
              Are you sure you want to delete{' '}
              <span className="font-bold text-white">
                &quot;{showDeleteConfirm.name}&quot;
              </span>
              ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Loadout Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="relative bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Create New Loadout</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Loadout Name
                </label>
                <input
                  type="text"
                  value={newLoadoutName}
                  onChange={(e) => setNewLoadoutName(e.target.value)}
                  placeholder="My Custom Loadout"
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-accent"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={newLoadoutDescription}
                  onChange={(e) => setNewLoadoutDescription(e.target.value)}
                  placeholder="Describe your loadout strategy..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newLoadoutName.trim()}
                className={cn(
                  'flex-1 px-4 py-2.5 font-medium rounded-lg transition-colors',
                  newLoadoutName.trim()
                    ? 'bg-accent hover:bg-accent-light text-black'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                )}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Loadout Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowEditModal(null)}
          />
          <div className="relative bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Edit Loadout</h3>
              <button
                onClick={() => setShowEditModal(null)}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Loadout Name
                </label>
                <input
                  type="text"
                  value={editLoadoutName}
                  onChange={(e) => setEditLoadoutName(e.target.value)}
                  placeholder="My Custom Loadout"
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-accent"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Description
                </label>
                <textarea
                  value={editLoadoutDescription}
                  onChange={(e) => setEditLoadoutDescription(e.target.value)}
                  placeholder="Describe your loadout strategy..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(null)}
                className="flex-1 px-4 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={!editLoadoutName.trim()}
                className={cn(
                  'flex-1 px-4 py-2.5 font-medium rounded-lg transition-colors',
                  editLoadoutName.trim()
                    ? 'bg-accent hover:bg-accent-light text-black'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                )}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
