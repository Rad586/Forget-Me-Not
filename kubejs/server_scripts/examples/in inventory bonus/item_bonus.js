// const itemEffects = {
// 	"minecraft:diamond": {
// 		"minecraft:speed": 0,
// 		"minecraft:jump_boost": 0
//     }
// };
// const INFINITE = Java.loadClass("java.lang.Integer").MAX_VALUE;

// Object.keys(itemEffects).forEach(item => {
//     function findLoop(player) {
//         player.server.scheduleInTicks(5, callback => {
//             if(!player || player.inventory.find(item) == -1) for(const id in effects) player.removeEffect(id);
//             else callback.reschedule();
//         })
//     };
//     const effects = itemEffects[item];
//     PlayerEvents.inventoryChanged(item, e => {
//         const player = e.player;
//         for(const id in effects) player.potionEffects.add(id, INFINITE, effects[id]);
//         findLoop(player);
//     });
//     PlayerEvents.loggedIn(e => {
//         const player = e.player;
//         if(player.inventory.find(item) != -1) findLoop(player);
//     })
// })


//// Variant, works for different items with same effect
// const itemEffects = {
//     "minecraft:diamond": {
//         "minecraft:speed": 0,
//         "minecraft:glowing": 0
//     },
//     "minecraft:coal": {
//         "minecraft:speed": 0, 
//         "minecraft:jump_boost": 0
//     }
// };
// const INFINITE = Java.loadClass("java.lang.Integer").MAX_VALUE;

// Object.keys(itemEffects).forEach(item => {
//     const effects = itemEffects[item];

//     function updateEffects(player) {
//         Object.keys(itemEffects).forEach(item2 => {
//             const effects2 = itemEffects[item2];
//             if(player.inventory.find(item2) != -1) {
//                 for(const id in effects2) player.potionEffects.add(id, INFINITE, effects2[id]);
//             }
//         })
//     };
//     function findLoop(player) {
//         player.server.scheduleInTicks(5, callback => {
//             if(player.inventory.find(item) == -1) {
//                 for(const id in effects) player.removeEffect(id);
//                 updateEffects(player);
//             }
//             else callback.reschedule();
//         })
//     };

//     PlayerEvents.inventoryChanged(item, e => {
//         const player = e.player;
//         for(const id in effects) player.potionEffects.add(id, INFINITE, effects[id]);
//         findLoop(player);
//     });
//     PlayerEvents.loggedIn(e => {
//         const player = e.player;
//         if(player.inventory.find(item) != -1) findLoop(player);
//     })
// })