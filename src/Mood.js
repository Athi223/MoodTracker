import { Modal, ModalDialog, ModalContent, ModalTitle, Button } from "reacthalfmoon";

export default function Mood(props) {
	return (
		<Modal isOpen={props.modal}>
			<ModalDialog>
				<ModalContent>
					<ModalTitle>How was your day?</ModalTitle>
					<Button block={true} className="my-5" onClick={()=>{props.setMood('primary')}} color="primary">Happy</Button>
					<Button block={true} className="my-5" onClick={()=>{props.setMood('secondary')}} color="secondary">Neutral</Button>
					<Button block={true} className="my-5" onClick={()=>{props.setMood('success')}} color="success">Amazing</Button>
					<Button block={true} className="my-5" onClick={()=>{props.setMood('danger')}} color="danger">Sad</Button>
				</ModalContent>
			</ModalDialog>
		</Modal>
	)
}