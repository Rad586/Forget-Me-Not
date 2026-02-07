const toolHurtsExtra = {
	"minecraft:snow_golem":{tool: ShovelItem, damage: 2, sf: "item.hoe.till"},
	"minecraft:iron_golem":{tool: PickaxeItem, damage: 12, sf: "block.gilded_blackstone.break"},
	"minecraft:spider":{tool: ShearsItem, damage: 6, sf: "entity.sheep.shear"}, /* that"s evil */
	"minecraft:cave_spider":{tool: ShearsItem, damage: 6, sf: "entity.sheep.shear"},
	"minecraft:shulker":{tool: PickaxeItem, damage: 6, sf: "block.stone.break"},
	"minecraft:ghast":{tool: TridentItem, damage: 10, sf: "entity.puffer_fish.blow_out"},
	"minecraft:elder_guardian":{tool: TridentItem, damage: 10, sf: "entity.puffer_fish.blow_out"},
	"minecraft:guardian":{tool: TridentItem, damage: 10, sf: "entity.puffer_fish.blow_out"},
	"minecraft:drowned":{tool: TridentItem, damage: 8, sf: "entity.puffer_fish.blow_out"}
}

Object.keys(toolHurtsExtra).forEach(key => {
	const {tool, damage, sf} = toolHurtsExtra[key];

	EntityEvents.hurt(key, e => {
		const {source: {player}, entity} = e;
		if(!player || global.throttle(entity, 10, "eh1")) return;
	
		if(!(player.mainHandItem.item instanceof tool)) return;
		entity.attack(player, damage);
		if(sf) global.sound(entity, `${sf}`, 0.8, 1.2, 0.3);
	})
})