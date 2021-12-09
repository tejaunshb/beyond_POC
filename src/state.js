import { createStore } from "@halka/state";
import produce from "immer";
import clamp from "clamp";
import { nanoid } from "nanoid";
import { SHAPE_TYPES, DEFAULTS, LIMITS } from "./constants";

const APP_NAMESPACE = "__integrtr_diagrams__";
const AREA = "AREA"
const baseState = {
	selected: null,
	shapes: {},
	area: null
};

export const useShapes = createStore(() => {
	const initialState = JSON.parse(localStorage.getItem(APP_NAMESPACE));

	return { ...baseState, shapes: initialState ?? {} };
});
const setState = (fn) => useShapes.set(produce(fn));

export const saveDiagram = () => {
	const state = useShapes.get();
	console.log(state.shapes && Object.values(state.shapes));
	const array = Object.values(state.shapes);
	var obj = {}
	var areaArray = []
	for (let index = 0; index < array.length; index++) {
		const area = array[index].area;
		areaArray.push(area)
	}
	//console.log(areaArray)
	var data = []
	for (let index = 0; index < array.length; index++) {
		const area = array[index].area;
		var ty = []
		const counts = {};
		for (let j = 0; j < areaArray.length; j++) {
			const element = areaArray[j];

			if (element == area) {
				const type = array[j].type;
				ty.push(type)

			}

		}
		ty.forEach(function (x) {
			counts[x] = (counts[x] || 0) + 1;
			obj[area] = counts
		});

	}
	console.log(obj)
	localStorage.setItem("Overview", JSON.stringify(obj))
	localStorage.setItem(APP_NAMESPACE, JSON.stringify(state.shapes));

};

export const reset = () => {
	localStorage.removeItem(APP_NAMESPACE);
	localStorage.removeItem(AREA);
	localStorage.removeItem("Overview");
	useShapes.set(baseState);
};

export const createRectangle = ({ x, y, area }) => {
	setState((state) => {
		state.shapes[nanoid()] = {
			type: SHAPE_TYPES.RECT,
			width: DEFAULTS.RECT.WIDTH,
			height: DEFAULTS.RECT.HEIGHT,
			fill: DEFAULTS.RECT.FILL,
			stroke: DEFAULTS.RECT.STROKE,
			rotation: DEFAULTS.RECT.ROTATION,
			x,
			y,
			area
		};
	});
};
export const createFan = ({ x, y, area }) => {
	setState((state) => {
		state.shapes[nanoid()] = {
			//id: nanoid(),
			type: SHAPE_TYPES.FAN,
			width: DEFAULTS.FAN.WIDTH,
			height: DEFAULTS.FAN.HEIGHT,
			fill: DEFAULTS.FAN.FILL,
			stroke: DEFAULTS.FAN.STROKE,
			rotation: DEFAULTS.FAN.ROTATION,
			x,
			y,
			area

		};
	});
	//setState((state) => {
	//	state.shapes[localStorage.getItem(AREA)] = {
	//		id: nanoid(),
	//		type: SHAPE_TYPES.FAN,
	//		width: DEFAULTS.FAN.WIDTH,
	//		height: DEFAULTS.FAN.HEIGHT,
	//		fill: DEFAULTS.FAN.FILL,
	//		stroke: DEFAULTS.FAN.STROKE,
	//		rotation: DEFAULTS.FAN.ROTATION,
	//		x,
	//		y,
	//		area

	//	};
	//});
};
export const createTv = ({ x, y, area }) => {
	setState((state) => {
		state.shapes[nanoid()] = {
			//id: nanoid(),
			type: SHAPE_TYPES.TV,
			width: DEFAULTS.TV.WIDTH,
			height: DEFAULTS.TV.HEIGHT,
			fill: DEFAULTS.TV.FILL,
			stroke: DEFAULTS.TV.STROKE,
			rotation: DEFAULTS.TV.ROTATION,
			x,
			y,
			area
		};
	});
	//setState((state) => {
	//	state.shapes[localStorage.getItem(AREA)] = {
	//		id: nanoid(),
	//		type: SHAPE_TYPES.TV,
	//		width: DEFAULTS.TV.WIDTH,
	//		height: DEFAULTS.TV.HEIGHT,
	//		fill: DEFAULTS.TV.FILL,
	//		stroke: DEFAULTS.TV.STROKE,
	//		rotation: DEFAULTS.TV.ROTATION,
	//		x,
	//		y,
	//		area

	//	};
	//});
};
export const createLight = ({ x, y, area }) => {
	setState((state) => {
		state.shapes[nanoid()] = {
			//id: nanoid(),
			type: SHAPE_TYPES.LIGHT,
			width: DEFAULTS.LIGHT.WIDTH,
			height: DEFAULTS.LIGHT.HEIGHT,
			fill: DEFAULTS.LIGHT.FILL,
			stroke: DEFAULTS.LIGHT.STROKE,
			rotation: DEFAULTS.LIGHT.ROTATION,
			x,
			y,
			area
		};
	});
	//setState((state) => {
	//	state.shapes[localStorage.getItem(AREA)] = {
	//		id: nanoid(),
	//		type: SHAPE_TYPES.LIGHT,
	//		width: DEFAULTS.LIGHT.WIDTH,
	//		height: DEFAULTS.LIGHT.HEIGHT,
	//		fill: DEFAULTS.LIGHT.FILL,
	//		stroke: DEFAULTS.LIGHT.STROKE,
	//		rotation: DEFAULTS.LIGHT.ROTATION,
	//		x,
	//		y,
	//		area

	//	};
	//});
};
export const createCircle = ({ x, y, area }) => {
	setState((state) => {
		state.shapes[nanoid()] = {
			type: SHAPE_TYPES.CIRCLE,
			radius: DEFAULTS.CIRCLE.RADIUS,
			fill: DEFAULTS.CIRCLE.FILL,
			stroke: DEFAULTS.CIRCLE.STROKE,
			x,
			y,
			area
		};
	});
};

