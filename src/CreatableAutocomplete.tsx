import { Autocomplete, createFilterOptions, TextField, type AutocompleteProps } from '@mui/material';
import { useState } from 'react';

const filter = createFilterOptions();

export default function CreatableAutocomplete(props: Partial<AutocompleteProps<any, any, any, any>>) {
  return (
    <Autocomplete
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.label);
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            inputValue,
            label: `Add "${inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.label;
      }}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            {option.label}
          </li>
        );
      }}
      freeSolo
      resetHighlightOnMouseLeave
      renderInput={(params) => <TextField {...params} />}
      {...props}
      options={props.options || []}
    />
  );
}
