import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Posts from './pages/Posts';
import NavBar from './components/Navbar';
import './App.css';


 import{BrowserRouter as Router,Route,Routes,Link, useNavigate} from "react-router-dom"

function App() {
  return (
    <div className="App">
        <Router>
          
            <nav className='navigation'>
              <ul className='ul'>           
                <li className='li'><Link to='/login'>Login</Link></li> 
                <li className='li'><Link to='/register'>Register</Link></li>
                <li className='li'><Link to='/home'>Home</Link></li>
                <li className='li'><Link to='/logout'>Logout</Link></li>      
                <li className='li'><Link to='/Post'>Posts</Link></li>  
              </ul>
            </nav>
            <Routes>
              <Route exact path='/login' element={<Login/>}/>
              <Route path='/register' element={<SignUp/>}/>
              <Route path='/home' element={<Home/>}/>
              <Route path='/logout' element={<Login/>}/>
              <Route path='/Post' element={<Posts/>}/>
            </Routes>
      </Router>
      
        
    </div>
  );
}

export default App;
