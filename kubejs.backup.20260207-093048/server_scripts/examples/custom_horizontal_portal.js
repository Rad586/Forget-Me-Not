// const portalBlockMap = [ //blocks that can be used to build the portal
// 	"minecraft:copper_ore", "minecraft:coal_ore", "minecraft:iron_ore", "minecraft:gold_ore",
// 	"minecraft:redstone_ore", "minecraft:diamond_ore", "minecraft:lapis_ore", "minecraft:emerald_ore"
// ];
// function turnAround(rotation, [dx, dz], turns) { //turn clockwise or anticlockwise
//     const [a, b] = (turns % 2) ? [dz, dx] : [-dz, -dx];
//     return (rotation == "r") ? [a, b] : [-a, -b];
// };
// function getDir(block, level) {
// 	const {x, y, z} = block;
//     const directions = [ //four dirctions, no particular order
//         [1, 0], [0, 1],
//         [-1, 0], [0, -1]
//     ];
//     for(let dir of directions) {
//         let {id} = level.getBlock(x + dir[0], y, z + dir[1]);
//         if(portalBlockMap.includes(id)) return dir;
//     }
// };
// function checkPortal(block, level, key, dirStep, cornerBlock, maxDulplicates, maxPortalBlocks) {
// 	const {x, y, z} = block;
// 	let newX = x, newZ = z; //initialize initial block pos
// 	let rotation, corner1, corner2; //things to return
// 	const checkedBlocks = [key];

// 	for(let i = 1, turns = 0, dulplicates = 0; i <= maxPortalBlocks+4; i++) {
// 		if(dulplicates > maxDulplicates || turns > 4) return {status: null}; //fails if too many dulplicates or not a rectangular

// 		newX += dirStep[0]; //take a new step towards the dirction
// 		newZ += dirStep[1];
// 		if(newX == x && newZ == z) return {status: 1, corner1: corner1, corner2: corner2}; //if we get back to the first block

// 		let {id} = level.getBlock(newX, y, newZ);
// 		if(cornerBlock.includes(id)) {
// 			turns++;
// 			if(turns == 1) {
// 				corner1 = [newX, y, newZ];
// 				const testId = level.getBlock(newX + dirStep[1], y, newZ + dirStep[0]).id;
// 				if(portalBlockMap.includes(testId)) rotation = "r"; //prefer clockwise
// 			}
// 			else if(turns == 3) corner2 = [newX, y, newZ];
// 			dirStep = turnAround(rotation, dirStep, turns); //new dirction
// 		}
// 		else if(portalBlockMap.includes(id)) {
// 			if(checkedBlocks.includes(id)) dulplicates++;
// 			checkedBlocks.push(id);
// 		}
// 		else return {status: null}; //fails if found other blocks
// 	}
// };
// function portalAction(e, corner1, corner2) {
// 	let area = AABB.of(corner1[0], corner1[1], corner1[2], corner2[0], corner2[1], corner2[2]).deflate(1);
// 	const {server, player} = e;
// 	server.runCommandSilent(`fill ${area.minX} ${corner1[1]} ${area.minZ} ${area.maxX} ${corner1[1]} ${area.maxZ} minecraft:sand`);
// 	server.runCommandSilent(`playsound block.end_portal.spawn player @p ${player.x} ${player.y} ${player.z}`)
// };

// portalBlockMap.forEach(key => {
// 	BlockEvents.placed(key, e=> { //use extra argument
// 		const maxPortalBlocks = 16; //maximum blocks to build a portal, may affect performance
// 		const cornerBlock = ["minecraft:air", "minecraft:grass", "minecraft:water"];
// 		const maxDulplicates = 100; //how many times dulplicated block can be used in portal

// 		if(!e.player) return; //prevent some weird cases
// 		const {level, block} = e;
// 		let dirStep = getDir(block, level, cornerBlock);
// 		if(!dirStep) return; //gate keeping

// 		const checkResult = checkPortal(block, level, key, dirStep, cornerBlock, maxDulplicates, maxPortalBlocks); //store the result
// 		if(checkResult.status) portalAction(e, checkResult.corner1, checkResult.corner2); //do something
// 	})
// })