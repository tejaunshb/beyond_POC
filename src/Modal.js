import React from 'react'

export default function Modal(props) {
	//var d = Object.values(JSON.parse(props.data))
	//console.log(d)
	var data = {}
	data['ov'] = JSON.parse(props.data);
	var overview = Object.keys(data.ov)
	console.log(overview)
	console.log(Object.values(data.ov))
	return (
		<div>
			<p>Overview</p>
			<table>
				<thead>
					<th>Area</th>
					<th>Objects</th>
					<th>qty</th>
				</thead>
				<tbody>

					{
						//overview.map(item => {
						//	return (
						//		<tr>
						//			{/*<td>{item.Bedroom1.fan}</td>*/}
						//		</tr>
						//	)
						//})
					}
				</tbody>
			</table>
		</div>
	)
}
