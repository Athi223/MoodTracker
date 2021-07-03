import parse from 'html-react-parser'

export default function Calendar(props) {
	let calendar = ''
	props.month.forEach((day, index) => {
		if(index%7 === 0) {
			calendar += '<tr>'
		}
		calendar += (day === null ? '<td></td>' : '<td class="bg-' + day.split(' ')[1] + '"><h2>' + day.split(' ')[0] + '</h2></td>')
		if(index%7 === 6) {
			calendar += '</tr>'
		}
	})
	return(
		<div className="table-responsive">
			<table className="table table-stripped table-bordered" id="calendar">
				<thead>
					<tr>
						<th style={{width: "14.285%"}}>Sunday</th>
						<th style={{width: "14.285%"}}>Monday</th>
						<th style={{width: "14.285%"}}>Tuesday</th>
						<th style={{width: "14.285%"}}>Wednesday</th>
						<th style={{width: "14.285%"}}>Thursday</th>
						<th style={{width: "14.285%"}}>Friday</th>
						<th style={{width: "14.285%"}}>Saturday</th>
					</tr>
				</thead>
				<tbody>{parse(calendar)}</tbody>
			</table>
		</div>
	)    
}