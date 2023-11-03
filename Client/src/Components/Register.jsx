import { useState } from 'react';
import styles from '../Styles/App';
import useLocalStorage from '../Hooks/useLocalStorage';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import '../Styles/LoginReg.css';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

const Register = () => {
	const [errors, setErrors] = useState([]);
	const navigate = useNavigate();
	const [registerUser, setRegisterUser] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirm: ""
	});

	const [credentials, setCredentials] = useLocalStorage("credentials", {});

	const handleChange = (e) => {
		setRegisterUser({ ...registerUser, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const result = await axios.post("/api/auth/register", registerUser)
			setCredentials(result.data);
			navigate('/');
		} catch (err) {
			const errorData = err.response.data.errors || err.response.data
			const errorMessages = Object.values(errorData).flat();
			setErrors(errorMessages);
		}
	};

	const emailError = "The Email field is not a valid e-mail address.";
	const passwordError = "Your password must include at least 1 of each of the following: Uppercase letter, lowercase letter, number, and special character";
	const passwordLengthError = "The field Password must be a string or array type with a minimum length of '8'.";
	const confirmPasswordError = "'Confirm' and 'Password' do not match."

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					backgroundColor: "white",
					width: "350px",
					padding: "40px 20px",
					borderRadius: "10px",
				}}
			>
				<Typography variant='h5' sx={{
					fontWeight: "bold",
					opacity: .8,
					color: styles.colors.PRIMARY,
					mb: 1,
				}}
				>
					Time to sign up
				</Typography>
				<Box component="form" onSubmit={handleSubmit}
					sx={{
						mt: 2,
						display: "flex",
						flexWrap: "wrap",
						justifyContent: "center"
					}}>
					<TextField
						className="mb-3"
						required
						color='success'
						fullWidth
						label="First Name"
						type="text"
						name="firstName"
						placeholder="Insert your first name"
						autoFocus
						value={registerUser.firstName}
						onChange={handleChange}
					/>
					<TextField
						className="mb-3"
						required
						color='success'
						fullWidth
						label="Last Name"
						type="text"
						name="lastName"
						placeholder="Insert your last name"
						value={registerUser.lastName}
						onChange={handleChange}
					/>
					<TextField
						className="mb-3"
						required
						color='success'
						fullWidth
						label="Email"
						type="text"
						name="email"
						placeholder="yourname@mail.com"
						value={registerUser.email}
						onChange={handleChange}
						error={errors.includes(emailError)  ? true : false}
						helperText={errors.includes(emailError) 
							? "Please enter a valid email" 
							: null
						}
					/>
					<TextField
						className="mb-3"
						required
						color='success'
						fullWidth
						label="Password"
						type="password"
						name="password"
						placeholder="Create a password"
						value={registerUser.password}
						onChange={handleChange}
						error={errors.includes(passwordLengthError) || errors.includes(passwordError) 
							? true
							: false}
						helperText={errors.includes(passwordError)
							? (
								<div style={{ marginBottom: -15}}>
									<span>Password must contain:</span>
									<ul style={{ listStyleType: "square" }}>
										{errors.includes(passwordLengthError) ? <li>At least 8 characters</li> : null}
										<li>An uppercase letter</li>
										<li>A lowercase letter</li>
										<li>A number</li>
										<li>A special character</li>
									</ul>
								</div>
							) : errors.includes(passwordLengthError)
							? "Password must contain at least 8 characters"
							: null
						}
					/>
					<TextField
						className="mb-3"
						required
						color='success'
						fullWidth
						label="Confirm Password"
						type="password"
						name="confirm"
						placeholder="Repeat your password"
						value={registerUser.confirm}
						onChange={handleChange}
						error={errors.includes(confirmPasswordError)  ? true : false}
						helperText={errors.includes(confirmPasswordError) 
							? "Passwords do not match" 
							: null
						}
					/>
					<Button
						type="submit"
						color='warning'
						disableElevation
						variant="contained"
						sx={{
							width: "100%",
							my: 1,
							py: 1.1,
							fontWeight: "bold",
							textTransform: "none",
						}}
					>
						Create account
					</Button>
					<Grid container direction="column" alignItems="center" pt={1}>
						<Grid item xs>
							<Link component={RouterLink} to={"/instrumental/sign-in"} underline="hover" variant="body2"
								sx={{
									color: styles.colors.PRIMARY,
									fontWeight: "bold",
									opacity: .8
								}} 
							>
								Already have an account? Sign in
							</Link>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Container>
	)
}

export default Register;
