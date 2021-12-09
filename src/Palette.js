import React from "react";

import { DRAG_DATA_KEY, SHAPE_TYPES } from "./constants";

const handleDragStart = (event) => {
	const type = event.target.dataset.shape;

	if (type) {
		// x,y coordinates of the mouse pointer relative to the position of the padding edge of the target node
		const offsetX = event.nativeEvent.offsetX;
		const offsetY = event.nativeEvent.offsetY;

		// dimensions of the node on the browser
		const clientWidth = event.target.clientWidth;
		const clientHeight = event.target.clientHeight;

		const dragPayload = JSON.stringify({
			type,
			offsetX,
			offsetY,
			clientWidth,
			clientHeight,
		});

		event.nativeEvent.dataTransfer.setData(DRAG_DATA_KEY, dragPayload);
	}
};
const handleDrop = (e) => {
	// Note: preventDefault is on nativeEvent
	e.nativeEvent.preventDefault()
	if (!e) return;
	// Note: files are under nativeEvent.dataTransfer
	const files = e.nativeEvent.dataTransfer.files;
	const fileList = Array.from(files);
	const images = fileList.map((image) => ({
		imageName: image.name,
		imageFile: image
	}));
	console.log(images);
};
const stopReload = (e) => {
	e.preventDefault();
	e.stopPropagation();
};
export function Palette() {
	return (
		<aside className="palette">
			<h2>Objects</h2>
			{/*<div
				className="shape rectangle"
				data-shape={SHAPE_TYPES.RECT}
				draggable
				onDragStart={handleDragStart}
			/>
			<div
				className="shape circle"
				data-shape={SHAPE_TYPES.CIRCLE}
				draggable
				onDragStart={handleDragStart}
			/>*/}
			<div className="shape fan1"
				data-shape={SHAPE_TYPES.FAN}
				draggable
				onDragStart={handleDragStart}
				onDrop={(e) => handleDrop(e)}
				onDragOver={(e) => stopReload(e)}
			>
				<img style={{ verticalAlign: 'middle' }} className="fan" draggable="true" src={'fan.png'} />
				<div style={{ verticalAlign: 'middle', display: 'inline' }}>
					Fan
				</div>
			</div>
			<div className="shape tv"
				data-shape={SHAPE_TYPES.TV}
				draggable
				onDragStart={handleDragStart}
				onDrop={(e) => handleDrop(e)}
				onDragOver={(e) => stopReload(e)}
			>
				<img style={{ verticalAlign: 'middle' }} className="fan tv" draggable="true" src={'tv.png'} />
				<div style={{ verticalAlign: 'middle', display: 'inline' }}>
					TV
				</div>
			</div>
			<div className="shape light"
				data-shape={SHAPE_TYPES.LIGHT}
				draggable
				onDragStart={handleDragStart}
				onDrop={(e) => handleDrop(e)}
				onDragOver={(e) => stopReload(e)}
			>
				<img style={{ verticalAlign: 'middle' }} className="fan light" draggable="true" src={'light.png'} />
				<div style={{ verticalAlign: 'middle', display: 'inline' }}>
					Light
				</div>
			</div>
		</aside >
	);
}
