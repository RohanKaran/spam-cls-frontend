import './App.css';
import {
  Box, Button,
  Container,
  createTheme,
  CssBaseline,
  FormControl,
  TextField,
  ThemeProvider,
  Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import axios from "axios";

function App() {

  const [text, setText] = useState("")

  useEffect(() => {
    axios.get('https://spam-cls-api.herokuapp.com/').then(r => console.log(r.data.message))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await axios.post('https://spam-cls-api.herokuapp.com/prediction', {"texts": [text], "echo_input": true})
      .then(e => console.log(e.data[0].res))
  }

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline/>
      <div className="App">
        <div align={'center'}>
          <Typography variant={"h2"} component={"h1"} gutterBottom>
            Spam Classifier
          </Typography>
        </div>
        <Container>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth variant={'standard'}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: 'inherit',
                '& > :not(style)': { m: 1 },
              }}
            >
              <TextField
                helperText="Please enter some texts"
                id="demo-helper-text-aligned"
                label="Name"
                rows={4}
                multiline
                fullWidth
                onChange={(e) => setText(e.target.value)}
              />
            </Box>
          </FormControl>
            <Button type={"submit"}>
              Predict
            </Button>
          </form>

        </Container>
      </div>
    </ThemeProvider>

  );
}

export default App;
