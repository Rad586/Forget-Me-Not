// //Connecting objects, arrays and strings without duplicating keys
// const object1 = {"diamond": "1", "emerald": "2"};
// const array1 = ["gold_ingot", "iron_ingot"];
// const flat = Array.from(new Set([].concat(Object.keys(rc0), rc1, "coal")))

// //Move towards block
// ItemEvents.rightClicked(e=> {
//     const player = e.player; //avoid getting player many times
//     const block = player.rayTrace(4).block; //get block in reach
//     const dist = Math.sqrt(player.distanceToSqr(block.pos)); //get distance to block
//     const dir = player.lookAngle.scale(dist); //get move direction and set distance

//     player.setDeltaMovement(dir); //fast move to block
//     player.hurtMarked = true; //send packet since it"s player movement
// })

// // Save items on death
// const $ItemStack = Java.loadClass("net.minecraft.world.item.ItemStack");

// ItemEvents.rightClicked(e=>{
//     const pData = e.player.persistentData;
//     if(!pData.inventory) pData.inventory = [];

//     if(e.player.isCrouching()) {
//         pData.inventory.forEach(item => {
//             e.player.give($ItemStack.of(item))
//         });
//     }
//     else {
//         e.player.inventory.allItems.forEach(item =>{
//             if(item.id != "minecraft:air") pData.inventory.push(item.copy());
//         });
//         e.player.inventory.clear();
//     }
// })

// // "/back" implementation
// ServerEvents.commandRegistry(e => {
//     const {commands: Commands, arguments: Arguments} = e;
//     e.register(Commands.literal("back").executes(c => {
//         const {player} = c.source;
//         const deathInfo = player.nbt.LastDeathLocation;
//         player.teleportTo(deathInfo.dimension, deathInfo.pos[0], deathInfo.pos[1], deathInfo.pos[2], 0, 0);
//         return 1;
//     }))
// })