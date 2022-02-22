import React, { useState } from "react";
import { Line, Text, Rect } from "react-konva";

const Polygon = (props) => {


	return (
		<>
			<Line
				points={props.flattenedPoints}
				stroke="#0EA5E9"
				strokeWidth={2}
				closed={props.isFinished ? true : true}
				fill={props.color ? props.color : "#0EA5E9"}
				opacity={0.3}
				onClick={props.openModal}
			/>
			{props.points.map((point, index) => {
				const width = 6;
				const x = point[0] - width / 2;
				const y = point[1] - width / 2;
				const startPointAttr =
					index === 0
						? {
							hitStrokeWidth: 12,
							onMouseOver: props.handleMouseOverStartPoint,
							onMouseOut: props.handleMouseOutStartPoint
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
						onDragStart={props.handleDragStartPoint}
						onDragMove={props.handleDragMovePoint}
						onDragEnd={props.handleDragOutPoint}
						draggable
						{...startPointAttr}
					/>
				);
			})}
		</>
	);
};

export default Polygon