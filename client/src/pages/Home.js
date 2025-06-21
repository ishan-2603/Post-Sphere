import React, {useContext} from 'react';
import { useQuery,gql } from '@apollo/client';
import { Grid, GridColumn, Transition } from 'semantic-ui-react';
import PostCard from '../components/PostCard.js';
import { AuthContext } from '../context/authContext.js';
import PostForm from '../components/PostForm';
import { FETCH_POST_QUERY } from '../utils/graphpl.js';

function Home(){
  const {user}=useContext(AuthContext);
  const { loading, data } = useQuery(FETCH_POST_QUERY);
  const posts = data?.getPosts || [];

  return(
    <Grid columns={3} divided>
      <Grid.Row className='page-title'>
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm/>
          </Grid.Column>
        )}
        {loading ? (
          <h1>Loading Posts...</h1>
        ) : (
          <Transition.Group>
          {posts && posts.map(post => (
            <Grid.Column key={post.id} style={{marginBottom: 20}}>
              <PostCard post={post}/>
            </Grid.Column>
          ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  )
}

export default Home;