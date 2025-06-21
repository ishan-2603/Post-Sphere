import React, {useState} from 'react';
import {Form,Button} from 'semantic-ui-react';
import {useForm} from '../utils/hooks';
import {gql, useMutation} from '@apollo/client';
import { FETCH_POST_QUERY } from '../utils/graphpl';


function PostForm(){
  const {values,onChange,onSubmit}=useForm(createPostFunc,{
    body: ''
  });
  const [errors,setErrors]=useState({});
  const [createPost, { loading }]=useMutation(CREATE_POST_MUTATION,{
    variables: values,
    update(proxy,result){
      const data=proxy.readQuery({
        query: FETCH_POST_QUERY
      })
      proxy.writeQuery({query: FETCH_POST_QUERY, data:{
        getPosts: [result.data.createPost,...data.getPosts]
      }});
      values.body='';
    },
    onError(err){
      const gqlError = err?.graphQLErrors?.[0];
      if (gqlError?.message) {
        setErrors({ general: gqlError.message });
      }
    }
  });

function  createPostFunc(){
  createPost();
}

  return(
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post:</h2>
        <Form.Field>
          <Form.Input
            placeholder="Hi World!"
            name="body"
            onChange={onChange}
            value={values.body}
            error={errors ? true : false}
            />
          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
      </Form>
    {Object.keys(errors).length > 0 && (
        <div className="ui error message" style={{marginBottom: 20}}>
          <ul className="list">
            {Object.values(errors).map((value, idx) => (
              <li key={idx}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}


const CREATE_POST_MUTATION=gql`
  mutation createPost($body: String!){
    createPost(body: $body){
      id body createdAt username
      likes{
        id username createdAt
      }
      likeCount
      comments{
        id body username createdAt
      }
      commentCount
    }
  }
`
export default PostForm;