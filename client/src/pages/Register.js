import React, {useContext,useState} from 'react';
import { Form, Button } from 'semantic-ui-react';
import { useMutation,gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../utils/hooks';
import { AuthContext } from '../context/authContext';

function Register(props){
  const navigate=useNavigate();
  const context=useContext(AuthContext);

  const [errors,setErrors]=useState({});

  const { onChange, onSubmit, values}=useForm(registerUser,{
    username: '',
    password: '',
    email: '',
    confirmPassword: ''
  });

  const [addUser, {loading}]=useMutation(REGISTER_USER,{
    update(_,{data : {register : userData}}){
      context.login(userData);
      navigate('/');
    },
    onError(err){
      const gqlError = err?.graphQLErrors?.[0];
      const errorData = gqlError?.extensions?.exception?.errors;
      if(errorData){
        setErrors(errorData);
      }
    },
    variables : values
  });

  function registerUser(){
    addUser();
  }


  return(
    <div className='form-container'>
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Register</h1>
        <Form.Input
          label="Username"
          placeholder="Username..."
          name="username"
          type="text"
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Email"
          placeholder="Email..."
          name="email"
          type="email"
          value={values.email}
          error={errors.email ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Password"
          placeholder="Password..."
          name="password"
          type="password"
          value={values.password}
          error={errors.password ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Confirm Password"
          placeholder="Confirm Password..."
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          error={errors.confirmPassword ? true : false}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Register
        </Button>
      </Form>
    {Object.keys(errors).length>0 && (<div className="ui error message">
        <ul className="list">
          {Object.values(errors).map(value => (
            <li key={value}>{value}</li>
          ))}
        </ul>
      </div>
    )}
    </div>
  )
}

const REGISTER_USER=gql`
  mutation register(
    $username : String!
    $email : String!
    $password : String!
    $confirmPassword : String!
  ){
    register(
      registerInput: {
        username : $username
        email : $email
        password : $password
        confirmPassword: $confirmPassword
      }
    ){
      id email username createdAt token
    }
  }
`

export default Register;