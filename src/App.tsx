import { Box, Button, TextField } from '@mui/material';
import type { PieItemId, PieValueType } from '@mui/x-charts';
import { PieChart } from '@mui/x-charts/PieChart';
import { useState } from 'react';

function App() {
  const [data, setData] = useState<PieValueType[]>([]);
  const [childData, setChildData] = useState<(PieValueType & { parentId?: PieItemId })[]>([]);
  const middleRadius = 167;
  return (
    <>
      <PieChart
        series={[
          { data, innerRadius: 0, outerRadius: middleRadius, cornerRadius: 3 },
          { data: childData, innerRadius: middleRadius, outerRadius: middleRadius + 20, cornerRadius: 3 },
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
              onClick={() => setChildData([...childData, { parentId: item.id, id: childData.length, value: 0 }])}
              disableRipple
            >
              Add Child
            </Button>
          </Box>
        ))}
        <Button onClick={() => setData([...data, { id: data.length, value: 0 }])} disableRipple>
          Add
        </Button>
      </Box>
    </>
  );
}

export default App;
