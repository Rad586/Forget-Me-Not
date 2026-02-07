const throwables = [
	"minecraft:beetroot_seeds", "minecraft:melon_seeds",
	"minecraft:nether_wart", "minecraft:pumpkin_seeds",
	"minecraft:wheat_seeds", "farmersdelight:tomato_seeds",
	"farmersdelight:cabbage_seeds", "farmersdelight:rice", 
	"minecraft:bone_meal"
];
throwables.forEach(id => {
	ItemEvents.rightClicked(id, e => {
		const { block } = e.target;
		if (!block || !(Block.get(block.id) instanceof CropBlock)) return;
		e.cancel()
	})
})