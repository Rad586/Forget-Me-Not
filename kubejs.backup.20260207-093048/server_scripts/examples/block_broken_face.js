// BlockEvents.broken(e => {
//     const {hitX, hitY, hitZ} = e.player.rayTrace(3.5);
//     const {x, y, z} = e.block;

//     const deltas = [
//         {axis: "x", delta: hitX - (x+0.5), faces: ["west", "east"] },
//         {axis: "y", delta: hitY - (y+0.5), faces: ["down", "up"] },
//         {axis: "z", delta: hitZ - (z+0.5), faces: ["north", "south"] }
//     ];
//     const {delta, faces} = deltas.reduce((max, curr) => 
//         Math.abs(curr.delta) > Math.abs(max.delta) ? curr : max
//     );
//     const hitFace = delta < 0 ? faces[0] : faces[1];

//     e.server.tell(hitFace);
// })