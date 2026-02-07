// //Credit: Liopyu (https://discord.com/channels/303440391124942858/1246451798743449640/1246465482761048165)
// const keep_slots = [
// 	103, 102, 101, 100, //armor slots
// 	-106, //offhand
// 	0, 1, 2, 3, 4, 5, 6, 7, 8 //hotbar
// ];
// function loadAndUpdate(player, content) {
//     player.mergeNbt({Inventory: content});
// 	player.inventoryMenu.broadcastFullState()
// }

// EntityEvents.death("minecraft:player", e => {
// 	const {player} = e;
// 	player.inventory.allItems.forEach(item => {
// 		if(item.hasEnchantment('vanishing_curse', 1)) item.setCount(0)
// 	});

// 	const keep = [], clear = [];
// 	player.nbt.Inventory.forEach(i => 
//         keep_slots.includes(i.Slot) ? keep.push(i) : clear.push(i)
//     );

// 	player.persistentData.lastItems = keep;
//     loadAndUpdate(player, clear)

// 	// //or a death chest
// 	// const {up} = player.block;
// 	// up.set('chest');
// 	// up.mergeEntityData({Items: player.persistentData.lastItems});
// })

// PlayerEvents.respawned(e => loadAndUpdate(e.player, e.player.persistentData.lastItems))