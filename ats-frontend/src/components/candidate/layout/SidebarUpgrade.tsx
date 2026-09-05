import { Sparkles } from "lucide-react";

const SidebarUpgrade = () => {
  return (
    <div className="px-4 pb-4">
      <div
        className="
          rounded-lg
          border
          border-mint-300
          bg-mint-100
          p-4
        "
      >
        <div className="mb-3 flex items-start justify-between">
          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-md
              bg-white
              text-forest-800
            "
          >
            <Sparkles className="h-4 w-4" />
          </div>

          <span
            className="
              rounded-full
              bg-white
              px-2
              py-1
              text-[9px]
              font-bold
              uppercase
              tracking-wider
              text-forest-800
            "
          >
            Pro
          </span>
        </div>

        <p className="text-sm font-bold text-forest-900">
          Unlock deeper insights
        </p>

        <p className="mt-1 text-xs leading-5 text-forest-700">
          Get detailed recommendations and advanced resume analysis.
        </p>

        <button
          type="button"
          className="
            mt-3
            text-xs
            font-bold
            text-forest-900
            underline
            underline-offset-4
          "
        >
          Explore Pro
        </button>
      </div>
    </div>
  );
};

export default SidebarUpgrade;