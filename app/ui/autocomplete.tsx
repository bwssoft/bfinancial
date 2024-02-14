"use client"
import React from 'react';
import Select, { 
  components, 
  ControlProps, 
  ValueContainerProps, 
  OptionProps, 
  SingleValueProps, 
  InputProps,
  Props as SelectProps
} from 'react-select'

type AutocompleteProp<T> = SelectProps & {
  label?: string;
}

export type AutocompleteResponse<T> = {
  label: string;
  value: T;
}

const Control = ({ children, ...props }: ControlProps) => (
  <components.Control {...props} className="block w-full !rounded-md text-gray-900 ring-gray-300 bg-red-100 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
    {children}
  </components.Control>
);

const ValueContainer = ({ children, ...props }: ValueContainerProps) => (
  <components.ValueContainer {...props} className="border-0 rounded-md">
    {children}
  </components.ValueContainer>
) 

const Option = (props: OptionProps) => (
  <components.Option {...props} className="!text-sm !py-2" />
)

const SingleValue = (props: SingleValueProps) => (
  <components.SingleValue {...props} className="border-transparent" />
)

const Input = (props: InputProps) => (
  <components.Input {...props} className="autocomplete-input" />
)

export function Autocomplete<T>({ label, options, ...rest }: AutocompleteProp<T>) {
  return (
    <div>
      {label && <label className="text-sm font-medium text-gray-900 mb-1">{label}</label>}

      <div>
        <Select 
          options={options} 
          components={{ 
            Control,
            ValueContainer, 
            Option, 
            SingleValue,
            Input,
          }}
          {...rest} 
        />
      </div>
    </div>
  )
}