import { BarChart3 } from "lucide-react";
import { NavLink } from "react-router-dom";

interface SidebarBrandProps {
  onNavigate: () => void;
}

const SidebarBrand = ({ onNavigate }: SidebarBrandProps) => {
  return (
    <NavLink
      to="/candidate/dashboard"
      className="flex items-center gap-3"
      onClick={onNavigate}
    >
      <div
        className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-md
          bg-forest-900
          text-white
        "
      >
        <BarChart3 className="h-5 w-5" />
      </div>

      <div>
        <p className="font-display text-xl leading-none text-forest-950">
          ATSentra
        </p>

        <p
          className="
            mt-1
            text-[9px]
            font-bold
            uppercase
            tracking-[0.18em]
            text-text-muted
          "
        >
          Resume Intelligence
        </p>
      </div>
    </NavLink>
  );
};

export default SidebarBrand;
