import { useState } from 'react';
import useLocalStorage from '../Hooks/useLocalStorage';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import '../Styles/LoginReg.css';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import styles from '../Styles/App';

const Login = () => {
  const [errors, setErrors] = useState([]);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const [loginUser, setLoginUser] = useState({
    email: "",
    password: ""
  });

  const [credentials, setCredentials] = useLocalStorage("credentials", {});

  const handleChange = (e) => {
    setLoginUser({ ...loginUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("/api/auth/login", loginUser)
      setCredentials(result.data);
      navigate('/');
    } catch (err) {
      const errorData = err.response.data.errors || err.response.data
      const errorMessages = Object.values(errorData).flat();
      setErrors(errorMessages);
    }
  };

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
          pb: 4
          }}
        >
          Sign into your account
        </Typography>
        <Box component="form" onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
          }}>
          <TextField
            className="mb-3"
            required
            color="success"
            fullWidth
            label="Email"
            type="text"
            name="email"
            placeholder="yourname@mail.com"
            autoFocus
            value={loginUser.email}
            onChange={handleChange}
          />
          <TextField
            className="mb-3"
            required
            color="success"
            fullWidth
            label="Password"
            type={passwordVisible ? "text" : "password"}
            name="password"
            placeholder="Insert your password"
            value={loginUser.password}
            onChange={handleChange}
          />
          { passwordVisible ? (
            <VisibilityIcon
              onClick={() => setPasswordVisible(!passwordVisible)}
              sx={{
                position: "absolute",
                translate: "270px -37px",
                opacity: .5,
                "&:hover": {
                  cursor: "pointer",
                  opacity: 1,
                }
              }}
            /> 
            ) : (
            <VisibilityOffIcon
              onClick={() => setPasswordVisible(!passwordVisible)}
              sx={{
                position: "absolute",
                translate: "270px -37px",
                opacity: .5,
                "&:hover": {
                  cursor: "pointer",
                  opacity: 1,
                }
              }}
            />
          )}
          <div className="flex-col-center" style={{ 
            height: "15px",
            justifyContent: "end", 
          }}
          >
            { errors.length == 0 ? (
              null
            ) : (
              <Typography variant='caption' className="errorStyle"
              >
                Invalid email and/or password. Please try again.
              </Typography>
            )}
          </div>
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
            Sign in
          </Button>
          <Grid container direction="column" alignItems="center" pt={1}>
            <Grid item xs>
              <Link href="#" underline="hover" variant="body2" 
                sx={{ color: styles.colors.PRIMARY,
                  fontWeight: "bold",
                  opacity: .8
                }} 
              >
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link component={RouterLink} to={"/instrumental/register"} underline="hover" variant="body2" 
                sx={{ color: styles.colors.PRIMARY,
                  fontWeight: "bold",
                  opacity: .8
                }} 
              >
                Register as a new user
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
