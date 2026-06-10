import { Box, Button, MenuItem, Select, TextField } from '@mui/material';
import type { PieItemId, PieValueType } from '@mui/x-charts';
import { PieChart } from '@mui/x-charts/PieChart';
import { useState } from 'react';

function App() {
  const [data, setData] = useState<(PieValueType & { period: string })[]>([]);
  const [childData, setChildData] = useState<(PieValueType & { parentId?: PieItemId; period: string })[]>([]);
  const [previousPeriod, setPreviousPeriod] = useState('30');
  const [currentPeriod, setCurrentPeriod] = useState('30');
  const middleRadius = 167;
  const fittedData = data.map((item) => ({
    ...item,
    value: item.value / Number(item.period) * Number(currentPeriod),
  }));
  const fittedChildData = childData.map((item) => ({
    ...item,
    value: item.value / Number(item.period) * Number(currentPeriod),
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
            <Box>
              <TextField
                label="Label"
                value={item.label}
                onChange={(event) => {
                  const newData = [...data];
                  newData[index] = { ...item, label: event.target.value };
                  setData(newData);
                }}
                sx={{ m: 1 }}
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
            </Box>
            {childData
              .filter((child) => child.parentId === item.id)
              .map((child) => (
                <Box>
                  <TextField
                    label="Label"
                    value={child.label}
                    onChange={(event) => {
                      const newChildData = [...childData];
                      const childIndex = newChildData.findIndex((c) => c.id === child.id);
                      newChildData[childIndex] = { ...child, label: event.target.value };
                      setChildData(newChildData);
                    }}
                    sx={{ m: 1 }}
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
