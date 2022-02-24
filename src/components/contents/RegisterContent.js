import {Link} from 'react-router-dom';
import * as Yup from 'yup';
import {Formik, Form} from 'formik';
import useService from '../../hooks/useService.js';
import {ToastContainer} from 'react-toastify';
import useFeatures from '../../hooks/useFeatures.js';
import {CustomField} from './LoginContent.js';


const RegisterContent = () => {
  const {registerUser} = useService();
  const {showStatusModal} = useFeatures();

  const initialValues = {
    username: '',
    email: '',
    password: '',
    name: '',
    lastName: '',
    passwordAgain: ''
  };
  
  const validationSchema = Yup.object({
    username: Yup.string()
            .required('Required field'),
    email: Yup.string()
            .required('Required field')
            .email("Invalid email format"),
    name: Yup.string()
            .required('Required field')
            .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field'),
    lastName: Yup.string()
            .required('Required field')
            .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field'),
    password: Yup.string()
            .required('Required field'),
    passwordAgain: Yup.string()
            .required('Required field')
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
  });

  async function handleSubmit(values, resetForm) {
    const {username, email, password, name, lastName} = values;

    try {
      const newUser = await registerUser(JSON.stringify({
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        name: name.toLowerCase(),
        lastName: lastName.toLowerCase(),
        password
      }));

      if (newUser.errorMessage) {
        showStatusModal(newUser.errorMessage, 'error');
      } else {
        showStatusModal('User has been created', 'success');
        resetForm();
      }
    } catch (error) {
      showStatusModal('Something went wrong. Try later', 'error');
    }
  };


  return (
    <div className="auth__wrapper" style={{height: '600px'}}>
      <ToastContainer/>
      <Formik 
        initialValues={initialValues} 
        validationSchema={validationSchema} 
        onSubmit={(values, {resetForm}) => handleSubmit(values, resetForm)}>
          {({isSubmitting}) => (
            <Form className="auth__form" style={{height: '80%'}}>
              <CustomField type="text" placeholder='Username' name='username' id='username'/>
              <CustomField type="email" placeholder='Email' name='email' id='email'/>
              <CustomField type="text" placeholder='Name' name='name' id='name'/>
              <CustomField type="text" placeholder='Last Name' name='lastName' id='lastName'/>
              <CustomField type="password" placeholder='Password' name='password' id='password'/>
              <CustomField type="password" placeholder='Password Again' name='passwordAgain' id='passwordAgain'/>
              <button type="submit" name="button" disabled={isSubmitting}>Sign Up</button>
            </Form>
          )}
      </Formik>
      <Link to="/auth/login" className="auth__wrapper-create">Log In</Link>
    </div>
  )
};

export default RegisterContent;