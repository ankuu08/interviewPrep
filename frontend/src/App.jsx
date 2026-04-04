import React from 'react'
import { Route } from 'react-router-dom/cjs/react-router-dom.min'
import Homepage from './pages/Homepage'
import Chatpage from './pages/Chatpage'
import "./App.css";
import HomePagee from './pages/HomePagee';
import EditorPage from './pages/EditorPage';
import { Switch } from 'react-router-dom/cjs/react-router-dom';
function App() {
  return (
    <div className='App'>
      <Switch>
        <Route path="/" component={Homepage} exact ></Route>
        <Route path="/chats" component={Chatpage} exact ></Route>
        <Route path="/chats/editor" component={HomePagee} exact />
        <Route path="/chats/editor/editorpage" component={EditorPage} />
      </Switch>
    </div>
  )
}

export default App
