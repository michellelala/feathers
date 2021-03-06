import React, { Component } from "react";
import axios from "axios";
import { Link, Redirect } from "react-router-dom";

import "../Stylesheets/register.css";

class NewUser extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      email: "",
      password: "",
      validEmail: false,
      message: "",
      registered: false,
      loggedIn: false
    };
  }

  handleInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  submitForm = e => {
    // on submit we have to check if the username is taken
    // and if the email is already in use
    e.preventDefault();
    const { username, email, password } = this.state;
    if (email) {
      axios.get("/users").then(response => {
        if (!response.data.data.find(n => n.email === email)) {
          this.setState({
            validEmail: true
          });
        } else {
          this.setState({
            validEmail: false,
            message: "email already in use"
          });
        }
      });
    }
    if (username && password) {
      if (username.length < 6) {
        return this.setState({
          message: "Username must be at least 6 characters"
        });
      }
      if (username.length < 6) {
        return this.setState({
          message: "Password must be at least 6 characters"
        });
      }
      axios.get("/users").then(response => {
        console.log("RESPONSE FOR GET REQUEST", response.data.data);
        if (!response.data.data.find(n => n.username === username)) {
          axios
            .post("/users/register", {
              username: username,
              email: email,
              password: password
            })
            .then(res => {
              console.log(res.data);
              this.props.setUser(res.data);
              this.props.active();
              this.setState({
                message: "Registered user",
                registered: true,
                loggedIn: true
              });
            })
            .catch(err => {
              console.log(err);
              this.setState({
                email: "",
                fullname: "",
                username: "",
                password: "",
                message: "Error registering user"
              });
            });
        } else {
          this.setState({
            message: "Username  already exists"
          });
        }
      });
    } else {
      this.setState({
        message: "Please fill all entries."
      });
    }
  };

  render() {
    const { username, email, password, message, registered } = this.state;

    if (registered)
      return (
        <Redirect
          to={{
            pathname: "/users/signup/survey",
            state: { referrer: this.state.username }
          }}
        />
      );

    return (
      <div className="register-user-container">
        <h2 id="navLogoName"> Drift Together </h2>
        <div className="registerBox" class="registerBox">
          <form onSubmit={this.submitForm} className="new-user-form">
            <input
              className="reg-email"
              placeholder="Email"
              type="email"
              name="email"
              value={email}
              onChange={this.handleInput}
            />
            <input
              className="reg-username"
              placeholder="Username"
              type="text"
              name="username"
              value={username}
              onChange={this.handleInput}
            />
            <input
              className="reg-password"
              placeholder="Password"
              type="password"
              name="password"
              value={password}
              onChange={this.handleInput}
            />
            <br />
            <input
              className="reg-submit"
              type="submit"
              value="Join Us!"
              onClick={this.renderSurvey}
            />
          </form>
        </div>
        {message}
      </div>
    );
  }
}

export default NewUser;
