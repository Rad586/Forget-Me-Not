/* priority: 20 */

// ItemEvents.rightClicked("stick", e => {
// 	const {player, server, level} = e;
// 	const {potionEffects} = player;
// 	const dist = server.playerList.getSimulationDistance() * 16;
// 	if(!player.hasEffect("kubejs:timer")) {
// 		potionEffects.add("kubejs:timer", 2, 0, true, false);
// 		server.scheduleInTicks(1, callback => {
// 			if(!player.hasEffect("kubejs:timer")) return;
// 			player.potionEffects.add("kubejs:timer", 2, 0, true, false);
// 			const {block} = player.rayTrace(dist);
// 			if(block) {
// 				let {x, y, z} = block;
// 				global.particleBurstBlock(level, x, y, z, "end_rod", 1, 0.08, 0.4);
// 			}
// 			callback.reschedule();
// 		});
// 	}
// 	else {
// 		player.removeEffect("kubejs:timer");
// 		if(player.isCrouching()) {
// 			let {x, y, z} = player.rayTrace(dist).block;
// 			player.teleportTo(player.level.dimension, x+0.5, y+0.5, z+0.5, player.yaw, player.pitch);
// 			potionEffects.add("kubejs:invincible", 10, 0, true, false);
// 			level.spawnParticles("flash", true, player.x, player.y+player.eyeHeight/3*2, player.z, 0, 0, 0, 1, 0);

// 			server.scheduleInTicks(1, () => {
// 				global.sound(player, "entity.enderman.teleport", 1.2, 1.2);
// 				global.particleBurst(player, "dragon_breath", 24, 0.08);
// 				potionEffects.add("kubejs:soft_landing", 160, 0, true, false);
// 			})
// 		}
// 	}
// })

//排查satin api
//移除一些动物模组？
//unique_item 独特物品掉落修改（vsc搜索）
//移除末地相关：要塞X better stronghold，末影龙X enderdragon,true ending/，鞘翅X，潜影盒（流星），末影之眼，烈焰粉，龙蛋，音乐，开局提示，末地相关修复（kjs），相关配方（鞘翅，末影水晶，末影箱），末地相关改动（末影龙火球），龙息，龙蛋龙头，末影水晶相关修改（kjs），紫颂果，爆裂紫颂果



// ItemEvents.rightClicked(e => {
//     const { level, player } = e;
//     // player.setHealth(10)

//     if (!(e.item.item instanceof SwordItem)) return;

//     const skill = "smite";

//     const split = skill.split("_")
//     global.skills[skill](
//         level,
//         player,
//         global.skill_formulas[split[1] || split[0]],
//         player.getCurrentItemAttackStrengthDelay() * 2,
//         player.getAttribute("generic.attack_damage").getValue(),
//         1,
//         player.mainHandItem.id
//     )
// })


ItemEvents.rightClicked(e => {
    const { level, player } = e;


    // player.tell(global.mergedTrinkets(player, "face"))
    // global.particleWind(level, 3, player, "flame", -0.3, 0.3);
    // e.server.scheduleInTicks(1, () => {
    //     parry_effect(level, player, player.rayTrace(4).entity, 4, e)
    // })

})

EntityEvents.hurt("player", e => {
    const { player } = e;
    if(!e.source.actual) return;

    Utils.server.scheduleInTicks(1, () => {
        // player.tell(["damage: ", 20 - player.health])
        player.setHealth(100)
        player.setFoodLevel(100)
    })
})