import React, { useRef, useCallback, useState } from "react";
import { Layer, Stage } from "react-konva";
import useImage from "use-image";
import { Image as KonvaImage } from "react-konva";
import {
	useShapes,
	clearSelection,
	createCircle,
	createTv,
	createLight,
	createFan,
	createRectangle,
	saveDiagram,
	reset,
	selectArea
} from "./state";
import { DRAG_DATA_KEY, SHAPE_TYPES } from "./constants";
import { Shape } from "./Shape";
import Modal from "./Modal";

const handleDragOver = (event) => event.preventDefault();
const AREA = "AREA"

export function Canvas() {
	const shapes = useShapes((state) => Object.entries(state.shapes));
	const [background] = useImage('2-bedroom-house-plans-indian-style-1.jpg');
	const stageRef = useRef();
	const [area, setArea] = useState();
	const [showModal, setShowModal] = useState(false);

	const handleDrop = useCallback((event) => {
		const draggedData = event.nativeEvent.dataTransfer.getData(DRAG_DATA_KEY);

		if (draggedData) {
			const { offsetX, offsetY, type, clientHeight, clientWidth } = JSON.parse(
				draggedData
			);

			stageRef.current.setPointersPositions(event);

			const coords = stageRef.current.getPointerPosition();

			if (type === SHAPE_TYPES.RECT) {
				// rectangle x, y is at the top,left corner
				createRectangle({
					x: coords.x - offsetX,
					y: coords.y - offsetY,
					area: localStorage.getItem(AREA)
				});
			} else if (type === SHAPE_TYPES.CIRCLE) {
				// circle x, y is at the center of the circle
				createCircle({
					x: coords.x - (offsetX - clientWidth / 2),
					y: coords.y - (offsetY - clientHeight / 2),
					area: localStorage.getItem(AREA)
				});
			}
			else if (type === SHAPE_TYPES.FAN) {
				// circle x, y is at the center of the circle
				createFan({
					x: coords.x - offsetX,
					y: coords.y - offsetY,
					area: localStorage.getItem(AREA)
				});
			}
			else if (type === SHAPE_TYPES.TV) {
				// circle x, y is at the center of the circle
				createTv({
					x: coords.x - offsetX,
					y: coords.y - offsetY,
					area: localStorage.getItem(AREA)
				});
			}
			else if (type === SHAPE_TYPES.LIGHT) {
				// circle x, y is at the center of the circle
				createLight({
					x: coords.x - offsetX,
					y: coords.y - offsetY,
					area: localStorage.getItem(AREA)
				});
			}
		}
	}, []);
	const handleSelect = (e) => {
		setArea(e)
		selectArea(e)
	}
	const showOverview = () => {

		setShowModal(true)
	}
	return (
		<main className="canvas" onDrop={handleDrop} onDragOver={handleDragOver}>
			<div className="custom-select">
				<select className="custom-select" onChange={e => handleSelect(e.currentTarget.value)}>
					<option>---Select Area---</option>
					<option key="balcony">Balcony</option>
					<option key="bedroom1">Bedroom1</option>
					<option key="bedroom2">Bedroom2</option>
					<option key="toilet">Toilet</option>
					<option key="staircase">Staircase</option>
				</select>
			</div>
			{/*<p>{area}</p>*/}
			<div className="buttons">

				<button onClick={saveDiagram}>Save</button>
				<button onClick={showOverview}>Overview</button>
				<button onClick={reset}>Reset</button>

			</div>
			<Stage
				ref={stageRef}
				width={window.innerWidth - 400}
				height={window.innerHeight}
				onClick={clearSelection}
			>
				<Layer>
					<KonvaImage
						image={background}
						height={500}
						width={850}
						id="backgroundImage"
					/>
					{shapes.map(([key, shape]) => (
						<Shape key={key} shape={{ ...shape, id: key }} />
					))}
				</Layer>
			</Stage>
			{
				showModal ? (<Modal data={localStorage.getItem("Overview")} />) : <p></p>
			}
		</main>
	);
}
