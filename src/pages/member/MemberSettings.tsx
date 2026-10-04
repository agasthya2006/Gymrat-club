// src/pages/member/MemberSettings.tsx
import React, { useState, useEffect } from 'react';
import { demoStore } from '../../demo/mockStore';
import { Settings, Bell, Shield, Save, CheckCircle2, Sliders, Moon, Gauge } from 'lucide-react';

export const MemberSettings: React.FC = () => {
  const [storeState, setStoreState] = useState(demoStore.getState());
  const [units, setUnits] = useState<'KG' | 'LBS'>(storeState.settings.units);
  const [workoutReminders, setWorkoutReminders] = useState(storeState.settings.workoutReminders);
  const [audioCues, setAudioCues] = useState(storeState.settings.audioCues);
  const [theme, setTheme] = useState(storeState.settings.theme);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const unsub = demoStore.subscribe(() => {
      setStoreState({ ...demoStore.getState() });
    });
    return () => unsub();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    demoStore.update(draft => {
      draft.settings.units = units;
      draft.settings.workoutReminders = workoutReminders;
      draft.settings.audioCues = audioCues;
      draft.settings.theme = theme;
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl select-none">
      <div>
        <span className="text-[10px] font-mono text-[#FF5500] uppercase tracking-[0.25em] font-bold block mb-1">
          MEMBER PREFERENCES & TELEMETRY
        </span>
        <h1 className="font-display text-3xl font-bold uppercase text-white tracking-tight">
          LOCAL DEMO SETTINGS
        </h1>
        <p className="text-xs text-zinc-400">
          Configure personal training units, session reminders, and telemetry preferences.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500 rounded-xl flex items-center gap-3 text-emerald-300 font-mono text-xs animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>PREFERENCES SAVED TO LOCAL PERSISTENCE STORAGE</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Measurement Units */}
        <div className="bg-[#14151C] border border-[#27272A] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-[#FF5500]" />
            <h2 className="font-display text-lg uppercase font-bold text-white tracking-wide">
              MEASUREMENT & LOAD UNITS
            </h2>
          </div>

          <p className="text-xs text-zinc-400">
            Select the default weight display standard across workout tracking, 1RM logs, and volume calculations.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => setUnits('KG')}
              className={`p-4 rounded-xl border text-center font-mono text-xs transition-all cursor-pointer ${
                units === 'KG'
                  ? 'bg-[#FF5500]/15 border-[#FF5500] text-white font-bold shadow-[0_0_12px_rgba(255,85,0,0.25)]'
                  : 'bg-[#070709] border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="font-display text-2xl font-bold mb-1">KILOGRAMS (KG)</div>
              <span className="text-[10px] text-zinc-500 uppercase">METRIC SYSTEM (DEFAULT)</span>
            </button>

            <button
              type="button"
              onClick={() => setUnits('LBS')}
              className={`p-4 rounded-xl border text-center font-mono text-xs transition-all cursor-pointer ${
                units === 'LBS'
                  ? 'bg-[#FF5500]/15 border-[#FF5500] text-white font-bold shadow-[0_0_12px_rgba(255,85,0,0.25)]'
                  : 'bg-[#070709] border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}
            >
              <div className="font-display text-2xl font-bold mb-1">POUNDS (LBS)</div>
              <span className="text-[10px] text-zinc-500 uppercase">IMPERIAL STANDARD</span>
            </button>
          </div>
        </div>

        {/* Workout Reminders & Notifications */}
        <div className="bg-[#14151C] border border-[#27272A] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#FF5500]" />
            <h2 className="font-display text-lg uppercase font-bold text-white tracking-wide">
              DISPATCH & REMINDERS
            </h2>
          </div>

          <div className="space-y-3 pt-1 font-mono text-xs">
            <label className="p-4 bg-[#070709] border border-zinc-800 rounded-xl flex items-center justify-between cursor-pointer hover:border-zinc-700 transition-colors">
              <div>
                <span className="text-white font-bold block">DAILY WORKOUT REMINDERS</span>
                <span className="text-[11px] text-zinc-500 font-sans mt-0.5 block">
                  Notify 30 minutes prior to scheduled session start.
                </span>
              </div>
              <input
                type="checkbox"
                checked={workoutReminders}
                onChange={e => setWorkoutReminders(e.target.checked)}
                className="w-5 h-5 accent-[#FF5500] rounded cursor-pointer"
              />
            </label>

            <label className="p-4 bg-[#070709] border border-zinc-800 rounded-xl flex items-center justify-between cursor-pointer hover:border-zinc-700 transition-colors">
              <div>
                <span className="text-white font-bold block">AUDIO TIMER CUES</span>
                <span className="text-[11px] text-zinc-500 font-sans mt-0.5 block">
                  Audible beep on rest countdown zero and set completion.
                </span>
              </div>
              <input
                type="checkbox"
                checked={audioCues}
                onChange={e => setAudioCues(e.target.checked)}
                className="w-5 h-5 accent-[#FF5500] rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Theme Preferences */}
        <div className="bg-[#14151C] border border-[#27272A] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-[#FF5500]" />
            <h2 className="font-display text-lg uppercase font-bold text-white tracking-wide">
              ARENA VISUAL THEME
            </h2>
          </div>

          <div className="p-4 bg-[#070709] border border-[#FF5500]/50 rounded-xl flex items-center justify-between">
            <div className="font-mono text-xs">
              <span className="text-white font-bold block">TACTICAL HIGH-CONTRAST DARK</span>
              <span className="text-[11px] text-zinc-500 font-sans mt-0.5 block">
                OLED deep blacks (#070709), athletic orange reticles, and tactical HUD scanlines.
              </span>
            </div>
            <span className="px-2.5 py-1 bg-[#FF5500] text-black font-mono text-[10px] font-bold uppercase rounded">
              LOCKED ACTIVE
            </span>
          </div>
        </div>

        {/* Save Button */}
        <div>
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-[#FF5500] to-[#FF7728] hover:from-[#ff661a] hover:to-[#ff8838] text-white font-display text-sm uppercase tracking-wider font-bold rounded-xl shadow-[0_0_20px_rgba(255,85,0,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>SAVE PREFERENCES</span>
          </button>
        </div>
      </form>
    </div>
  );
};
export default MemberSettings;
