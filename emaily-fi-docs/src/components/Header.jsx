import React from "react";
import { Menu, Github, Package } from "lucide-react";

const Header = ({ toggleSidebar }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-60 bg-gray-900 border-b border-gray-700 h-16">
      <div className="flex items-center justify-between px-4 py-3 h-full">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md text-gray-300 hover:bg-gray-800"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
              <Package size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">emaily-fi</h1>
              <p className="text-sm text-gray-300 hidden sm:block">
                Production-ready email notifications
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <a
            href="https://github.com/bittu-the-coder/emaily-fi"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-md text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <Github size={20} />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
