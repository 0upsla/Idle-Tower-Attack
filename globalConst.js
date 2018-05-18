
//TODO joinpath together
//TODO create a pool for planes
//global const
let SIZE = 600;
let NBCELLPATH = 8;
let NBPATH = 1;
let CELLSIZE=SIZE/(NBCELLPATH*NBPATH);
let FRAMERATE = 30;
let BASESPEED = CELLSIZE/2500;
let mainLoopStart = Date.now();
let mainLoopDiff = FRAMERATE; 
//orientation const
let NORTH = 0;
let EAST = 1;
let SOUTH = 2;
let WEST = 3;
//direction const
let LEFT = -1;
let STRAIGHT = 0;
let RIGHT = 1;
//global arrays
let pathModels = {
	straight : [],
	right : [],
	left : []
};
let planes = [];
let paths = [];
let bullets = [];

