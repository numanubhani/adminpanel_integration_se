import {
    Field,
    Label,
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
  } from "@headlessui/react";
  import clsx from "clsx";
  import { FaChevronDown } from "react-icons/fa";
  
  export default function SelectList({
    label = "Select",
    options = [],
    value,
    onChange,
    labelKey = "label",
    valueKey = "value",
    className = "",
    placeholder = "",
    labelClassName = "",
    optionsClassName="",
    buttonClassName="bg-white/5",
    optionClassName=""
  }) {
    return (
      <Field>
        <Label className={clsx("text-white text-base mb-1 block font-medium", labelClassName)}>{label}</Label>
        <Listbox
          value={value}
          onChange={onChange}
          as="div"
          className={clsx("relative mt-2", className)}
        >
          <ListboxButton
            className={clsx(
              "relative block w-full rounded-lg  py-2 pr-8 pl-3 text-left text-sm/6 text-white",
              "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25",
              buttonClassName
            )}
          >
            {value?.[labelKey] || placeholder}
            <FaChevronDown
              className="group pointer-events-none absolute top-3 right-2.5 size-3.5 fill-white/60"
              aria-hidden="true"
            />
          </ListboxButton>
  
          <ListboxOptions
            transition
            anchor="bottom"
            className={clsx(
              "w-[--button-width] z-20 rounded-xl border border-white/5 bg-[#1C1C1E] p-1 focus:outline-none",
              "transition duration-100 ease-in data-leave:data-closed:opacity-0",
              optionsClassName
            )}
          >
            {options.map((option, index) => (
  <ListboxOption
    key={`${option[valueKey]}-${index}`} 
    value={option}
    className={clsx(
      "group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-white hover:bg-gray-800/90 data-focus:text-white",
      optionClassName
    )}
  >
    {option[labelKey]}
  </ListboxOption>
))}
          </ListboxOptions>
        </Listbox>
      </Field>
    );
  }
  