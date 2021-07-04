import { Modal, ModalDialog, ModalContent, ModalTitle } from "reacthalfmoon";

export default function Mood(props) {
	return (
		<Modal isOpen={props.modal}>
			<ModalDialog>
				<ModalContent>
					<ModalTitle>How was your day?</ModalTitle>
					<button className="btn btn-block amazing my-5" onClick={()=>{props.setMood('amazing')}}>Amazing</button>
					<button className="btn btn-block happy my-5" onClick={()=>{props.setMood('happy')}}>Happy</button>
					<button className="btn btn-block neutral my-5" onClick={()=>{props.setMood('neutral')}}>Neutral</button>
					<button className="btn btn-block sad my-5" onClick={()=>{props.setMood('sad')}}>Sad</button>
					<button className="btn btn-block angry my-5" onClick={()=>{props.setMood('angry')}}>Angry</button>
					<button className="btn btn-block lonely my-5" onClick={()=>{props.setMood('lonely')}}>Lonely</button>
				</ModalContent>
			</ModalDialog>
		</Modal>
	)
}