import React, { Component } from "react";

class Airdrop extends Component {
  constructor() {
    super();
    this.state = {
      time: {},
      seconds: 1200,
    };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  startTimer() {
    if (this.timer === 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });

    if (seconds === 0) {
      clearInterval(this.timer);
      this.props.issueTokens();
    }
  }

  secondsToTime(secs) {
    let hours = Math.floor(secs / 3600),
      minutes = Math.floor((secs % 3600) / 60),
      seconds = (secs % 3600) % 60,
      obj = {
        h: hours,
        m: minutes,
        s: ("0" + seconds.toString()).slice(-2),
      };
    return obj;
  }

  componentDidMount() {
    let timeLeft = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeft });
  }

  airdropReleaseTokens() {
    let stakingBalance = this.props.stakingBalance;
    if (stakingBalance >= window.web3.utils.toWei("50")) {
      this.startTimer();
    }
  }

  render() {
    this.airdropReleaseTokens();
    return (
      <div style={{ color: "black" }}>
        {this.state.time.m}:{this.state.time.s}
      </div>
    );
  }
}

export default Airdrop;