export const selectShape = (id) => {
	setState((state) => {
		state.selected = id;
	});
};
export const selectArea = (area) => {
	setState((state) => {
		state.area = area;
	});
	localStorage.setItem(AREA, area);
};

export const clearSelection = () => {
	setState((state) => {
		state.selected = null;
	});
};

export const moveShape = (id, event) => {
	setState((state) => {
		const shape = state.shapes[id];

		if (shape) {
			shape.x = event.target.x();
			shape.y = event.target.y();
		}
	});
};

export const updateAttribute = (attr, value) => {
	setState((state) => {
		const shape = state.shapes[state.selected];

		if (shape) {
			shape[attr] = value;
		}
	});
};

export const transformRectangleShape = (node, id, event) => {
	// transformer is changing scale of the node
	// and NOT its width or height
	// but in the store we have only width and height
	// to match the data better we will reset scale on transform end
	const scaleX = node.scaleX();
	const scaleY = node.scaleY();

	// we will reset the scale back
	node.scaleX(1);
	node.scaleY(1);

	setState((state) => {
		const shape = state.shapes[id];

		if (shape) {
			shape.x = node.x();
			shape.y = node.y();

			shape.rotation = node.rotation();

			shape.width = clamp(
				// increase the width in order of the scale
				node.width() * scaleX,
				// should not be less than the minimum width
				LIMITS.RECT.MIN,
				// should not be more than the maximum width
				LIMITS.RECT.MAX
			);
			shape.height = clamp(
				node.height() * scaleY,
				LIMITS.RECT.MIN,
				LIMITS.RECT.MAX
			);
		}
	});
};
export const transformFanShape = (node, id, event) => {
	// transformer is changing scale of the node
	// and NOT its width or height
	// but in the store we have only width and height
	// to match the data better we will reset scale on transform end
	const scaleX = node.scaleX();
	const scaleY = node.scaleY();

	// we will reset the scale back
	node.scaleX(1);
	node.scaleY(1);

	setState((state) => {
		const shape = state.shapes[id];

		if (shape) {
			shape.x = node.x();
			shape.y = node.y();

			shape.rotation = node.rotation();

			shape.width = clamp(
				// increase the width in order of the scale
				node.width() * scaleX,
				// should not be less than the minimum width
				LIMITS.FAN.MIN,
				// should not be more than the maximum width
				LIMITS.FAN.MAX
			);
			shape.height = clamp(
				node.height() * scaleY,
				LIMITS.FAN.MIN,
				LIMITS.FAN.MAX
			);
		}
	});
};
export const transformTvShape = (node, id, event) => {
	// transformer is changing scale of the node
	// and NOT its width or height
	// but in the store we have only width and height
	// to match the data better we will reset scale on transform end
	const scaleX = node.scaleX();
	const scaleY = node.scaleY();

	// we will reset the scale back
	node.scaleX(1);
	node.scaleY(1);

	setState((state) => {
		const shape = state.shapes[id];

		if (shape) {
			shape.x = node.x();
			shape.y = node.y();

			shape.rotation = node.rotation();

			shape.width = clamp(
				// increase the width in order of the scale
				node.width() * scaleX,
				// should not be less than the minimum width
				LIMITS.TV.MIN,
				// should not be more than the maximum width
				LIMITS.TV.MAX
			);
			shape.height = clamp(
				node.height() * scaleY,
				LIMITS.TV.MIN,
				LIMITS.TV.MAX
			);
		}
	});
};
export const transformLightShape = (node, id, event) => {
	// transformer is changing scale of the node
	// and NOT its width or height
	// but in the store we have only width and height
	// to match the data better we will reset scale on transform end
	const scaleX = node.scaleX();
	const scaleY = node.scaleY();

	// we will reset the scale back
	node.scaleX(1);
	node.scaleY(1);

	setState((state) => {
		const shape = state.shapes[id];

		if (shape) {
			shape.x = node.x();
			shape.y = node.y();

			shape.rotation = node.rotation();

			shape.width = clamp(
				// increase the width in order of the scale
				node.width() * scaleX,
				// should not be less than the minimum width
				LIMITS.LIGHT.MIN,
				// should not be more than the maximum width
				LIMITS.LIGHT.MAX
			);
			shape.height = clamp(
				node.height() * scaleY,
				LIMITS.LIGHT.MIN,
				LIMITS.LIGHT.MAX
			);
		}
	});
};
export const transformCircleShape = (node, id, event) => {
	// transformer is changing scale of the node
	// and NOT its width or height
	// but in the store we have only width and height
	// to match the data better we will reset scale on transform end
	const scaleX = node.scaleX();

	// we will reset the scale back
	node.scaleX(1);
	node.scaleY(1);

	setState((state) => {
		const shape = state.shapes[id];

		if (shape) {
			shape.x = node.x();
			shape.y = node.y();

			shape.radius = clamp(
				(node.width() * scaleX) / 2,
				LIMITS.CIRCLE.MIN,
				LIMITS.CIRCLE.MAX
			);
		}
	});
};
