// const biomeList = { //you can get these ids from "/locate biome..."
// 	"red": {
// 		biomes: ["minecraft:desert"],
// 		inSpeed: 10, //increase 10% every 1s
// 		outSpeed: 10,
// 		action: player => {player.setSecondsOnFire(1)}
// 	},
// 	"LIGHT_BLUE_DYE": {
// 		biomes: ["minecraft:ice_spikes"],
// 		inSpeed: 10,
// 		outSpeed: 10,
// 		action: player => {player.ticksFrozen = Math.min(200, player.ticksFrozen + 80)}
// 	}
// }

// function renderBar(player, color, percent) {
//     player.paint({renderBar: {visible: false}}); //remove old bar
//     player.paint({ //add new bar
// 		renderBar: {
// 			type: "rectangle",
// 			color: color,
// 			alignY: "bottom",
// 			x: "$screenW/2 - 90",
// 			y: -25,
// 			w: 180 * percent,
// 			h: 1,
// 			visible: true
// 		}
// 	})
// };
// Object.keys(biomeList).forEach(color => {
// 	const data = biomeList[color];
// 	const {biomes, inSpeed, outSpeed} = data;

// 	biomes.forEach(biome => {
// 		const keyHandler1 = biome.split(":").join("_"); //format requirement for file name
// 		const keyHandler2 = `kubejs:${keyHandler1}`; //advancement id
	
// 		ServerEvents.highPriorityData(e => { //virtual datapack for setting up advancement
// 			e.addJson(`kubejs:advancements/${keyHandler1}.json`, { //you can squeeze this into one line, heres only for showcase
// 				"criteria": {
// 					"in_biome": {
// 						"conditions": {
// 						  "player": [
// 							{
// 							  "condition": "minecraft:entity_properties",
// 							  "entity": "this",
// 							  "predicate": {
// 								"location": {
// 								  "biome": biome //structure/dimension/biome
// 								}
// 							  }
// 							}
// 						  ]
// 						},
// 						"trigger": "minecraft:location"
// 					}
// 				},
// 				"requirements": [["in_biome"]]
// 			})
// 		});
	
// 		PlayerEvents.advancement(keyHandler2, e => { //minecraft check every second(20 ticks), so theres no need to limit it
// 			const {player, server} = e;
// 			const {persistentData: pData} = player;
// 			function updateBar(percent) {
// 				const oldValue = pData.temp || 0; //if !pData.temp, oldValue = 0;
// 				const newValue = Math.max(0, Math.min(oldValue + percent, 100)); //clamp the value
// 				if(oldValue != newValue) { //dont update if no change(100 → 100)
// 					pData.temp = newValue;
// 					renderBar(player, color, pData.temp/100);
// 				};
// 			};

// 			player.revokeAdvancement(keyHandler2); //so we can get it again
// 			server.scheduleInTicks(20, callback => {
// 				if(player.block.getBiomeId() == biome || pData.temp <= 0) return;
// 				pData.lastBiome = keyHandler2;
// 				updateBar(-outSpeed);
// 				callback.reschedule();
// 			});

// 			updateBar(inSpeed);
// 			if(pData.temp >= 100) data.action(player);
// 		})
// 	})
// });
// PlayerEvents.loggedIn(e => { //refresh status for once
// 	const {player} = e;
// 	const pData = player.persistentData;
// 	if(pData.temp > 0) player.unlockAdvancement(pData.lastBiome);
// })