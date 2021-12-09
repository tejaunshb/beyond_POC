import React, { useRef, useEffect, useCallback } from "react";
import { Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";
import { LIMITS } from "./constants";
import { selectShape, transformLightShape, moveShape } from "./state";

const boundBoxCallbackForLight = (oldBox, newBox) => {
	// limit resize
	if (
		newBox.width < LIMITS.LIGHT.MIN ||
		newBox.height < LIMITS.LIGHT.MIN ||
		newBox.width > LIMITS.LIGHT.MAX ||
		newBox.height > LIMITS.LIGHT.MAX
	) {
		return oldBox;
	}
	return newBox;
};

export function Light({ id, isSelected, type, ...shapeProps }) {
	const shapeRef = useRef(null);
	const transformerRef = useRef();
	const [lightImage] = useImage('light.png')
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
			transformLightShape(shapeRef.current, id, event);
		},
		[id]
	);

	return (
		<>
			<KonvaImage
				onClick={handleSelect}
				onTap={handleSelect}
				onDragStart={handleSelect}
				image={lightImage}
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
					boundBoxFunc={boundBoxCallbackForLight}
				/>
			)}
		</>

	);
}
