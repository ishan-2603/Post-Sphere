import React, {useContext,useState} from 'react';
import { Form, Button } from 'semantic-ui-react';
import { useMutation,gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../utils/hooks';
import { AuthContext } from '../context/authContext';

function Login(props){
  const context=useContext(AuthContext);
  const navigate=useNavigate();
  const [errors,setErrors]=useState({});
  const { onChange, onSubmit, values}=useForm(loggingUser,{
      username: '',
      password: ''
    });

  const [loginUser, {loading}]=useMutation(LOGIN_USER,{
    update(_,{data : {login : userData}}){
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
  })
  
  function loggingUser(){
    loginUser();
  }

  return(
    <div className='form-container'>
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Login</h1>
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
          label="Password"
          placeholder="Password..."
          name="password"
          type="password"
          value={values.password}
          error={errors.password ? true : false}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Login
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

const LOGIN_USER=gql`
  mutation login(
    $username : String!
    $password : String!
  ){
    login(
      username: $username
      password: $password
    ){
      id
      email
      username
      createdAt 
      token
    }
  }
`;

export default Login;