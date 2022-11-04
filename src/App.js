import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useState, useEffect } from "react";

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
			<MainBody />	
		</div>
	);
}

//plain bootstrap header for page structure - largely non-functional
const Header = () => {
	
	//Adding a refresh for ease of reset
	const resetPage = () => {
		window.location.reload();
	  };
	
	
	return (
		<Navbar  bg="light" variant="light" className="fixed-top">
			<Container className="justify-content-start">
				<Navbar.Brand href="#home">Fetch Rewards</Navbar.Brand>
				<NavDropdown title="Offers" className="me-auto" bg="dark" variant="dark">
					<NavDropdown.Item href="#">Offer 1</NavDropdown.Item>
					<NavDropdown.Item href="#">Offer 2</NavDropdown.Item>
					<NavDropdown.Item href="#">Offer 3</NavDropdown.Item>
					<NavDropdown.Divider />
					<NavDropdown.Item href="#">Special Offer</NavDropdown.Item>
				</NavDropdown>
			</Container>
			<Container className="justify-content-end">
				<Button onClick={resetPage}>Sign Up</Button>
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
			//can prevent default to keep page from refreshing
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
				});
			});
		});
		
		
	};
  
    return (
		<>
			<div className="text-primary font-weight-bold text-center">
				<div className="text-primary font-weight-bold SplashHeader">
					<h1 class="display-1">Today is the first day of the rest of your life</h1>
				</div>
				<div className="SplashSubHeader">
					<h1 class="display-4">Just give us some particulars and we'll do the rest...</h1>
				</div>
			</div>
			<Container className="MainContainer">
				<Form validated={validated} onSubmit={handleSubmit} hidden={validated}>
					<Row>
						<Form.Group as={Col}>
							<EntryField id="name" label="Full Name:" type="text" setter={setName} value={name}/>
						</Form.Group>
						<Form.Group as={Col}>
							<EntryField id="email" label="Email:" type="email" setter={setEmail} value={email}/>
						</Form.Group>
						<Form.Group as={Col}>
							<EntryField id="password" label="Password:" type="password" setter={setPw} value={pw}/>
						</Form.Group>
					</Row>
					<br/>
					<Row className="entryfields-container">
						<Col>
							<Dropdown id="jobber" label="Occupation:" options={jobs} setter={setJob} />
						</Col>
						<Col>
							<Dropdown id="liver" label="State:" options={states} setter={setStateFrom} />
						</Col>
						<Col>
							<Button type="submit" className="btnMargin">Sign me up!</Button>
						</Col>
					</Row>
				</Form>
				<div className="text-center text-success" hidden={!validated}>
					<h1>Form successfully submitted!</h1>
				</div>
			</Container>
		</>
    );
}

//Labeled entryfield control - takes in label, field type, DOM control ID
class EntryField extends React.Component {
	constructor(props) {
		super(props);
		this.label = props.label; //field label
		this.type = props.type; //entry field type, essentially uses HTML input types
		this.id = props.id; //control id
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		this.props.setter(event.target.value);
	}

	render() {
		return (
			<>
				<Form.Label className="subtleLabel">{this.label}</Form.Label>
				<Form.Control controlId={this.id} required type={this.type} onChange={this.handleChange} />
				<Form.Control.Feedback type="invalid">
					Please provide a valid value.
				</Form.Control.Feedback>
			</>
		);
	}
}

//Labeled dropdown control - takes in label, field type, DOM control ID, options
class Dropdown extends React.Component {
	constructor(props) {
		super(props);
		this.label = props.label; //field label
		this.id = props.id; //control id
		this.options = props.options; //array of UNIQUE strings to use to build dropdown options
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		this.props.setter(event.target.value);
	}
	render() {
		return (
			<>
				<Form.Label className="subtleLabel">{this.label}</Form.Label>
				<Form.Control as="select" required controlId={this.id} onChange={this.handleChange}>
					<option key="null" value="">{""}</option>
					{this.options.map(entry => <option key={entry} value={entry}>{entry}</option>)}
				</Form.Control>
				<Form.Control.Feedback type="invalid">
					Please select a choice.
				</Form.Control.Feedback>
			</>
		);
	}
}

export default App;
