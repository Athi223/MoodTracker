export default function Progress(props) {
	// const happy = props.progress.reduce((happy, elem) => happy + (elem === 'primary') , 0)
	// const neutral = props.progress.reduce((neutral, elem) => neutral + (elem === 'secondary') , 0)
	// const amazing = props.progress.reduce((amazing, elem) => amazing + (elem === 'success') , 0)
	// const sad = props.progress.reduce((sad, elem) => sad + (elem === 'danger') , 0)
	let progresses = props.progress.reduce((progresses, elem) => {
		if(elem === 'amazing') {
			progresses[0] += 1
		}
		if(elem === 'happy') {
			progresses[1] += 1
		}
		if(elem === 'neutral') {
			progresses[2] += 1
		}
		if(elem === 'sad') {
			progresses[3] += 1
		}
		if(elem === 'angry') {
			progresses[4] += 1
		}
		if(elem === 'lonely') {
			progresses[5] += 1
		}
		return progresses
	} , [ 0, 0, 0, 0, 0, 0 ])
	const total = props.progress.reduce((total, elem) => total + (typeof elem === 'string') , 0)
	progresses = progresses.map(value => (value/total*100).toFixed(0)+"%")
	console.log(progresses)
	return(
		<div className="d-flex flex-column text-center justify-content-around border p-5 h-full">
			<h5><b><u>Monthly Stats</u></b></h5>
			<div className="progress-group">
				<span className="progress-group-label">😁</span>
				<div className="progress">
					<div className="progress-bar progress-bar-animated amazing" role="progressbar" style={{width: progresses[0]}}></div>
				</div>
				<span className="progress-group-label">{progresses[0]}</span>
			</div>
			<div className="progress-group">
				<span className="progress-group-label">😐</span>
				<div className="progress">
					<div className="progress-bar progress-bar-animated happy" role="progressbar" style={{width: progresses[1]}}></div>
				</div>
				<span className="progress-group-label">{progresses[1]}</span>
			</div>
			<div className="progress-group">
				<span className="progress-group-label">🤩</span>
				<div className="progress">
					<div className="progress-bar progress-bar-animated neutral" role="progressbar" style={{width: progresses[2]}}></div>
				</div>
				<span className="progress-group-label">{progresses[2]}</span>
			</div>
			<div className="progress-group">
				<span className="progress-group-label">😔</span>
				<div className="progress">
					<div className="progress-bar progress-bar-animated sad" role="progressbar" style={{width: progresses[3]}}></div>
				</div>
				<span className="progress-group-label">{progresses[3]}</span>
			</div>
			<div className="progress-group">
				<span className="progress-group-label">😠</span>
				<div className="progress">
					<div className="progress-bar progress-bar-animated angry" role="progressbar" style={{width: progresses[4]}}></div>
				</div>
				<span className="progress-group-label">{progresses[4]}</span>
			</div>
			<div className="progress-group">
				<span className="progress-group-label">😟</span>
				<div className="progress">
					<div className="progress-bar progress-bar-animated lonely" role="progressbar" style={{width: progresses[5]}}></div>
				</div>
				<span className="progress-group-label">{progresses[5]}</span>
			</div>
		</div>
	)
}