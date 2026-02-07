// const structureList = [ //you can get these ids from "/locate structure..."
//     "minecraft:desert_pyramid", "minecraft:jungle_pyramid"
// ];
// structureList.forEach(key => {
//     const keyHandler1 = key.split(":").join("_");
//     const keyHandler2 = `kubejs:${keyHandler1}`;

//     ServerEvents.highPriorityData(e => { //virtual datapack for setting up advancement
//         e.addJson(`kubejs:advancements/${keyHandler1}.json`, { //you can squeeze this into one line, heres only for showcase
//             "criteria": {
//               "in_structure": {
//                 "conditions": {
//                   "player": [
//                     {
//                       "condition": "minecraft:entity_properties",
//                       "entity": "this",
//                       "predicate": {
//                         "location": {
//                           "structure": key
//                         }
//                       }
//                     }
//                   ]
//                 },
//                 "trigger": "minecraft:location"
//               }
//             },
//             "requirements": [["in_structure"]]
//         })
//     });
    
//     PlayerEvents.advancement(keyHandler2, e => { //minecraft check every second(20 ticks), so theres no need to limit it
//         e.server.runCommandSilent(`advancement revoke ${e.player.username} only ${keyHandler2}`);
//         //if(e.player.age % 40) return; //if you want to execute it less often
//         e.player.potionEffects.add("minecraft:mining_fatigue", 20, 2, true, false);
//     })
// })