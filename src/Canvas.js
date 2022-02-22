import React, { useRef, useCallback, useState, useEffect } from "react";
import { Layer, Stage, Line, Rect, Label } from "react-konva";
import useImage from "use-image";
import { Image as KonvaImage } from "react-konva";
import Polygon from "./Polygon";
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
import { Modal, Input, Select, Row, Col } from "antd";
const handleDragOver = (event) => event.preventDefault();
const AREA = "AREA"

const { Option } = Select
export function Canvas() {
	const shapes = useShapes((state) => Object.entries(state.shapes));
	const [imag, setImage] = useState('floorplan.jpg')
	const [background] = useImage(imag);
	const stageRef = useRef();
	const [area, setArea] = useState();
	const [showModal, setShowModal] = useState(false);
	const [points, setPoints] = useState([]);
	const [visible, setVisible] = React.useState(false);
	const [confirmLoading, setConfirmLoading] = React.useState(false);
	const [curMousePos, setCurMousePos] = useState([0, 0]);
	const [isMouseOverStartPoint, setIsMouseOverStartPoint] = useState(false);
	const [isFinished, setIsFinished] = useState(false);
	const [areaName, setAreaName] = useState('');
	const [color, setColor] = useState();
	const [selectedArea, setSelectedArea] = useState([]);
	const [areas, setAreas] = useState([])
	const [component, updateComponent] = useState(0);
	const forceUpdateComponent = React.useCallback(() => updateComponent({}), []);

	let flattenedPoints = points
		.concat(isFinished ? [] : curMousePos)
		.reduce((a, b) => a.concat(b), []);

	useEffect(() => {
		const localData = JSON.parse(localStorage.getItem('selectedArea'))
		console.log(localData)
		setAreas(localData)
	}, [])

	useEffect(() => {
		setImage('floorplan.jpg');
	}, [imag]);

	useEffect(() => {
		setPoints([]);
		setCurMousePos([0, 0])
		console.log("qwdqw", component)
		flattenedPoints = []
	}, [component])

	useEffect(() => {
		if (selectedArea.length) {
			let newUpdatedArea = []
			newUpdatedArea = JSON.parse(localStorage.getItem('selectedArea'))
			newUpdatedArea.push(selectedArea[0])
			localStorage.setItem("selectedArea", JSON.stringify(newUpdatedArea));
		}
		setAreas((previous) => [...previous, selectedArea]);
		updateComponent((previous) => previous + 1);
	}, [selectedArea])


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

	const handleOk = () => {
		setConfirmLoading(true);
		setTimeout(() => {
			setVisible(false);
			setConfirmLoading(false);
		}, 2000);
		setSelectedArea((prevArray) => [...prevArray, { areaName: areaName, color: color, flattenedPoints: flattenedPoints, points: points }])
		//handleReset();
	};
	const handleCancel = () => {
		console.log('Clicked cancel button');
		setVisible(false);
		setPoints((prevArray) => [...prevArray, []]);
	};
	const openModal = () => {
		setVisible(true);
	}
	const uploadImage = () => {
		setImage('2-bedroom-house-plans-indian-style-2.jpg');
	}
	const handleColorDropdown = (e) => {
		console.log(e)
		setColor(e)
	}
	const handleReset = () => {
		setPoints([])
		setSelectedArea([]);
	}
	const area1 = []
	// [{ "areaName": "BedRoom1", "color": "red", "flattenedPoints": [6.899993896484375, 9, 284.8999938964844, 9, 284.8999938964844, 201, 6.899993896484375, 199] },
	//{ "areaName": "Bedroom2", "color": "blue", "flattenedPoints": [5.899993896484375, 200.53334045410156, 240.89999389648438, 201.53334045410156, 238.89999389648438, 361.53334045410156, 9.899993896484375, 360.53334045410156] },
	//{ "areaName": "Bathroom", "color": "green", "flattenedPoints": [286.8999938964844, 10, 287.8999938964844, 199, 401.8999938964844, 199, 401.8999938964844, 7] },
	//{ "areaName": "Living Area", "color": "yellow", "flattenedPoints": [405.8999938964844, 120, 737.8999938964844, 123, 736.8999938964844, 353, 406.8999938964844, 358] }
	//]
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
				<button onClick={uploadImage}>Upload Image</button>
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

				{areas ? areas.map((item, index) =>
					<Layer key={index}>
						<Polygon
							key={index}
							handleMouseOverStartPoint={handleMouseOverStartPoint}
							handleMouseOutStartPoint={handleMouseOutStartPoint}
							handleDragStartPoint={handleDragStartPoint}
							handleDragMovePoint={handleDragMovePoint}
							handleDragOver={handleDragOver}
							isFinished={isFinished}
							points={item.points ? item.points : []}
							flattenedPoints={item.flattenedPoints}
							openModal={openModal}
							color={item.color}
						/>
					</Layer>
				)
					: null}
				<Layer>
					<Polygon
						handleMouseOverStartPoint={handleMouseOverStartPoint}
						handleMouseOutStartPoint={handleMouseOutStartPoint}
						handleDragStartPoint={handleDragStartPoint}
						handleDragMovePoint={handleDragMovePoint}
						handleDragOver={handleDragOver}
						isFinished={isFinished}
						points={points}
						flattenedPoints={flattenedPoints}
						openModal={openModal}
					/>
				</Layer>
			</Stage>
			<Modal
				title="Define Area"
				visible={visible}
				onOk={handleOk}
				confirmLoading={confirmLoading}
				onCancel={handleCancel}
			>
				<>
					<Row className="mb-5">
						<Col span={10}><Label>Add Name To Area</Label></Col>
						<Col span={10}><Input
							type="text"
							placeholder="Area Name"
							onChange={({ target: { value } }) => setAreaName(value)} />
						</Col>
					</Row>
					<Row className="mb-5">
						<Col span={10}><Label>Select Color</Label></Col>
						<Col span={10}>
							<Select style={{ width: 197 }} className="custom-select" placeholder="Select Color" onChange={handleColorDropdown}>
								<Option value="red">Red</Option>
								<Option value="blue">Blue</Option>
								<Option value="green">Green</Option>
								<Option value="yellow">Yellow</Option>
							</Select>
						</Col>

					</Row>
				</>
			</Modal>
			{
				showModal ? (<Modal1 data={localStorage.getItem("Overview")} />) : <p></p>
			}
		</main>
	);

}
