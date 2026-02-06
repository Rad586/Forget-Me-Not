// //new implementation! startup script
// // const INFINITE = Java.loadClass("java.lang.Integer").MAX_VALUE;
// const bonuses = {
//     set1: {
//         armors: ["minecraft:leather_helmet", "minecraft:leather_boots"],
//         bonus: ["speed", 0]
//     },
//     set2: {
//         armors: ["minecraft:diamond_leggings"],
//         bonus: ["glowing", 0, true]
//     },
//     set3: {
//         armors: ["minecraft:diamond_chestplate"],
//         bonus: ["regeneration", 1, true]
//     }
// };
// function armor_set_bonus(context) {
//     const {entity, previousStack, currentStack} = context;
//     const {potionEffects, armorSlots} = entity;

//     const now_set = armorSlots.toArray().map(i => i.id);
//     const last_set = now_set.map(i => (i == currentStack.id ? previousStack.id : i));
//     function check_array(array1, array2) {return array1.every(a => array2.filter(i => i != "minecraft:air").includes(a))};

//     Object.keys(bonuses).forEach(set => {
//         const data = bonuses[set];
//         const {armors, bonus} = data;
        
//         if(!check_array(armors, last_set)) entity.removeEffect(bonus[0]);
//         if(check_array(armors, now_set)) {
//             potionEffects.add(bonus[0], INFINITE, bonus[1] || 0, true, bonus[2] || false);
//         }
//     })
// }
// EntityJSEvents.modifyEntity(e => e.modify("minecraft:player", modifyBuilder => modifyBuilder.onEquipItem(context => armor_set_bonus(context))))

// const passiveEffects = {
// 	"minecraft:leather_": [
// 		"minecraft:speed",
// 		"minecraft:jump_boost"
// 	],
// 	"minecraft:iron_": [
// 		"minecraft:speed"
// 	]
// }

// function checkArmorSet(e, prefix) {return !e.armorSlots.some(a => !a.id.startsWith(prefix))};
// // function checkArmorSet(entity, prefix) {	//Ignores elytra if it"s leather set
// // 	return !entity.armorSlots.some(armor => 
// // 		prefix == "minecraft:leather_" 
// // 			? !armor.id.includes("elytra") && !armor.id.startsWith(prefix) 
// // 			: !armor.id.startsWith(prefix)
// // 	)
// // }
// //
// // function checkFullArmorWithExslusion(entity, prefix, exclusion) {	//You can specify a thing that the check ignores
// // 	return !entity.armorSlots.some(a => !a.id.includes(exclusion) && !a.id.startsWith(prefix));
// // }
// const armorIds = Object.keys(passiveEffects).reduce((a, b) => a.concat(["helmet", "chestplate", "leggings", "boots"].map(suffix => b+suffix)), []);
// const INFINITE = Java.loadClass("java.lang.Integer").MAX_VALUE;

// armorIds.forEach(id => {
// 	PlayerEvents.inventoryChanged(id, e => {
// 		const player = e.player;
// 		const prefix = player.getHeadArmorItem().id.split("helmet")[0];
// 		const pData = player.persistentData;
// 		if(!pData.armor) return;
// 		const lastArmorSet = passiveEffects[pData.armor];
// 		const nowArmorSet = passiveEffects[prefix];
	
// 		if(!checkArmorSet(player, prefix)) lastArmorSet.forEach(effect => player.removeEffect(effect));
// 		else if(prefix != "minecraft:air"){
// 			pData.armor = prefix;
// 			nowArmorSet.forEach(effect => player.potionEffects.add(effect, INFINITE, 0))
// 		}
// 	});
// 	ItemEvents.dropped(id, e => {
// 		const player = e.player;
// 		const pData = player.persistentData;
// 		if(!pData.armor) return;
// 		const lastArmorSet = passiveEffects[pData.armor];
// 		player.server.scheduleInTicks(0, ()=>{
// 			if(!checkArmorSet(player, pData.armor)) lastArmorSet.forEach(effect => player.removeEffect(effect));
// 		})
// 	})
// })