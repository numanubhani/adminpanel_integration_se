import { Popover,  PopoverPanel } from "@headlessui/react";

export default function SortData({ triggerButton, options, value:selected, onChange }) {

  return (
    <Popover className="relative">
      {triggerButton}
      <PopoverPanel
        anchor="bottom start"
        className="flex flex-col bg-[#161617] rounded-[10px] w-[188px]"
      >
        <div className="flex items-center gap-3 border-b border-[#667080] p-3">
          <svg
            className="fill-white"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="currentColor"
          >
            <path
              d="M18.9226 11.744C18.7663 11.5878 18.5544 11.5 18.3334 11.5C18.1125 11.5 17.9005 11.5878 17.7443 11.744L15.0001 14.4882V1.49984C15.0001 1.27882 14.9123 1.06686 14.756 0.910582C14.5997 0.754301 14.3878 0.666504 14.1668 0.666504C13.9457 0.666504 13.7338 0.754301 13.5775 0.910582C13.4212 1.06686 13.3334 1.27882 13.3334 1.49984V14.4882L10.5893 11.744C10.4321 11.5922 10.2216 11.5082 10.0031 11.5101C9.7846 11.512 9.57559 11.5996 9.42108 11.7542C9.26657 11.9087 9.17893 12.1177 9.17703 12.3362C9.17513 12.5547 9.25913 12.7652 9.41093 12.9223L13.5776 17.089C13.655 17.1666 13.747 17.2282 13.8482 17.2702C13.9494 17.3122 14.058 17.3338 14.1676 17.3338C14.2772 17.3338 14.3857 17.3122 14.487 17.2702C14.5882 17.2282 14.6802 17.1666 14.7576 17.089L18.9243 12.9223C19.0803 12.7658 19.1677 12.5538 19.1674 12.3328C19.1671 12.1119 19.079 11.9001 18.9226 11.744Z"
              fill="currentColor"
            />
            <path
              d="M10.5892 5.0772L6.42249 0.910535C6.34488 0.832769 6.25252 0.771289 6.15083 0.729702C5.94697 0.645438 5.71802 0.645438 5.51416 0.729702C5.41247 0.771289 5.32011 0.832769 5.24249 0.910535L1.07583 5.0772C0.919571 5.23368 0.831875 5.44582 0.832031 5.66696C0.832188 5.88809 0.920184 6.10011 1.07666 6.25637C1.23314 6.41263 1.44528 6.50032 1.66642 6.50017C1.88755 6.50001 2.09957 6.41201 2.25583 6.25554L4.99999 3.51137V16.4997C4.99999 16.7207 5.08779 16.9327 5.24407 17.089C5.40035 17.2452 5.61231 17.333 5.83333 17.333C6.05434 17.333 6.2663 17.2452 6.42258 17.089C6.57886 16.9327 6.66666 16.7207 6.66666 16.4997V3.51137L9.41083 6.25554C9.568 6.40733 9.7785 6.49133 9.99699 6.48943C10.2155 6.48753 10.4245 6.39989 10.579 6.24538C10.7335 6.09088 10.8212 5.88187 10.8231 5.66337C10.825 5.44487 10.741 5.23437 10.5892 5.0772Z"
              fill="currentColor"
            />
          </svg>

          <span className="text-xs text-white">Sort</span>
        </div>
        <fieldset className="mt-2 px-2 text-white">
          <div className="font-medium text-white mb-2 text-xs">
            Sort by Max Entrants:
          </div>
          <div className=" mt-2">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex items-center cursor-pointer py-2"
                onClick={() => onChange(option.value)}
              >
                <div className="relative">
                  <div
                    className={`h-4 w-4 rounded-full  border-gray-400 flex items-center justify-center ${
                      selected === option.value ? "border-4" : "border"
                    }`}
                  >
                    {selected !== option.value && (
                      <div className="h-2 w-2 rounded-full bg-gray-400" />
                    )}
                  </div>
                  <input
                    type="radio"
                    name="sort"
                    value={option.id}
                    className="sr-only"
                    checked={selected === option.value}
                    onClick={() => onChange(option.value)}
                  />
                </div>
                <span className="ml-3 text-white text-xs">{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </PopoverPanel>
    </Popover>
  );
}
