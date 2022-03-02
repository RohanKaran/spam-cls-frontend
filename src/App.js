import './App.css';
import {
  Alert,
  Box, Container,
  createTheme,
  CssBaseline,
  FormControl,
  TextField,
  ThemeProvider,
  Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import axios from "axios";
import {LoadingButton} from "@mui/lab";

function App() {

  const [text, setText] = useState("")
  const [res, setRes] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios.get('https://spam-cls-api.herokuapp.com/').then(r => console.log(r.data.message))
  }, [])

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault()
    if (text.trim() === ""){
      return
    }
    await axios.post('https://spam-cls-api.herokuapp.com/prediction', {"texts": [text], "echo_input": true})
      .then(e => {
        setRes(e.data[0].res)
        setLoading(false)
      })
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
        <Container maxWidth={"md"}>
          <div align={'left'} style={{paddingLeft:"0.5rem", paddingTop:"5rem"}}>
          <Typography variant={"h4"} component={"h1"} style={{fontWeight:500, fontFamily:"Roboto"}} gutterBottom>
            <span style={{color:"#ffa726"}}>Spam </span>Classifier
          </Typography>
        </div>
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
                  helperText="Please enter text"
                  id="demo-helper-text-aligned"
                  label="Text"
                  rows={4}
                  multiline
                  fullWidth
                  onChange={(e) => setText(e.target.value)}
                />
              </Box>
            </FormControl>
            <LoadingButton type={"submit"} loading={loading} variant={"outlined"}>
              Predict
            </LoadingButton>
          </form>

          {res ? <div style={{paddingTop:"1rem"}}>
            {res?.label === "spam" ?
              <Alert severity={'warning'}>Spam! (Probability: {Math.round(res.value * 100)}%)</Alert>
              : <Alert>Not Spam (Probability: {Math.round(res.value * 100)}%)</Alert>}
          </div> : null}

        </Container>
      </div>
    </ThemeProvider>

  );
}

export default App;
