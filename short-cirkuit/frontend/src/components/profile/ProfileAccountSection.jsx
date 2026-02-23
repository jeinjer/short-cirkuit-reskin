import React from 'react';
import { Save, Trash2, UserCircle2 } from 'lucide-react';
import { AVATAR_OPTIONS } from './profile.constants';

export default function ProfileAccountSection({
  user,
  selectedAvatar,
  setSelectedAvatar,
  savingProfile,
  onRemoveAvatar,
  onSaveProfile
}) {
  return (
    <section className="bg-[#0f0f15] border border-white/10 rounded-2xl p-5">
      <div className="flex items-center gap-2 text-cyan-300 font-bold mb-4">
        <UserCircle2 size={18} />
        Datos del perfil
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-1">
          <div className="bg-black/30 border border-white/10 rounded-xl p-4 flex flex-col items-center gap-3">
            {selectedAvatar ? (
              <img
                src={selectedAvatar}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border border-cyan-500/30 bg-white"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-black text-2xl">
                {(user?.name || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="text-center">
              <p className="text-sm font-semibold text-white">{user?.name || '-'}</p>
              <p className="text-xs text-gray-400">{user?.email || '-'}</p>
            </div>
            <button
              onClick={onRemoveAvatar}
              disabled={savingProfile}
              className="h-9 px-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20 inline-flex items-center gap-2 text-sm font-semibold disabled:opacity-50 cursor-pointer"
            >
              <Trash2 size={14} />
              Quitar avatar
            </button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">
              Elegi tu avatar
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-4 gap-2">
              {AVATAR_OPTIONS.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`p-1 rounded-lg border cursor-pointer transition-colors ${
                    selectedAvatar === avatar
                      ? 'border-cyan-500/50 bg-cyan-500/10'
                      : 'border-white/10 hover:border-white/20 bg-white/5'
                  }`}
                >
                  <img src={avatar} alt="avatar-option" className="w-full aspect-square rounded-md bg-white" />
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onSaveProfile}
            disabled={savingProfile}
            className="h-11 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold inline-flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Save size={15} />
            Guardar cambios
          </button>
        </div>
      </div>
    </section>
  );
}
