// License: LGPL-3.0-or-later

import React, { useEffect, useState } from "react";
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Formik, Form,  Field } from 'formik';
import noop from "lodash/noop";
import usePrevious from 'react-use/lib/usePrevious';
import Typography from '@material-ui/core/Typography';
import { spacing } from '@material-ui/system';
import MuiButton from "@material-ui/core/Button";
import { styled } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import logo from './Images/HoudiniLogo.png';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';

import { Link } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import CardMedia from "@material-ui/core/CardMedia";
import {TextField} from 'formik-material-ui';
import useCurrentUserAuth from "../../hooks/useCurrentUserAuth";
import { SignInError } from '../../legacy_react/src/lib/api/errors';
import { useIntl } from "../../components/intl";
import useYup from '../../hooks/useYup';
import Box from '@material-ui/core/Box';
import Grow from '@material-ui/core/Grow';
import { BluetoothDisabled } from "@material-ui/icons";


export interface SignInComponentProps {
	/**
	 * An attempt at signing in failed
	 *
	 * @memberof SignInComponentProps
	 */
	onFailure?: (error: SignInError) => void;
}


function SignInComponent(props: SignInComponentProps): JSX.Element {
	const [componentState, setComponentState] = useState<'ready' | 'canSubmit' | 'submitting' | 'success'>('ready');
  const [isValid, setIsValid] = useState(false);
  const [checked, setChecked] = React.useState(false);

	const { currentUser, signIn, lastError, failed, submitting } = useCurrentUserAuth();
	// this keeps track of what the values submitting were the last
	// time the the component was rendered
	const previousSubmittingValue = usePrevious(submitting);
  
	useEffect(() => {
		// was the component previously submitting and now not submitting?
		const wasSubmitting = previousSubmittingValue && !submitting;

		if (failed && wasSubmitting) {
			// we JUST failed so we only call onFailure
			// once
			setComponentState('ready');
			props.onFailure(lastError);
		}

		if (wasSubmitting && !failed) {
			// we JUST succeeded
			// TODO
			setComponentState('success');
		}
	}, [failed, submitting, previousSubmittingValue]);

	useEffect(() => {
		if (isValid && submitting) {
			setComponentState('submitting');
		}
	}, [submitting]);

	useEffect(() => {
		if (isValid && componentState == 'ready') {
			setComponentState('canSubmit');
		}
	}, [isValid, componentState]);

	//Setting error messages
	const { formatMessage } = useIntl();
	const yup = useYup();
	const passwordLabel = formatMessage({id: 'login.password'});
  const emailLabel = formatMessage({id: 'login.email'});
  const successLabel = formatMessage({id: 'login.success'});
  const userIdlabel = formatMessage({id: 'login.user_id'});
  const forgotPasswordlabel = formatMessage({id: 'login.forgot_password'});
  const loginHeaderLabel = formatMessage({id: 'login.header'});
  const emailValidLabel = formatMessage({id: 'login.errors.password_email'});
  const enterInfoLabel = formatMessage({id: 'login.enter_info'});

	//Yup validation
	const validationSchema = yup.object({
		email: yup.string().label(emailLabel).email().required(),
		password: yup.string().label(passwordLabel).required(),
	});

	//Styling - Material-UI
	const useStyles = makeStyles((theme: Theme) => createStyles({
		textField: {
			'& .MuiTextField-root': {
				margin: theme.spacing(1),
			},
		},
		paper: {
			maxWidth: 400,
			margin: `${theme.spacing(1)}px auto`,
			padding: theme.spacing(2),
			borderRadius: 15,
		},
		box: {
			justify: "center",
			alignContent: "center",
			display: "flex",
		},
		buttonProgress: {
			color: green[500],
		},
	}),
	);
	const Button = styled(MuiButton)(spacing);
  const classes = useStyles();
  
  
    const handleChange = () => {
      setChecked((prev) => !prev);
    };

	//Formik
	return (
		<Formik
			initialValues={
				{
					email: "",
					password: "",
				}}
			validationSchema={validationSchema}
			onSubmit={async (values, formikHelpers) => {
				try {
					await signIn(values);
				}
				catch (e: unknown) {
					// NOTE: We're just swallowing the exception here for now. Might we need to do
					// something different? Don't know!
				}
				finally {
					formikHelpers.setSubmitting(false);
				}
			}
				//Props
			}>{({ errors, isValid, touched, handleChange }) => {
				useEffect(() => {
					setIsValid(isValid);
				}, [isValid]);

				//Form
				return (
					<Form>
						{/* NOTE: if a Button should submit a form, mark it as type="submit". Otherwise pressing Enter won't submit form*/}

						{/* Container of the sign-in component */}
						<Paper className={classes.paper} elevation={6}>
							<Grid container wrap="nowrap" spacing={2}>
								<Grid item
									direction="column"
									alignItems="center"
									justify="center"
								>
									{/* Display HoudiniLogo */}
									<CardMedia component="img"
										src={logo}
										title="Houdini"
									/>
									{/* Display Login title */}
									<Box p={3} display="flex" justifyContent="center" alignItems="center">
										<Typography gutterBottom variant="h5" component="h2">
											<p>{loginHeaderLabel}</p>
										</Typography>
									</Box>
									<Box display="flex" justifyContent="center" alignItems="center">
										<Box p={1.5}>
											<Field component={TextField} name="email" type="text"
												label={emailLabel}
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<AccountCircle fontSize="small" />
														</InputAdornment>
													),
												}}
											/>
										</Box>
									</Box>
									<Box display="flex" justifyContent="center" alignItems="center">
										<Box p={1.5}>
											<Field component={TextField} name="password" type="password"
												label={passwordLabel}
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<LockOpenIcon fontSize="small" />
														</InputAdornment>
													),
												}} />
										</Box>
									</Box>
                    <Box display="flex" justifyContent="center" alignItems="center">
                      {componentState === 'submitting' ? "" : <>
							          {failed ? <p>{emailValidLabel}</p> : ""}
                        </>
                      }
                    </Box>
                    <Box display="flex" justifyContent="center" alignItems="center">
                      {componentState === 'canSubmit' && !touched.email && !touched.password ?
                        <p>{enterInfoLabel}</p>
                        : null
                      }
                    </Box>
									<Box p={2} display="flex" justifyContent="center" alignItems="center">
                    {componentState !== 'submitting' && isValid  && !failed && touched.email ? 
                      <Button
                        data-testid="signInButton"
                        type="submit"
                        color="primary"
                        variant='contained'
                      > 
                        {formatMessage({ id: 'submit' })} 
                      </Button>
                    : null }
                    {componentState !== 'submitting' && failed && isValid ?
                      <Button
                        data-testid="signInButton"
                        type="submit"
                        color="primary"
                        variant='contained'
                      >
                        {formatMessage({ id: 'submit' })}
                      </Button>
                    : null }
									</Box>

									{/* Progress Ring */}
									<Box p={2} display="flex" justifyContent="center" alignItems="center">
										{componentState === 'submitting' ?
											<CircularProgress disableShrink />
											: null}
										{/* Message After Success */}
										{componentState === 'success' && currentUser ?
											<p>{successLabel} {userIdlabel} {currentUser.id}</p>: null}
									</Box>

									{/* Forgot password link */}
									<Box display="flex" justifyContent="center" alignItems="center">
										<Link
											component="button"
											variant="body2"
											onClick={() => {
												console.info("I'm a button.");
											}}
										>
											<p>{forgotPasswordlabel}</p>
										</Link>
									</Box>
								</Grid>
							</Grid>
						</Paper>
					</Form>
				);
			}}
		</Formik>
	);
}

SignInComponent.defaultProps = {
	// default onFailure to noop so you don't have to check whether onFailure is
	// set inside the component before calling it
	onFailure: noop,
};

export default SignInComponent;