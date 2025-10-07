import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import clsx from "clsx";

export default function Dropdown({
  label = "Options",
  items = [],
  triggerButton,
  itemsClassName,
}) {
  return (
    <Menu>
      {triggerButton}

      <MenuItems
        transition
        anchor="bottom start"
        className={clsx(
          "w-36 origin-top-right rounded-xl border border-white/5 bg-[#1C1C1E] p-1 text-sm text-white transition duration-100 ease-out focus:outline-none data-closed:scale-95 data-closed:opacity-0"
        )}
      >
        {items.map((item, index) =>
          item.divider ? (
            <div key={index} className="my-1 h-px bg-white/5" />
          ) : (
            <MenuItem key={index}>
              <button
                onClick={() => item.onClick(item.value)}
                className={clsx(
                  "group flex w-full items-center gap-2 rounded-lg px-3 py-1.5",
                  "data-focus:bg-white/10 hover:bg-white/10"
                )}
              >
                {item.icon && <item.icon className="size-4 fill-white/30" />}
                {item.label}
                {/* {item.shortcut && (
                  <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-focus:inline">
                    {item.shortcut}
                  </kbd>
                )} */}
              </button>
            </MenuItem>
          )
        )}
      </MenuItems>
    </Menu>
  );
}
