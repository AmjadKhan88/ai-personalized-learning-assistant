// components/WeakAreasTracker.js
"use client";

export default function WeakAreasTracker({ weakAreas, onSelectTopic }) {
  return (
    <div className="p-4 border-t border-gray-100 dark:border-gray-800">
      <h2 className="text-xs font-bold uppercase tracking-widest
                     text-gray-400 dark:text-gray-500 mb-3 px-1">
        Review These
      </h2>

      {!weakAreas || weakAreas.length === 0 ? (
        <p className="text-xs text-gray-400 dark:text-gray-600 px-1">
          None yet — keep learning! 💪
        </p>
      ) : (
        <>
          <ul className="flex flex-col gap-1">
            {weakAreas.map((area, i) => (
              <li key={i}>
                <button
                  onClick={() => onSelectTopic(area)}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium
                             border-2 border-amber-200 dark:border-amber-800/60
                             bg-amber-50 dark:bg-amber-900/20
                             text-amber-700 dark:text-amber-400
                             hover:border-amber-400 dark:hover:border-amber-600
                             hover:bg-amber-100 dark:hover:bg-amber-900/40
                             transition-all duration-150 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span>⚠️</span>
                    <span className="truncate">{area}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-2 px-1">
            Click to revisit
          </p>
        </>
      )}
    </div>
  );
}