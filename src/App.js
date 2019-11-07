import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Component } from 'react';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {value: 'adobe', final_data: [], time: {}, seconds: 30 };
    this.timer = 0;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.countDown = this.countDown.bind(this);
    this.startTimer = this.startTimer.bind(this);

  }

  secondsToTime(secs){
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      "h": hours,
      "m": minutes,
      "s": seconds
    };
    return obj;
  }

  countDown() {
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });
    
    // Check if we're at zero.
    if (seconds == 0) { 
      var url_string = window.location.href;
      var url = new URL(url_string);
      var key= url.searchParams.get("key");
      this.setState({ value: key });
      this.getResults(key);

      this.timer = setInterval(()=> this.getResults(key), 30000);
      this.setState({ seconds : 30});

      clearInterval(this.timer);
    }
  }

  startTimer() {
    if (this.timer == 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  getResults = (key_val) => {
      document.getElementById('finalCon').innerHTML = "Loading...";
      axios.get('https://aravindtwitter.herokuapp.com/twittersearch?key='+key_val).then(res => {
      this.setState({ final_data: res.data });
      //console.log('data', this.state.final_data.statuses);
      document.getElementById('finalCon').innerHTML = "";
      }).catch(function (error) {
        // handle error
        console.log(error);
    });
    this.startTimer();
  }
  
  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

    var url_string = window.location.href;
    var url = new URL(url_string);

   // console.log('URL::', url);

    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?key='+this.state.value;
    window.history.pushState({path:newurl},'',newurl);

    this.getResults(this.state.value);
  }

  componentDidMount(){
    var url_string = window.location.href;
    var url = new URL(url_string);
    var key= url.searchParams.get("key");
    this.setState({ value: key });
    this.getResults(key);

    this.timer = setInterval(()=> this.getResults(key), 30000);

    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });

    
  }
  

 render(){
 
  let FinalResults = '';
  if(this.state.final_data.statuses){
    
    FinalResults = this.state.final_data.statuses.map(item=>{
      return(
          <div className="individualResultsCon" key={item.id}>
                
                <Row>
                  <Col sm={1}><div align="center"><img src={item.user.profile_image_url} /></div></Col>
                  <Col sm={10}>
                    <Row className="colorGray">
                      <Col sm={4}>{item.user.name}</Col>
                      <Col sm={4}>{item.in_reply_to_screen_name}</Col>
                      <Col sm={4}>{item.created_at}</Col>
                    </Row>
                    <Row>
                      <Col sm={12}>{item.text}</Col>
                    </Row>
                  </Col>                
                </Row>
         </div>
      )
    })
  } 
  

  return (
    <Container>
        <Row>
          <Col sm={8}><div className="blueText">Search @ Twitter</div></Col>
          <Col sm={4}><div className="blueText" align="right"><small>Auto refresh at {this.state.time.s} seconds</small></div></Col>
        </Row>
        <Row>
        <Col sm={12}><div className="borderBottom"></div></Col>
      </Row>
      <Row>
        <Col sm={2}></Col>
        <Col sm={8}>
          <form className="searchFrm" onSubmit={this.handleSubmit}>
            <input type="text" name="key" value={this.state.value} onChange={this.handleChange}  />
            <input type="submit" value="SEARCH" />  
          </form>
        </Col>
        <Col sm={2}></Col>
      </Row>
      <Row>
        <Col sm={12}><div className="marginBottom"></div></Col>
      </Row>
      <Row>
        <Col sm={12}>
        <div align="center" className="marginBottom" id="finalCon"></div>
        {FinalResults}
        </Col>
      </Row>
      <Row>
        <Col sm={12}><div className="marginBottom"></div></Col>
      </Row>
      </Container>
  );
 }
 
}

export default App;
