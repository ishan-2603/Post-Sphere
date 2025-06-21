import 'semantic-ui-css/semantic.min.css';
import './App.css';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import {Container} from 'semantic-ui-react';
import MenuBar from './components/MenuBar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import { AuthProvider } from './context/authContext';
import AuthRoute from './utils/AuthRoute';
import SinglePost from './pages/SinglePost';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Routes>
            <Route exact path='/' element={<Home/>}/>
            <Route exact path='/login' element={<AuthRoute><Login/></AuthRoute>}/>
            <Route exact path='/register' element={<AuthRoute><Register/></AuthRoute>}/>
            <Route exact path='/posts/:postId' element={<SinglePost/>}/>
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;
