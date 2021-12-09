import React, { useRef, useEffect, useCallback } from "react";
import { Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";
import { LIMITS } from "./constants";
import { selectShape, transformTvShape, moveShape } from "./state";

const boundBoxCallbackForTv = (oldBox, newBox) => {
	// limit resize
	if (
		newBox.width < LIMITS.TV.MIN ||
		newBox.height < LIMITS.TV.MIN ||
		newBox.width > LIMITS.TV.MAX ||
		newBox.height > LIMITS.TV.MAX
	) {
		return oldBox;
	}
	return newBox;
};

export function TV({ id, isSelected, type, ...shapeProps }) {
	const shapeRef = useRef(null);
	const transformerRef = useRef();
	const [tvImage] = useImage('tv.png')
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
			transformTvShape(shapeRef.current, id, event);
		},
		[id]
	);

	return (
		<>
			<KonvaImage
				onClick={handleSelect}
				onTap={handleSelect}
				onDragStart={handleSelect}
				image={tvImage}
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
					boundBoxFunc={boundBoxCallbackForTv}
				/>
			)}
		</>

	);
}
