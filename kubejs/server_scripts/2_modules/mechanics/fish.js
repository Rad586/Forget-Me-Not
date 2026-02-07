const fish = [
    "minecraft:pufferfish", "minecraft:salmon", "minecraft:cod",
    "minecraft:tropical_fish", "fishofthieves:pondie",
    "fishofthieves:islehopper", "fishofthieves:ancientscale",
    "fishofthieves:plentifin", "fishofthieves:wildsplash",
    "fishofthieves:devilfish", "fishofthieves:battlegill",
    "fishofthieves:wrecker", "fishofthieves:stormfish",
    "fishofthieves:splashtail"
];

fish.forEach(key => 
	ItemEvents.rightClicked(key, e => {
		const {player, target: {block}} = e;
		if(!block || block.id != "minecraft:water") return;

		const {x, y, z} = block;
	
		const newFish = block.createEntity(key);
		newFish.addTag("released");
		newFish.setPosition(x+0.5, y+0.5, z+0.5)
		newFish.spawn();
		
		global.sound(player, "entity.player.swim", 0.3, 1, 0.14);
		player.potionEffects.add("luck", 8, 0);
		e.item.count--;
	
		player.unlockAdvancement("kubejs:tip/fish");
	})
)