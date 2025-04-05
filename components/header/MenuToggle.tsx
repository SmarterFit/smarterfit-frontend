import { Menu, X } from "lucide-react";

type MenuToggleProps = {
   open: boolean;
   onClick: () => void;
};

export default function MenuToggle({ open, onClick }: MenuToggleProps) {
   return (
      <button
         onClick={onClick}
         className="flex items-center justify-center w-8 h-8 text-foreground cursor-pointer focus:outline outline-white rounded"
         aria-label="Abrir ou fechar menu"
      >
         {open ? <X /> : <Menu />}
      </button>
   );
}
