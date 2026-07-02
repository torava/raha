import Delete from '@mui/icons-material/Delete';
import { Box, Button, IconButton, MenuItem, Select, TextField } from '@mui/material';
import type { PieItemId, PieValueType } from '@mui/x-charts';
import { PieChart } from '@mui/x-charts/PieChart';
import { useState } from 'react';

import CreatableAutocomplete from './CreatableAutocomplete';

const INITIAL_LABELS = {
  LIVING: [
    'Mortgage Principal',
    'Mortgage Interest',
    'Strata Fee',
    'Property Tax',
    'Heat',
    'Electricity',
    'Water/Sewer/Garbage',
    'Rent',
    'House Insurance',
    'Clearing',
    'Repair & Maintenance',
    'Landscaping',
    'Renovations/Improvements',
  ],
  FOOD: ['Groceries', 'Restaurants', 'Coffee Shops', 'Pet Food'],
  TRAVEL: [
    'Vehicle Insurance',
    'Vehicle Payments',
    'Vehicle Maintenance',
    'Fuel/Electricity',
    'Public Transportation',
    'Parking',
  ],
  ESSENTIALS: ['Household Items', 'Clothing', 'Self Care', 'Medical Care', 'Pet Care', 'Personal Insurance'],
  HEALTH: [
    'Medical Care',
    'Dental',
    'Vision',
    'Medical Benefits Plan',
    'Gym Memberships',
  ],
  FAMILY: ['Childcare', 'School Expenses', "Children's Activities"],
  COMMUNICATION: ['Internet', 'TV', 'Phones'],
  ENTERTAINMENT: ['Subscriptions', 'Alcohol', 'Tobacco', 'Vacations'],
  SAVINGS: ['Education Savings', 'Life Insurance', 'Retirement Savings', 'Emergency Fund'],
  DONATIONS: ['Gifts', 'Charity'],
  FINANCIAL: ['Bank Fees', 'Loan Interest', 'Tax Preparation'],
};

