import './App.css';
import {
  Alert,
  Box, Button, CircularProgress, Container,
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
import ReactJson from 'react-json-view';

function App() {

  const [text, setText] = useState("")
  const [res, setRes] = useState(null)
  const [loading, setLoading] = useState(false)
  const [start, setStart] = useState(true)
  const [model, setModel] = useState(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    axios.get('https://spam-cls-api.herokuapp.com/model-details').then(r => {
      setModel(JSON.parse(r.data))
      setStart(false)
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (text.trim() === ""){
      return
    }
    setLoading(true)
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
        {start ?
          <div style={{position:"absolute", top:"50%", left:"50%", transform:"translateX(-50%) translateY(-50%)"}}>
            <CircularProgress/>
            <div>
              Loading...
              <br/>
              Taking longer than usual, {" "}
              <a href={`https://devcenter.heroku.com/articles/free-dyno-hours#dyno-sleeping`}
                 target={"_blank"} rel={"noreferrer"}>
                learn why
              </a>
            </div>
          </div>
          :
          <Container maxWidth={"md"}>
            <div align={'left'} style={{paddingLeft: "0.5rem", paddingTop: "5rem"}}>
              <Typography variant={"h3"} component={"h1"} style={{fontFamily: "Lato"}} gutterBottom>
                <span style={{color: "#f57c00"}}>Spam </span>Classifier
              </Typography>
              <Button onClick={() => setShow(prev => !prev)} style={{padding: 0, marginBottom: "1.5rem"}}>
                Tap to {show ? "hide" : "view"} the Keras Model
              </Button>
              {show && <Box>{model ? <ReactJson src={model} theme={"google"}
                                                style={{background: "#00000000", marginBottom: "1rem"}}/>
                : null}</Box>}
            </div>
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth variant={'standard'}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: 'inherit',
                    '& > :not(style)': {m: 1},
                  }}
                >
                  <TextField
                    id="demo-helper-text-aligned"
                    label="Text"
                    rows={4}
                    multiline
                    fullWidth
                    onChange={(e) => setText(e.target.value)}
                  />
                </Box>
              </FormControl>
              <LoadingButton type={"submit"} loading={loading} variant={"outlined"} style={{margin: "1rem"}}>
                Predict
              </LoadingButton>
            </form>

            {res ? <div style={{marginTop: "1rem"}}>
              {res?.label === "spam" ?
                <Alert severity={'warning'} variant={"filled"}>Spam! (Probability: {Math.round(res.value * 100)}%)</Alert>
                : <Alert variant={"filled"}>Not Spam (Probability: {Math.round(res.value * 100)}%)</Alert>}
            </div> : null}

          </Container>
        }
      </div>
    </ThemeProvider>

  );
}

export default App;
