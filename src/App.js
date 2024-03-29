import React, {Component} from 'react';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';

import 'tachyons';
import './App.css';

//Particles config
const particlesOptions = {
  particles: {
    number: {
      value: 130
    },
    move: {
      enable: true,
      speed: 10
    },
    interactivity: {
      detect_on: "canvas",
      enable: true
    },
    line_linked: {
      shadow: {
        enable: true,
        color: "#3CA9D1",
        blur: 5
      }
    }
  }
}

//Clarifai API

const app = new Clarifai.App({
  apiKey: 'd4822666540d4b57a86dadba57aeccd6'
 });

class App extends Component {
  constructor(){
    super()
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})

    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response =>this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState({isSignedIn: false})
    } else if(route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render(){
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions}/>
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} ></Navigation>
        { route === 'home' ?
            <div>
              <Logo></Logo>
              <Rank></Rank>
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}></ImageLinkForm>
              <FaceRecognition box={box} imageUrl={imageUrl}></FaceRecognition>
            </div> 
          : (route === 'signin' ? 
            <SignIn onRouteChange={this.onRouteChange}></SignIn>
            :
            <Register onRouteChange={this.onRouteChange}></Register>
          )

        }
      </div>
    );
  }
}

export default App;
