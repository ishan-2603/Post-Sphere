import React, {useState} from 'react';
import { gql, useMutation } from '@apollo/client';
import {Button, Icon, Confirm} from 'semantic-ui-react';
import { AuthContext } from '../context/authContext';
import { FETCH_POST_QUERY } from '../utils/graphpl';
import MyPopup from '../utils/MyPopup';

function DeleteButton({postId, commentId,callback}){
  const [confirmOpen, setConfirmOpen]=useState(false);

  const mutation= commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrMutation]=useMutation(mutation,{
    update(proxy){
      setConfirmOpen(false);
      //TODO remove post from cache
      if(!commentId){
        const data = proxy.readQuery({ query: FETCH_POST_QUERY });

        const newData = {
          ...data,
          getPosts: data.getPosts.filter(p => p.id !== postId)
        };

        proxy.writeQuery({ query: FETCH_POST_QUERY, data: newData });
      }
      if(callback) callback();
    },
    variables: {
      postId,
      commentId
    }
  })
  return(
    (
      <>
        <MyPopup
          content={commentId ? "Delete comment" : "Delete post"}>
            <Button as="div" color="red" floated="right" onClick={() => setConfirmOpen(true)}>
              <Icon name="trash" style={{margin : 0}}/>
            </Button>
        </MyPopup>
        <Confirm
          open={confirmOpen}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={deletePostOrMutation}
        />
      </>
    )
  )
}

const DELETE_POST_MUTATION=gql`
  mutation deletePost($postId : ID!){
    deletePost(postId : $postId)
  }
`;

const DELETE_COMMENT_MUTATION=gql`
  mutation deleteComment($postId: ID!, $commentId: ID!){
    deleteComment(postId: $postId, commentId: $commentId){
      id
      comments{
        id username createdAt body
      }
      commentCount
    }
  }
`;

export default DeleteButton;