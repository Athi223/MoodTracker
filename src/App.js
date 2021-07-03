import './App.css'
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database";
import { useState, useEffect } from "react"
import Calendar from './Calendar'
import Mood from './Mood';
import { PageWrapper, Navbar, ContentWrapper, NavbarContent, NavbarBrand, NavbarText, Button, toggleDarkmode } from "reacthalfmoon";
import { firebaseConfig } from './credentials'

firebase.initializeApp(firebaseConfig)

function createCalendar(date, month) {
	let empty = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
	while(empty--) {
		month.unshift(null)
	}
	let n = month.length
	n = n + parseInt(7 / 2, 10)
	n = n - (n % 7)
	empty = n - month.length
	while(empty--) {
		month.push(null)
	}
	return month
}

export default function App() {
	const [ authUser, setAuthUser ] = useState(null)
	const [ authWasListened, setAuthWasListened ] = useState(false)
	const [ date, setDate ] = useState(null)
	const [ calendar, setCalendar ] = useState([])
	const [ modal, setModal ] = useState(false)
	const setMood = function(mood) {
		const year_month = date.getFullYear() + "_" + (date.getMonth() + 1)
		firebase.database().ref('users/' + authUser.uid).child(year_month).get().then(snapshot => {
			let current = snapshot.val()
			let today = current[date.getDate()-1].split(' ')
			today[1] = mood
			current[date.getDate()-1] = today.join(' ')
			firebase.database().ref('users/' + authUser.uid).child(year_month).set(current)
			setModal(false)
		})
	}
	useEffect(() => {
		firebase.auth().onAuthStateChanged((user) => {
			setDate(new Date())
			if (user) {
				setAuthUser(user)
				setAuthWasListened(true)
			}
			else {
				setAuthUser(null)
				setAuthWasListened(true)
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
					let _month = Array()
					for(let i=0; i < new Date(date.getFullYear(), date.getMonth()+1, 0).getDate(); ++i) {
						_month.push((i+1) + ' ')
					}
					setModal(true)
					dbRef.set({ [year_month]: _month })
					setCalendar(createCalendar(date, _month))
				}
			})
		}
	}, [ date, authUser ])
	
	return(
		authWasListened ? (
			<PageWrapper withNavbar>
				<Navbar>
					<NavbarContent>
						<NavbarBrand>Welcome, {authUser ? authUser.displayName : 'Guest'} 🎉</NavbarBrand>
					</NavbarContent>
					<NavbarContent className="mx-auto">
						<NavbarBrand className="bg-date rounded p-5">
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
								}>Signin with Google</Button>
							}
						</NavbarText>
					</NavbarContent>
				</Navbar>
				<ContentWrapper>
					{authUser ?
						<div className="container">							
							{ calendar.length ? 
							<div className="row">
								<div className="col-10 py-5">
									<Calendar month={calendar} />
								</div>
								<div className="col-2 p-5">
									<div className="d-flex flex-column text-center justify-content-around px-15 h-full border">
										<h4 className="bg-primary p-10 rounded">Happy</h4>
										<h4 className="bg-secondary p-10 rounded">Neutral</h4>
										<h4 className="bg-success p-10 rounded">Amazing</h4>
										<h4 className="bg-danger p-10 rounded">Sad</h4>
									</div>
								</div>
							</div> : null }
							<Mood modal={modal} setMood={setMood} />
						</div> :
						<div className="container text-center">
							<h2>Please SignIn to use Mood Tracker!</h2>
						</div>
					}
				</ContentWrapper>
			</PageWrapper>
			
		) : null
	)
}
