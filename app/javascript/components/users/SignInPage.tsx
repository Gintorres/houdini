
// License: LGPL-3.0-or-later
import React, {useCallback, useState} from "react";
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import CopyrightIcon from '@material-ui/icons/Copyright';
import logo from './Images/HoudiniLogo.png';



import SignInComponent from "./SignInComponent";

// NOTE: You should remove this line and next when you start adding properties to SignInComponentProps
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SignInPageProps {
}

// NOTE: Remove this line and next once you start using the props argument
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SignInPage(_props:SignInPageProps) : JSX.Element {
	const [error, setError] = useState(false);
	const onFailure = useCallback(() => {
		setError(true);
	}, [setError]);


	const useStyles = makeStyles((theme: Theme) =>
		createStyles({
			root: {
			flexGrow: 1,
			},
			menuButton: {
			marginRight: theme.spacing(2),
			},
			title: {
			flexGrow: 1,
      },
      link: {
        '& > * + *': {
          marginLeft: theme.spacing(2),
        },
      },
      wrapIcon: {
        verticalAlign: 'middle',
        display: 'inline-flex'
       },
       logo:{
        alignItems:'center',
        width: 250,
        height: 75,
        display:"flex",
        justifyContent:"center",
        
       },
       text:{
        display:"flex",
         justifyContent:"center",
        alignItems:"center",
       }
		}),
		);

	
  const classes = useStyles();


	return (
		<Grid container spacing={5}>
			<Grid item xs={12}>
      <div className={classes.root}>
            <AppBar position="static">
            <Toolbar >
            <img 
                className={classes.logo}
                src={logo}
                title="Houdini"
							/>
              <Box p={5}>
                <Typography 
                  variant="h5"
                  className={classes.title}
                  >
                  Sign In Page
                </Typography>
              </Box>
            </Toolbar>
            </AppBar>
          </div>
			</Grid>
      <Grid item xs={12} className={classes.text}>
        <Typography variant="h4"  gutterBottom>
          Welcome!
        </Typography>
      </Grid>
			<Grid item xs={12}>
        <SignInComponent onFailure={onFailure}/>
				<Box color="error.main" data-testid="signInPageError">{error ? "Ermahgerd! We had an error!" : ""}</Box>
			</Grid>
      <Grid item xs={10}>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Link
            component="button"
            variant="body2"
            onClick={() => {
                console.info("I'm a button.");
            }}>
            Forgot Password
          </Link>
        </Box>
      </Grid>
      <Grid item xs={12} >
              <AppBar position="static">
              <Toolbar>
              <Typography className={classes.link} >
                <CopyrightIcon fontSize="small" className={classes.wrapIcon} />
                  {'2020 Houdini Project '}
                <Link href="" color="inherit">
                  {'Terms & Privacy'}
                </Link>
                </Typography>
              </Toolbar>
              </AppBar>
        
        </Grid>
		</Grid>
	

		
			
		
		
	);
	
	
	
}


export default SignInPage;