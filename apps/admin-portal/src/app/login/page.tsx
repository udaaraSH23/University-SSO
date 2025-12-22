// Author: Udara Shanuka
// Project: University-Portal
// FP-ID: FP-20251220-US-d4e5f6
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2025-12-22T17:15:00Z

import { LoginButton } from "@repo/ui";
import { Shield, ShieldCheck } from "lucide-react";

/**
 * Signature constant for fingerprinting.
 */
const __FP_SIG = "FP-20251220-US-d4e5f6|HASH-PLACEHOLDER";

/**
 * Admin Portal Login Page.
 *
 * Displays the welcome screen for the Admin Portal.
 * Initiates authentication flow via the shared LoginButton.
 *
 * @returns {JSX.Element} The rendered login page.
 */
export default function LoginPage() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center p-6 relative w-full h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40 dark:opacity-20">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-200 dark:bg-blue-900 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-purple-200 dark:bg-purple-900 rounded-full blur-[100px]"></div>
      </div>
      <div className="relative z-10 w-full max-w-md md:max-w-2xl text-center flex flex-col items-center justify-center flex-1">
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-105 duration-300">
            {/* Replaced material-icons 'admin_panel_settings' with Lucide Shield */}
            <Shield className="text-white w-10 h-10" />
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white drop-shadow-sm">
          Welcome
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 font-medium mb-12">
          Admin Portal
        </p>
        <div className="flex flex-col items-center gap-4 w-full max-w-xs mx-auto">
          <LoginButton />
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Access administrative functions
          </p>
        </div>
      </div>
      <footer className="w-full py-4 text-center relative z-10 absolute bottom-4">
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-gray-400 dark:text-gray-500 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Powered by WSO2 Identity Server
          </p>
        </div>
      </footer>
    </main>
  );
}
