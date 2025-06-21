import React, {useContext} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardMeta, Icon, Label, Image,Button, Popup} from 'semantic-ui-react';
import moment from 'moment';
import {Link} from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import MyPopup from '../utils/MyPopup';

function PostCard({post : {body,createdAt,id,username,likeCount,commentCount,likes}}){
  const {user}=useContext(AuthContext);

  function commentOnPost(){
    console.log('Comment on Post!!');
  }
  return (
    <Card fluid>
      <CardContent>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/jenny.jpg'
        />
        <CardHeader>{username}</CardHeader>
        <CardMeta as={Link} to={`/posts/${id}`}>{moment(createdAt).fromNow(true)}</CardMeta>
        <CardDescription>
          {body}
        </CardDescription>
      </CardContent>
      <CardContent extra>
        <LikeButton user={user} post={{id,likes,likeCount}}/>
        <MyPopup content="Comment on post">
          <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
            <Button color='blue' basic>
              <Icon name='comments' />
            </Button>
            <Label basic color='blue' pointing='left'>
              {commentCount}
            </Label>
          </Button>
         </MyPopup>
        {user && user.username===username && <DeleteButton postId={id}/>}
      </CardContent>
    </Card>
  )
}

export default PostCard;