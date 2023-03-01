import { createTheme } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";

const theme = createTheme({
  palette:{
    primary:blue,
  },
  overrides:{
    MuiOutlinedInput:{
      input:{
        padding: '10.5px 14px;'
      }
    }
  }
});

export default theme;