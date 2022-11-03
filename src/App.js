import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Select from 'react-select'
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useState, useEffect } from "react";
import bcrypt from 'bcryptjs';

/** 
todo:
properly load states and jobs up front (again)
style updates
	max widths on fields
	some flourishes
all fields filled - form validation
code cleanup and comments

Nice to have improvements:
Multiple files - currently have all these components piled in one file - should create generic files and import for improved modularity
UI flourishes - more inspired UI/UX design. 
**/

function App() {
	return (
		<div className="App">
			<Header />
			<div className="Body">
				<MainBody />	
			</div>
		</div>
	);
}

//plain bootstrap header for page structure - non-functional
const Header = () => {
	return (
		<Navbar bg="light" className="fixed-top">
			<Container className="justify-content-start">
				<Navbar.Brand href="#home">Fetch Rewards</Navbar.Brand>
				<NavDropdown title="Offers" className="me-auto">
					<NavDropdown.Item href="#">Offer 1</NavDropdown.Item>
					<NavDropdown.Item href="#">Offer 2</NavDropdown.Item>
					<NavDropdown.Item href="#">Offer 3</NavDropdown.Item>
					<NavDropdown.Divider />
					<NavDropdown.Item href="#">Special Offer</NavDropdown.Item>
				</NavDropdown>
			</Container>
			<Container className="justify-content-end">
				<Button>Sign Up</Button>
			</Container>
		</Navbar>		
	);
};

const MainBody = (props) => {
	
	const bcrypt = require('bcryptjs');
	
	//state creation
	const [name, setName] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [pw, setPw] = React.useState("");
	const [job, setJob] = React.useState("");
	const [stateFrom, setStateFrom] = React.useState("");
	
	//properties to be loaded from GET
	const [jobsOptions, setJobsOptions] = React.useState([]);
	const [stateOptions, setStateOptions] = React.useState([]);
	const jobs = [];
	const states = [];
	
	//validation hooks (WIP)
	const [validated, setValidated] = useState(false);
	
	//GET request - utilizing browser fetch - https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
	const loadOptions = async () => {
		let request = new Request("https://frontend-take-home.fetchrewards.com/form", {method: 'GET'});
		fetch(request).then((response) => {
			if (!response.ok) {
				throw new Error('GET request rejected - Error code:' + response.status)
			}
			return response.json();
		}).then((j) => {
			for (let i = 0; i < j.occupations.length; i++) {
				jobs[i] = j.occupations[i];
			}
			for (let i = 0; i < j.states.length; i++) {
				states[i] = j.states[i].name;
			}
			setJobsOptions(jobs);
			setStateOptions(states);
		});
	};
	
	//on mounting, conduct the necessary post request
	useEffect(() => {
		loadOptions();
	});
	
	//submission checker - React Bootstrap form validation
	const handleSubmit = (event) => {
		const form = event.currentTarget;
		//can rely on Form validation from Bootstrap
		if (form.checkValidity() === false) {
		  event.preventDefault();
		  event.stopPropagation();
		}
		else {
			setValidated(true);
			submitFields(validated);
			event.preventDefault();
		}
	  };
		
	//submission handler
	const submitFields = (props) => 
	{	
		if (props.validated === false) { console.log(props.validated); }
		
		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(pw, salt, function(err, hash) {
				const body = JSON.stringify(
				{
					name: name,
					email: email,
					password: hash,
					occupation: job,
					state: stateFrom
				}
			);
			
			fetch("https://frontend-take-home.fetchrewards.com/form", {
				method: 'post',
				body: body,
				headers: {'Accept': 'application/json', 'Content-Type': 'application/json'}
			}).then((response) => {
				if (!response.ok) {
					throw new Error('POST request rejected - Error code:' + response.status)
				}
				return response.json();
				}).then((j) => {
					console.log(j);
				});
			});
		});
		
		
	};
  
    return (
        <div>
			<Form validated={validated} onSubmit={handleSubmit}>
					<Row>
						<EntryField id="name" type="text" label="Full Name:" setter={setName} value={name}/>
						<EntryField id="email" type="email" label="Email:" setter={setEmail} value={email}/>
						<EntryField id="password" type="password" label="Password:" setter={setPw} value={pw}/>
					</Row>
					<Row>
						<Dropdown id="jobber" label="Occupations:" options={jobs} setter={setJob} />
						<Dropdown id="liver" label="State:" options={states} setter={setStateFrom} />
					</Row>
				<Form.Group className="mb-3">
					<Button type="submit">Sign me up!</Button>
				</Form.Group>
			</Form>
		</div>
    );
}

//Labeled entryfield control - takes in label, field type, DOM control ID
class EntryField extends React.Component {
  constructor(props) {
    super(props);
	this.label = props.label;
	this.type = props.type;
	this.id = props.id;
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.setter(event.target.value);
  }

  render() {
    return (
		<>
			<Form.Label>{this.label}</Form.Label>
			<Form.Control required type={this.type} onChange={this.handleChange} />
			<Form.Control.Feedback type="invalid">
				Please provide a valid value.
			</Form.Control.Feedback>
		</>
    );
  }
}

class Dropdown extends React.Component {
  constructor(props) {
    super(props);
	this.label = props.label;
	this.id = props.id;
	this.options = props.options;
	this.setter = props.setter;
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.setter(event.target.value);
  }

  render() {
	return (
	<>
		<Form.Label>{this.label}</Form.Label>
		<Form.Control as="select" required id={this.id} onChange={this.handleChange}>
			<option key="null" value="">{""}</option>
			{this.options.map(entry => <option key={entry} value={entry}>{entry}</option>)}
		</Form.Control>
		<Form.Control.Feedback type="invalid">
            Please select a choice
        </Form.Control.Feedback>
	</>
    );
  }
}

export default App;
