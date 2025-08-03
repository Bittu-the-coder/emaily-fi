import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Rocket,
  Download,
  Settings,
  Code,
  BookOpen,
  ArrowRight,
  AlertTriangle,
  X,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigationItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Getting Started", path: "/getting-started", icon: Rocket },
    { name: "Installation", path: "/installation", icon: Download },
    { name: "Configuration", path: "/configuration", icon: Settings },
    { name: "API Reference", path: "/api-reference", icon: Code },
    { name: "Examples", path: "/examples", icon: BookOpen },
    { name: "Migration", path: "/migration", icon: ArrowRight },
    { name: "Troubleshooting", path: "/troubleshooting", icon: AlertTriangle },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-16 left-0 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
        transform transition-transform duration-200 ease-in-out z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="p-4 lg:hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-8 lg:mt-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center px-6 py-3 text-sm font-medium transition-colors duration-150
                  ${
                    active
                      ? "bg-orange-100 dark:bg-orange-900 dark:bg-opacity-30 sidebar-active border-r-4 border-orange-500"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  }
                `}
              >
                <Icon size={18} className="mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>Version 1.0.2</p>
            <p className="mt-1">
              Made with ❤️ by{" "}
              <a
                href="https://github.com/bittu-the-coder"
                className="text-white hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                bittu-the-coder
              </a>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
