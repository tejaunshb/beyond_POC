import React from 'react'
import 'antd/dist/antd.css';

const { Table, Tag, Space } = require("antd");
const { Column, ColumnGroup } = Table;
export default function Modal(props) {

	var data = {}
	data['ov'] = JSON.parse(props.data);
	var overview = Object.keys(data.ov)
	var objArray = []

	for (const key in data.ov) {
		var obj = {}
		obj['room'] = key
		if (Object.hasOwnProperty.call(data.ov, key)) {
			const element = data.ov[key];
			for (const key1 in element) {

				if (Object.hasOwnProperty.call(element, key1)) {
					const elem = element[key1];

					if (key1 == "fan") {
						obj["fan"] = elem
					}
					if (key1 == "tv") {
						obj["tv"] = elem
					}
					if (key1 == "light") {
						obj["light"] = elem
					}

				}

			}
		}
		objArray.push(obj)
	}
	console.log("objA", objArray)
	return (
		<div>
			<h2>Overview</h2>
			<Table dataSource={objArray}>
				<Column title="Room" dataIndex="room" key="room" />
				<Column title="Fan" dataIndex="fan" key="lastName" />
				<Column title="Tv" dataIndex="tv" key="age" />
				<Column title="Light" dataIndex="light" key="address" />
			</Table>

		</div>
	)
}
