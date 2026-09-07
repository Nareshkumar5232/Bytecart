import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { Settings, Save, Lock, ShieldCheck } from 'lucide-react';

export default function AdminSettings() {
  const { changePassword } = useAuth();
  const { addToast } = useToast();

  // Settings State
  const [settings, setSettings] = useState({
    storeName: '',
    storeEmail: '',
    storePhone: '',
    storeAddress: '',
    taxEnabled: false,
    taxRate: 0,
    shippingCharge: 0,
    freeShippingThreshold: 0,
    paymentGateway: 'Razorpay',
    allowCOD: true,
  });

  const [savingSettings, setSavingSettings] = useState(false);
  const [loading, setLoading] = useState(true);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await adminService.getSettings();
      setSettings(res || {});
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      await adminService.updateSettings(settings);
      addToast('Store configuration & tax settings updated successfully.', 'success');
      fetchSettings();
    } catch (err) {
      addToast(err.message || 'Failed to update settings', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast('New passwords do not match.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      addToast('Password must be at least 6 characters.', 'error');
      return;
    }

    try {
      setUpdatingPassword(true);
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      // Toast handled by AuthContext
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#A66A4C]">
          System Preferences
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif text-[#24221F] font-bold">
          Admin Settings & Configuration
        </h1>
      </div>

      {/* Tax & GST Configuration Card */}
      <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2DBD0] space-y-6 shadow-xs">
        <div className="border-b border-[#E2DBD0] pb-4">
          <h2 className="text-lg font-serif font-bold text-[#24221F]">Tax & GST Rules</h2>
          <p className="text-xs text-[#77716A] mt-1">
            CRITICAL: Default tax is ₹0 (GST = 0) unless explicitly enabled here.
          </p>
        </div>

        <div className="space-y-4 text-xs">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.taxEnabled}
              onChange={(e) => setSettings({ ...settings, taxEnabled: e.target.checked })}
              className="w-4 h-4 rounded text-[#A66A4C]"
            />
            <span className="font-semibold text-[#24221F]">Enable Automatic Tax / GST Calculation</span>
          </label>

          {settings.taxEnabled && (
            <div className="space-y-1 w-full sm:w-60">
              <label className="font-semibold uppercase tracking-wider text-[#77716A]">Configured Tax Rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-[#F5F2EC] border border-[#E2DBD0]"
              />
            </div>
          )}
        </div>

        {/* Shipping settings */}
        <div className="border-t border-[#E2DBD0] pt-6 space-y-4 text-xs">
          <h3 className="font-serif font-bold text-sm text-[#24221F]">Shipping Charges</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold uppercase tracking-wider text-[#77716A]">Base Shipping Charge (₹)</label>
              <input
                type="number"
                min="0"
                value={settings.shippingCharge}
                onChange={(e) => setSettings({ ...settings, shippingCharge: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-[#F5F2EC] border border-[#E2DBD0]"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold uppercase tracking-wider text-[#77716A]">Free Shipping Threshold (₹)</label>
              <input
                type="number"
                min="0"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-[#F5F2EC] border border-[#E2DBD0]"
              />
            </div>
          </div>
        </div>

        {/* Payment gateway status */}
        <div className="border-t border-[#E2DBD0] pt-6 space-y-2 text-xs">
          <h3 className="font-serif font-bold text-sm text-[#24221F]">Payment Gateway Status</h3>
          <div className="p-4 rounded-2xl bg-[#F5F2EC] border border-[#E2DBD0] flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="font-semibold text-[#24221F]">Razorpay Server Integration</p>
              <p className="text-[11px] text-[#77716A]">Protected backend API verification & webhook listeners</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
              Ready & Secure
            </span>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#E2DBD0]">
          <button
            type="submit"
            disabled={savingSettings}
            className="px-6 py-2.5 rounded-full bg-[#24221F] hover:bg-[#A66A4C] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savingSettings ? 'Saving...' : 'Save Store Configuration'}</span>
          </button>
        </div>
      </form>

      {/* Password Change Card */}
      <form onSubmit={handleChangePassword} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2DBD0] space-y-6 shadow-xs">
        <div className="border-b border-[#E2DBD0] pb-4">
          <h2 className="text-lg font-serif font-bold text-[#24221F]">Change Administrator Password</h2>
          <p className="text-xs text-[#77716A] mt-1">Updates your secure bcrypt hashed password in the database.</p>
        </div>

        <div className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold uppercase tracking-wider text-[#77716A]">Current Password *</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full sm:w-80 px-3 py-2 rounded-xl bg-[#F5F2EC] border border-[#E2DBD0]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold uppercase tracking-wider text-[#77716A]">New Password *</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl bg-[#F5F2EC] border border-[#E2DBD0]"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold uppercase tracking-wider text-[#77716A]">Confirm New Password *</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl bg-[#F5F2EC] border border-[#E2DBD0]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#E2DBD0]">
          <button
            type="submit"
            disabled={updatingPassword}
            className="px-6 py-2.5 rounded-full bg-[#24221F] hover:bg-[#A66A4C] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{updatingPassword ? 'Updating...' : 'Update Password'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
