import { useState } from 'react'
import './App.css'
// import { BrowserRouter as Router, Route,Switch  } from 'react-router-dom';
import Login1 from './components/Login/Login1'

function App() {
  const [count, setCount] = useState(0)

  return (
    // <Router>
    //   <Switch>
    //   {/* <div>{count}  </div> */}
    //   <Route path="/" exact component={Login1}/>
    //   <Route path="/homepage" component={HomePage}/>
     
    //  </Switch>
    // </Router>
    <Login1/> 
  )
}

export default App
