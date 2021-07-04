import './App.css'
import loader from './loader.svg'
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"
import { useState, useEffect } from "react"
import Calendar from './Calendar'
import Mood from './Mood'
import Progress from './Progress'
import { PageWrapper, Navbar, ContentWrapper, NavbarContent, NavbarBrand, NavbarText, Button, toggleDarkmode } from "reacthalfmoon";
import { firebaseConfig } from './credentials'

firebase.initializeApp(firebaseConfig)

function createCalendar(date, month) {
	let empty = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
	while(empty--) {
		month.unshift(null)
	}
	let n = month.length + parseInt(7 / 2, 10)
	n = n - (n % 7)
	empty = n - month.length
	while(empty--) {
		month.push(null)
	}
	return month
}

export default function App() {
	const [ authUser, setAuthUser ] = useState(null)
	const [ date, setDate ] = useState(null)
	const [ calendar, setCalendar ] = useState([])
	const [ modal, setModal ] = useState(false)
	const setMood = function(mood) {
		const year_month = date.getFullYear() + "_" + (date.getMonth() + 1)
		firebase.database().ref('users/' + authUser.uid).child(year_month).get().then(snapshot => {
			let current = snapshot.val()							// Get data of current month
			current[date.getDate()-1] = mood						// Update mood for current day
			firebase.database().ref('users/' + authUser.uid).child(year_month).set(current)
			setModal(false)
		})
	}
	const toggle = function(direction) {
		let temp_date = new Date(date)								// Make a Copy of 'date' state
		temp_date.setMonth(date.getMonth() + (direction ? +1 : -1))	// Add/Subtract a month from it
		setDate(temp_date)											// Set the new date
	}
	useEffect(() => {
		firebase.auth().onAuthStateChanged((user) => {
			setDate(new Date())										// Set default date as today
			setAuthUser((user ? user : false))						// Set user if logged in else false
		})
	}, [])

	useEffect(() => {
		if(authUser) {
			const year_month = date.getFullYear() + "_" + (date.getMonth() + 1)		// YYYY_M format
			var dbRef = firebase.database().ref('users/' + authUser.uid)			// User's doc in db
			dbRef.child(year_month).on('value', snapshot => {
				if(snapshot.exists()) {								// If data exists, work on it
					let _month = snapshot.val()
					if(date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()) {
						setModal(_month[date.getDate()-1] === '')	// Ask mood if empty mood for today
					}
					setCalendar(createCalendar(date, _month))		// Set the actual calendar
				}
				else {												// If data doesn't exist, create it
					let _month = []
					for(let i=0; i < new Date(date.getFullYear(), date.getMonth()+1, 0).getDate(); ++i) {
						_month.push('')								// Generate each day with empty mood
					}
					if(date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()) {
						setModal(true)		// Ask mood if creating new data for current month (1st day)
					}
					dbRef.update({ [year_month]: _month })			// Store created month data in db
					setCalendar(createCalendar(date, _month))		// Set the actual calendar
				}
			})
		}
	}, [ date, authUser ])
	
	return(
		authUser === null ? <div className="App">
				<img src={loader} className="App-loader" alt="loader" />
			</div> :
			<PageWrapper withNavbar>
				<Navbar>
					<NavbarContent>
						<NavbarBrand>Hi, {authUser ? authUser.displayName.split(' ')[0] : 'Guest'} 🎉</NavbarBrand>
					</NavbarContent>
					<NavbarContent className="mx-auto">
						<button onClick={
							() => toggle(false)
						} className="btn btn-link px-5"><i className="fas fa-lg fa-chevron-circle-left"></i></button>
						<NavbarBrand className="bg-date rounded m-0 px-5">
							{ date.toDateString().split(' ')[1] + ', ' + date.toDateString().split(' ')[3].substring(2,4) }
						</NavbarBrand>
						<button onClick={
							() => toggle(true)
						} className="btn btn-link px-5" disabled={
							date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()
						}><i className="fas fa-lg fa-chevron-circle-right"></i></button>
					</NavbarContent>
					<NavbarContent>
						<Button onClick={toggleDarkmode}>🌗</Button>
						<NavbarText>
							{authUser ? <Button color="danger" onClick={
									() => {
										firebase.auth().signOut().catch(error => console.log(error))
									}
								}><i className="fas fa-sign-out-alt"></i></Button> : 
								<Button color="success" onClick={
									() => {
										const provider = new firebase.auth.GoogleAuthProvider()
										firebase.auth().signInWithPopup(provider)
										.catch(error => console.log(error))
									}
								}><i className="fab fa-lg fa-google"></i></Button>
							}
						</NavbarText>
					</NavbarContent>
				</Navbar>
				<ContentWrapper className="d-lg-flex justify-content-center align-items-center">
					{authUser ?
						<div className="container">							
							{ calendar.length ? 
							<div className="row">
								<div className="col-12 col-lg-2 p-5">
									<div className="text-center px-15 border" style={{ height: "60%"}}>
										<h5 className="amazing p-5 rounded">Amazing 🤩</h5>
										<h5 className="happy p-5 rounded">Happy 😁</h5>
										<h5 className="neutral p-5 rounded">Neutral 😐</h5>
										<h5 className="sad p-5 rounded">Sad 😔</h5>
										<h5 className="angry p-5 rounded">Angry 😠</h5>
										<h5 className="lonely p-5 rounded">Lonely 😟</h5>
									</div>
									<div className="pt-5" style={{ height: "40%"}}>
										<Progress progress={calendar} />
									</div>
								</div>
								<div className="col-12 col-lg-10 py-5">
									<Calendar month={calendar} />
								</div>
							</div> : null }
							<Mood modal={modal} setMood={setMood} />
						</div> :
						<div className="container text-center">
							<ul className="font-size-16 border rounded p-10 mx-auto">
								<li>Track your daily mood</li>
								<li>Visualize how your week/month went by</li>
								<li>Monthly stats for an effortless overview</li>
								<li>Available in Light/Dark modes</li>
							</ul>
							<h2>Please SignIn to use Mood Tracker!</h2>
							<div className="row">
								<div className="col-12 col-md-6">
									<div className="mx-5 box-shadow">
										<img className="w-full" src="https://i.ibb.co/kH2D4y3/mood-ask.png" alt="Mood Ask" />
									</div>
								</div>
								<div className="col-12 col-md-6">
									<div className="mx-5 box-shadow">
										<img className="w-full" src="https://i.ibb.co/yNBfxXK/mood-display.png" alt="Mood Display" />
									</div>
								</div>
							</div>
						</div>
					}
				</ContentWrapper>
			</PageWrapper>
	)
}
