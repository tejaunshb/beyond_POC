import React, { useRef, useCallback, useState } from "react";
import { Layer, Stage, Line, Rect } from "react-konva";
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
import Modal1 from "./Modal";
import { Modal, Input } from "antd";
const handleDragOver = (event) => event.preventDefault();
const AREA = "AREA"

export function Canvas() {
	const shapes = useShapes((state) => Object.entries(state.shapes));
	const [background] = useImage('2-bedroom-house-plans-indian-style-1.jpg');
	const stageRef = useRef();
	const [area, setArea] = useState();
	const [showModal, setShowModal] = useState(false);
	const [points, setPoints] = useState([]);
	const [visible, setVisible] = React.useState(false);
	const [confirmLoading, setConfirmLoading] = React.useState(false);
	const [modalText, setModalText] = React.useState('Select Or Add Area');
	const [curMousePos, setCurMousePos] = useState([0, 0]);
	const [isMouseOverStartPoint, setIsMouseOverStartPoint] = useState(false);
	const [isFinished, setIsFinished] = useState(false);
	const [areaName, setAreaName] = useState('');
	//	const [endPoints, setEndPoints] = useState([]);

	const getMousePos = stage => {
		return [stage.getPointerPosition().x, stage.getPointerPosition().y];
	};
	const handleClick = event => {
		const stage = event.target.getStage();
		const mousePos = getMousePos(stage);

		if (isFinished) {
			return;
		}
		if (isMouseOverStartPoint && points.length >= 3) {
			setIsFinished(true);
		} else {
			setPoints([...points, mousePos]);
		}
	};
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
	const handleMouseMove = event => {
		const stage = event.target.getStage();
		const mousePos = getMousePos(stage);
		setCurMousePos(mousePos);
	};
	const handleMouseOverStartPoint = event => {
		if (isFinished || points.length < 3) return;
		event.target.scale({ x: 2, y: 2 });
		setIsMouseOverStartPoint(true);
	};
	const handleMouseOutStartPoint = event => {
		event.target.scale({ x: 1, y: 1 });
		setIsMouseOverStartPoint(false);
		setVisible(false);
	};
	const handleDragStartPoint = event => {
		console.log("start", event);
	};
	const handleDragMovePoint = event => {
		const index = event.target.index - 1;
		console.log(event.target);
		const pos = [event.target.attrs.x, event.target.attrs.y];
		console.log("move", event);
		console.log(pos);
		setPoints([...points.slice(0, index), pos, ...points.slice(index + 1)]);
	};
	const handleDragOutPoint = event => {
		const pos = [event.target.attrs.x, event.target.attrs.y];
		console.log("end", pos);
	};
	const flattenedPoints = points
		.concat(isFinished ? [] : curMousePos)
		.reduce((a, b) => a.concat(b), []);

	const handleOk = () => {
		setModalText('Select Or Add Name To Area');
		setConfirmLoading(true);
		setTimeout(() => {
			setVisible(false);
			setConfirmLoading(false);
		}, 2000);
		console.log({ areaName: areaName, flattenedPoints: flattenedPoints })
	};

	const handleCancel = () => {
		console.log('Clicked cancel button');
		setVisible(false);
		setPoints((prevArray) => [...prevArray, []]);
	};
	const openModal = () => {
		setVisible(true);
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
				onMouseDown={handleClick}
				// onMouseUp={handleMouseUp}
				onMouseMove={handleMouseMove}
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
				<Layer>
					<Line
						points={flattenedPoints}
						stroke="#0EA5E9"
						strokeWidth={1}
						closed={isFinished}
						fill="#0EA5E9"
						opacity={0.5}
						onClick={openModal}
					/>
					{points.map((point, index) => {
						const width = 6;
						const x = point[0] - width / 2;
						const y = point[1] - width / 2;
						const startPointAttr =
							index === 0
								? {
									hitStrokeWidth: 12,
									onMouseOver: handleMouseOverStartPoint,
									onMouseOut: handleMouseOutStartPoint
								}
								: null;
						return (
							<Rect
								key={index}
								x={x}
								y={y}
								width={width}
								height={width}
								fill="blue"
								opacity={0.5}
								stroke="black"
								strokeWidth={1}
								onDragStart={handleDragStartPoint}
								onDragMove={handleDragMovePoint}
								onDragEnd={handleDragOutPoint}
								draggable
								{...startPointAttr}
							/>
						);
					})}
				</Layer>
			</Stage>
			<Modal
				title="Set Area"
				visible={visible}
				onOk={handleOk}
				confirmLoading={confirmLoading}
				onCancel={handleCancel}
			>
				<>
					<p>{modalText}</p>
					<Input
						type="text"
						placeholder="Area Name"
						onChange={({ target: { value } }) => setAreaName(value)} />
				</>
			</Modal>
			{
				showModal ? (<Modal1 data={localStorage.getItem("Overview")} />) : <p></p>
			}
		</main>
	);

}
