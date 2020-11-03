// License: LGPL-3.0-or-later
import React, { useEffect, useState } from "react";
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Formik, Form, ErrorMessage } from 'formik';
import noop from "lodash/noop";
import usePrevious from 'react-use/esm/usePrevious';
import Typography from '@material-ui/core/Typography';
import { spacing } from '@material-ui/system';
import MuiButton from "@material-ui/core/Button";
import { styled } from "@material-ui/core/styles";
import Grid from '@material-ui/core/Grid';
import logo from './Images/HoudiniLogo.png';
import Paper from '@material-ui/core/Paper';


import { Link } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import CardMedia from "@material-ui/core/CardMedia";
import TextField from '@material-ui/core/TextField';
import useCurrentUserAuth from "../../hooks/useCurrentUserAuth";
import { SignInError } from "../../legacy_react/src/lib/api/errors";
import { useIntl } from "../../components/intl";
import * as yup from '../../common/yup';
import Alert from '@material-ui/lab/Alert';
import Box from '@material-ui/core/Box';


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
			props.onFailure(lastError);
		}

		if (wasSubmitting && !failed) {
			// we JUST succeeded
			// TODO
		}
	}, [failed, submitting, previousSubmittingValue]);

	useEffect(() => {
		if (submitting) {
			setComponentState('submitting');
		}
	}, [submitting]);

	useEffect(() => {
		if (isValid && componentState == 'ready') {
			setComponentState('canSubmit');
		}
	}, [isValid, componentState]);


	//Setting  messages
	const { formatMessage } = useIntl();
	const label = formatMessage({ id: 'email', defaultMessage: '* Requiered' });

	//Yup validation
	const validationSchema = yup.object({
		email: yup.string().email().required(),
		password: yup.string().required(),
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
	}),
	);
	const Button = styled(MuiButton)(spacing);
	const classes = useStyles();

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
											Login
										</Typography>
									</Box>
									{/* Email Field */}
									<Box display="flex" justifyContent="center" alignItems="center">
										<Box p={1.5}>
											<InputLabel htmlFor="email">Email</InputLabel>
											<TextField
												type="text"
												className={'form-control'}
												id="emal"
												name="email"
												onChange={handleChange}
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<AccountCircle fontSize="small" />
														</InputAdornment>
													),
												}}
											/>
											{/* Display error message for email */}
											{errors.email && touched.email ?
												<Alert severity="error">
													<ErrorMessage name="email" >
														{(errorMessage: any) => {
															return label;
														}}
													</ErrorMessage>
												</Alert>
												: null}
										</Box>
									</Box>
									{/* Password Field */}
									<Box display="flex" justifyContent="center" alignItems="center">
										<Box p={1.5}>
											<InputLabel htmlFor="password">Password</InputLabel>
											<TextField
												className={'form-control'}
												id="password"
												name="password"
												type="password"
												onChange={handleChange}
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<LockOpenIcon fontSize="small" />
														</InputAdornment>
													),
												}}
											/>
											{/* Display error message for email */}
											{errors.password && touched.password ?
												<Alert severity="error">
													<ErrorMessage name="password" >
														{(errorMessage: any) => {
															return label;
														}}
													</ErrorMessage>
												</Alert>
												: null}
										</Box>
									</Box>
									{/* Submit button */}
									<Box p={2} display="flex" justifyContent="center" alignItems="center">
										<Box>
											<Button
												data-testid="signInButton"
												type="submit"
												variant={'contained'}
												color={'primary'}
											>
												{formatMessage({ id: 'submit' })}
											</Button>
										</Box>
									</Box>
									<br />
									{/* Forgot password link */}
									<Box display="flex" justifyContent="center" alignItems="center">
										<Link
											component="button"
											variant="body2"
											onClick={() => {
												console.info("I'm a button.");
											}}
										>
											Forgot Password
										</Link>
									</Box>
								</Grid>
							</Grid>
						</Paper>


						{componentState === 'submitting' ? "" : <>
							<div data-testid="signInErrorDiv">{failed ? lastError.data.error.map((i) => i).join('; ') : ""}</div>
							<div data-testid="currentUserDiv">{currentUser ? currentUser.id : ""}</div>
						</>
						}
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