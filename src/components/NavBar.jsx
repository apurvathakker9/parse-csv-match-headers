import React from 'react';
import { AppBar, IconButton, makeStyles, Toolbar, Typography } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';


const useStyles = makeStyles((theme)=>({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}))

function NavBar() {

  const classes = useStyles();

  return ( <>
    <AppBar position="sticky">
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          Import CSV
        </Typography>
      </Toolbar>
    </AppBar>
  </> );
}

export default NavBar;