function App() {
  const [data, setData] = useState<(PieValueType & { period: string })[]>([]);
  const [childData, setChildData] = useState<(PieValueType & { parentId?: PieItemId; period: string })[]>([]);
  const [previousPeriod, setPreviousPeriod] = useState('30.4167');
  const [currentPeriod, setCurrentPeriod] = useState('30.4167');
  const middleRadius = 167;
  const fittedData = data.map((item) => ({
    ...item,
    value: (item.value / Number(item.period)) * Number(currentPeriod),
  }));
  const fittedChildData = childData.map((item) => ({
    ...item,
    value: (item.value / Number(item.period)) * Number(currentPeriod),
  }));
  return (
    <>
      <Box sx={{ textAlign: 'center' }}>
        <Select
          value={currentPeriod}
          onChange={(event) => {
            setCurrentPeriod(event.target.value);
          }}
          sx={{ m: 1 }}
        >
          <MenuItem value="1">daily</MenuItem>
          <MenuItem value="30.4167">monthly</MenuItem>
          <MenuItem value="365">yearly</MenuItem>
        </Select>
      </Box>
      <PieChart
        series={[
          { data: fittedData, innerRadius: 0, outerRadius: middleRadius, cornerRadius: 3 },
          { data: fittedChildData, innerRadius: middleRadius, outerRadius: middleRadius + 20, cornerRadius: 3 },
        ]}
        width={375}
        height={375}
        slotProps={{
          legend: {
            direction: 'horizontal',
            position: { vertical: 'bottom' },
          },
        }}
      />
      <Box sx={{ textAlign: 'center' }}>
        {data.map((item, index) => (
          <Box key={index}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CreatableAutocomplete
                renderInput={(params) => <TextField {...params} label="Label" />}
                value={item.label || ''}
                onChange={(_event, newValue) => {
                  const newData = [...data];
                  if (typeof newValue === 'string') {
                    newData[index] = {
                      ...item,
                      label: newValue,
                    };
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    newData[index] = {
                      ...item,
                      label: newValue.inputValue,
                    };
                  } else {
                    newData[index] = newValue ? { ...item, ...newValue } : { ...item, label: '' };
                  }
                  setData(newData);
                }}
                options={Object.keys(INITIAL_LABELS).map((parent) => ({ label: parent }))}
                sx={{ m: 1, width: '200px' }}
              />
              <Select
                value={item.period}
                onChange={(event) => {
                  const newData = [...data];
                  newData[index] = { ...item, period: event.target.value };
                  setData(newData);
                  setPreviousPeriod(event.target.value);
                }}
                sx={{ m: 1 }}
              >
                <MenuItem value="1">daily</MenuItem>
                <MenuItem value="30.4167">monthly</MenuItem>
                <MenuItem value="365">yearly</MenuItem>
              </Select>
              <TextField
                label="Value"
                onChange={(event) => {
                  const newData = [...data];
                  newData[index] = { ...item, value: Number(event.target.value) };
                  setData(newData);
                }}
                sx={{ m: 1 }}
              />
              <IconButton
                onClick={() => {
                  const newData = [...data];
                  newData.splice(index, 1);
                  setData(newData);
                }}
              >
                <Delete />
              </IconButton>
            </Box>
            {childData
              .filter((child) => child.parentId === item.id)
              .map((child) => (
                <Box key={child.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <CreatableAutocomplete
                    renderInput={(params) => <TextField {...params} label="Label" />}
                    value={child.label || ''}
                    onChange={(_event, newValue) => {
                      const newChildData = [...childData];
                      const childIndex = newChildData.findIndex((c) => c.id === child.id);
                      if (typeof newValue === 'string') {
                        newChildData[childIndex] = {
                          ...child,
                          label: newValue,
                        };
                      } else if (newValue && newValue.inputValue) {
                        // Create a new value from the user input
                        newChildData[childIndex] = {
                          ...child,
                          label: newValue.inputValue,
                        };
                      } else {
                        newChildData[childIndex] = newValue ? { ...child, ...newValue} : { ...child, label: '' };
                      }
                      setChildData(newChildData);
                    }}
                    options={INITIAL_LABELS[item.label as keyof typeof INITIAL_LABELS]?.map((child) => ({
                      label: child,
                    }))}
                    sx={{ m: 1, width: '200px' }}
                  />
                  <Select
                    value={child.period}
                    onChange={(event) => {
                      const newChildData = [...childData];
                      const childIndex = newChildData.findIndex((c) => c.id === child.id);
                      newChildData[childIndex] = { ...child, period: event.target.value };
                      setChildData(newChildData);
                      setPreviousPeriod(event.target.value);
                    }}
                    sx={{ m: 1 }}
                  >
                    <MenuItem value="1">daily</MenuItem>
                    <MenuItem value="30.4167">monthly</MenuItem>
                    <MenuItem value="365">yearly</MenuItem>
                  </Select>
                  <TextField
                    label="Value"
                    onChange={(event) => {
                      const newChildData = [...childData];
                      const childIndex = newChildData.findIndex((c) => c.id === child.id);
                      newChildData[childIndex] = { ...child, value: Number(event.target.value) };
                      setChildData(newChildData);
                    }}
                    sx={{ m: 1 }}
                  />
                  <IconButton
                    onClick={() => {
                      const newChildData = [...childData];
                      const childIndex = newChildData.findIndex((c) => c.id === child.id);
                      newChildData.splice(childIndex, 1);
                      setChildData(newChildData);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ))}
            <Button
              onClick={() =>
                setChildData([
                  ...childData,
                  { parentId: item.id, id: childData.length, value: 0, period: previousPeriod },
                ])
              }
              disableRipple
            >
              Add Child
            </Button>
          </Box>
        ))}
        <Button onClick={() => setData([...data, { id: data.length, value: 0, period: previousPeriod }])} disableRipple>
          Add
        </Button>
      </Box>
    </>
  );
}

export default App;
