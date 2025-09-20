import React, { useState } from 'react';
import { MdVisibility, MdVisibilityOff, MdLock, MdCheckCircle, MdError } from 'react-icons/md';

const PasswordUpdate = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Password requirements
  const passwordRequirements = [
    { id: 1, text: 'At least 8 characters', regex: /.{8,}/ },
    { id: 2, text: 'One uppercase letter', regex: /[A-Z]/ },
    { id: 3, text: 'One lowercase letter', regex: /[a-z]/ },
    { id: 4, text: 'One number', regex: /[0-9]/ },
    { id: 5, text: 'One special character', regex: /[!@#$%^&*(),.?":{}|<>]/ }
  ];

  const checkPasswordStrength = (password) => {
    return passwordRequirements.map(req => ({
      ...req,
      met: req.regex.test(password)
    }));
  };

  const requirements = checkPasswordStrength(newPassword);
  const allRequirementsMet = requirements.every(req => req.met);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (!allRequirementsMet) {
        throw new Error('Please meet all password requirements');
      }

      if (!passwordsMatch) {
        throw new Error('Passwords do not match');
      }

      setMessage({ 
        type: 'success', 
        text: 'Password updated successfully!' 
      });
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
          <MdLock className="text-3xl text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Update Password</h2>
        <p className="text-gray-600">Secure your account with a new password</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showCurrentPassword ? <MdVisibilityOff /> : <MdVisibility />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Create a new password"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showNewPassword ? <MdVisibilityOff /> : <MdVisibility />}
            </button>
          </div>

          {/* Password Requirements */}
          {newPassword && (
            <div className="mt-3 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Password must contain:</h4>
              <div className="space-y-2">
                {requirements.map((req) => (
                  <div key={req.id} className="flex items-center">
                    {req.met ? (
                      <MdCheckCircle className="text-green-500 mr-2" />
                    ) : (
                      <MdError className="text-gray-400 mr-2" />
                    )}
                    <span className={`text-sm ${req.met ? 'text-green-600' : 'text-gray-500'}`}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                confirmPassword
                  ? passwordsMatch
                    ? 'border-green-300 bg-green-50'
                    : 'border-red-300 bg-red-50'
                  : 'border-gray-300'
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <MdVisibilityOff /> : <MdVisibility />}
            </button>
          </div>
          {confirmPassword && (
            <p className={`text-sm mt-1 ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
              {passwordsMatch ? 'Passwords match!' : 'Passwords do not match'}
            </p>
          )}
        </div>

        {/* Status Message */}
        {message.text && (
          <div
            className={`p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            <div className="flex items-center">
              {message.type === 'success' ? (
                <MdCheckCircle className="mr-2 text-green-500" />
              ) : (
                <MdError className="mr-2 text-red-500" />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !allRequirementsMet || !passwordsMatch || !currentPassword}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Updating...
            </>
          ) : (
            'Update Password'
          )}
        </button>
      </form>

      {/* Security Tips */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Security Tips:</h4>
        <ul className="text-sm text-blue-600 space-y-1">
          <li>• Use a unique password that you don't use elsewhere</li>
          <li>• Avoid using personal information in your password</li>
          <li>• Consider using a password manager</li>
          <li>• Update your password regularly</li>
        </ul>
      </div>
    </div>
  );
};

export default PasswordUpdate;