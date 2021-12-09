export const SHAPE_TYPES = {
	RECT: "rect",
	CIRCLE: "circle",
	FAN: "fan",
	TV: "tv",
	LIGHT: "light"
};

export const DEFAULTS = {
	RECT: {
		STROKE: "#000000",
		FILL: "#ffffff",
		WIDTH: 150,
		HEIGHT: 100,
		ROTATION: 0,
	},
	FAN: {
		//	STROKE: "#000000",
		//FILL: "#ffffff",
		WIDTH: 75,
		HEIGHT: 50,
		ROTATION: 0,
	},
	TV: {
		//	STROKE: "#000000",
		//FILL: "#ffffff",
		WIDTH: 75,
		HEIGHT: 50,
		ROTATION: 0,
	},
	LIGHT: {
		//	STROKE: "#000000",
		//FILL: "#ffffff",
		WIDTH: 75,
		HEIGHT: 50,
		ROTATION: 0,
	},
	CIRCLE: {
		STROKE: "#000000",
		FILL: "#ffffff",
		RADIUS: 50,
	},
};

export const LIMITS = {
	RECT: {
		MAX: 1000,
		MIN: 10,
	},
	CIRCLE: {
		MAX: 500,
		MIN: 5,
	},
	FAN: {
		MAX: 500,
		MIN: 5,
	},
	TV: {
		MAX: 500,
		MIN: 5,
	},
	LIGHT: {
		MAX: 500,
		MIN: 5,
	},
};

export const DRAG_DATA_KEY = "__drag_data_payload__";
