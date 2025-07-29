import React from 'react';
import { Mail, Shield, AlertCircle, Gavel } from 'lucide-react';

const PasswordResetEmail = ({ resetLink }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Email Preview */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Password Reset Email</h2>
            <div className="flex items-center gap-2 text-sm text-purple-600">
              <Mail className="w-5 h-5" />
              <span>Preview</span>
            </div>
          </div>

          <div className="border rounded-lg p-6 space-y-6">
            {/* Email Header */}
            <div className="flex items-center gap-4 border-b pb-6">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-xl">
                <Gavel className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-xl text-gray-800">AuctionX</h3>
                <p className="text-sm text-gray-500">Password Reset Request</p>
              </div>
            </div>

            {/* Email Content */}
            <div className="space-y-4">
              <div className="space-y-4">
                <p className="text-gray-600">Hello,</p>
                <p className="text-gray-600">
                  We received a request to reset your password for your AuctionX account. 
                  Click the button below to reset it:
                </p>
              </div>

              <button className="w-full sm:w-auto bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors text-center">
                <a href={resetLink} className="text-white">Reset Your Password</a>
              </button>

              <div className="text-sm text-gray-500">
                <p>Or copy and paste this URL into your browser:</p>
                <a href={resetLink} className="text-purple-600 break-all hover:text-purple-700">
                  {resetLink}
                </a>
              </div>

              {/* Security Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Security Notice</p>
                  <p>If you didn't request a password reset, please ignore this email or contact our support team if you have concerns about your account's security.</p>
                </div>
              </div>

              {/* Email Footer */}
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <p className="text-gray-600">Best regards,</p>
                  <p className="text-gray-600">The AuctionX Team</p>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Shield className="w-4 h-4" />
                      <p>Secured by AuctionX</p>
                    </div>
                    <p className="text-sm text-gray-400">© 2025 AuctionX. All rights reserved.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetEmail;
