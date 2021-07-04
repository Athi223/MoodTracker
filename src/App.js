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
			let current = snapshot.val()
			current[date.getDate()-1] = mood
			firebase.database().ref('users/' + authUser.uid).child(year_month).set(current)
			setModal(false)
		})
	}
	useEffect(() => {
		firebase.auth().onAuthStateChanged((user) => {
			setDate(new Date())
			if (user) {
				setAuthUser(user)
			}
			else {
				setAuthUser(false)
			}
		})
	}, [])

	useEffect(() => {
		if(authUser) {
			const year_month = date.getFullYear() + "_" + (date.getMonth() + 1)
			var dbRef = firebase.database().ref('users/' + authUser.uid)
			dbRef.child(year_month).on('value', snapshot => {
				if(snapshot.exists()) {
					let _month = snapshot.val()
					if(_month[date.getDate()-1].length < 4) {
						setModal(true)
					}
					setCalendar(createCalendar(date, _month))
				}
				else {
					let _month = []
					for(let i=0; i < new Date(date.getFullYear(), date.getMonth()+1, 0).getDate(); ++i) {
						_month.push('')
					}
					setModal(true)
					dbRef.set({ [year_month]: _month })
					setCalendar(createCalendar(date, _month))
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
						<NavbarBrand className="bg-date rounded px-5">
							{ date.toDateString().split(' ')[1] + ', ' + date.toDateString().split(' ')[3] }
						</NavbarBrand>
					</NavbarContent>
					<NavbarContent>
						<Button onClick={toggleDarkmode}>🌗</Button>
						<NavbarText>
							{authUser ? <Button color="danger" onClick={ () => {
									firebase.auth().signOut().catch(error => console.log(error))
								}
							}>Signout</Button> : 
								<Button color="success" onClick={
									() => {
										const provider = new firebase.auth.GoogleAuthProvider()
										firebase.auth().signInWithPopup(provider)
										.catch(error => console.log(error))
									}
								}><i className="fab fa-lg fa-google"></i> Signin</Button>
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
										<img className="w-full" src="https://i.ibb.co/q0V971r/mood-ask.png" alt="Mood Ask" />
									</div>
								</div>
								<div className="col-12 col-md-6">
									<div className="mx-5 box-shadow">
										<img className="w-full" src="https://i.ibb.co/M62WGxK/mood-display.png" alt="Mood Display" />
									</div>
								</div>
							</div>
						</div>
					}
				</ContentWrapper>
			</PageWrapper>
	)
}
