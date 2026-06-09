import { Box, Button, TextField } from '@mui/material';
import type { PieValueType } from '@mui/x-charts';
import { PieChart } from '@mui/x-charts/PieChart';
import { useState } from 'react';

function App() {
  const [data, setData] = useState<PieValueType[]>([]);
  return (
    <>
      <PieChart
        series={[{ data }]}
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
        {data.map((item, index) => <Box key={index}>
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
        </Box>)}
        <Button onClick={() => setData([...data, { id: data.length, value: 0 }])} disableRipple>Add</Button>
      </Box>
    </>
  );
}

export default App;
