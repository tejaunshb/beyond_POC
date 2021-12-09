import React, { useRef, useEffect, useCallback } from "react";
import { Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";
import { LIMITS } from "./constants";
import { selectShape, transformFanShape, moveShape } from "./state";

const boundBoxCallbackForFan = (oldBox, newBox) => {
	// limit resize
	if (
		newBox.width < LIMITS.FAN.MIN ||
		newBox.height < LIMITS.FAN.MIN ||
		newBox.width > LIMITS.FAN.MAX ||
		newBox.height > LIMITS.FAN.MAX
	) {
		return oldBox;
	}
	return newBox;
};

export function Fan({ id, isSelected, type, ...shapeProps }) {
	const shapeRef = useRef(null);
	const transformerRef = useRef();
	const [fanImage] = useImage('fan.png')
	useEffect(() => {
		if (isSelected) {
			transformerRef.current.nodes([shapeRef.current]);
			transformerRef.current.getLayer().batchDraw();
		}
	}, [isSelected]);

	const handleSelect = useCallback(
		(event) => {
			event.cancelBubble = true;

			selectShape(id);
		},
		[id]
	);

	const handleDrag = useCallback(
		(event) => {
			moveShape(id, event);
		},
		[id]
	);

	const handleTransform = useCallback(
		(event) => {
			transformFanShape(shapeRef.current, id, event);
		},
		[id]
	);

	return (
		<>
			<KonvaImage
				onClick={handleSelect}
				onTap={handleSelect}
				onDragStart={handleSelect}
				image={fanImage}
				ref={shapeRef}
				{...shapeProps}
				draggable
				onDragEnd={handleDrag}
				onTransformEnd={handleTransform}
			/>
			{isSelected && (
				<Transformer
					anchorSize={5}
					borderDash={[6, 2]}
					ref={transformerRef}
					boundBoxFunc={boundBoxCallbackForFan}
				/>
			)}
		</>

	);
}
