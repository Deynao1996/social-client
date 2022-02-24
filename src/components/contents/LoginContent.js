import {Link} from 'react-router-dom';
import * as Yup from 'yup';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import {useProvider} from '../../contexts/UserContext.js';
import useFeatures from '../../hooks/useFeatures.js';
import useService from '../../hooks/useService.js';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const CustomField = ({type, placeholder, name, ...props}) => {
  return (
    <>
    <Field
        type={type}
        placeholder={placeholder}
        name={name}
        id={name}
        {...props}/>
    <ErrorMessage className="errorMessage" name={name} component="div"/>
    </>
  )
};

const LoginContent = () => {
  const {loginUser} = useService();
  const {login} = useProvider();
  const {showStatusModal} = useFeatures();

  const initialValues = {
    email: '',
    password: ''
  };

  const validationSchema = Yup.object({
    email: Yup.string()
            .required('Required field')
            .email("Invalid email format"),
    password: Yup.string()
            .required('Required field')
  });


  async function handleSubmit({email, password}) {
    try {
      const user = await loginUser(JSON.stringify({
        email: email.toLowerCase(),
        password
      }));

      if (user.errorMessage) {
        showStatusModal(user.errorMessage, 'error');
      } else {
        login(user, '/');
        localStorage.setItem('token', user.accessToken);
      }
    } catch (error) {
      showStatusModal("Couldn't login to account. Try later", "error");
    }
  };

  
  return (
    <div className="auth__wrapper">
      <ToastContainer/>
      <Formik 
        initialValues={initialValues} 
        validationSchema={validationSchema} 
        onSubmit={handleSubmit}>
          {({isSubmitting}) => (
            <Form className="auth__form">
              <CustomField type="email" placeholder='Email' name='email' id='email'/>
              <CustomField type="password" placeholder='Password' name='password' id='password'/>
              <button type="submit" name="button" disabled={isSubmitting}>Log In</button>
            </Form>
          )}
      </Formik>
      <a href="#" className="auth__wrapper-password">Forgot Password?</a>
      <Link to="/auth/register" className="auth__wrapper-create">Create A New Account</Link>
    </div>
  )
};

export default LoginContent;
