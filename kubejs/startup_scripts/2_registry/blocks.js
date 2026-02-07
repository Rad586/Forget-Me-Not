const caving_dim = [
	"diamond", "ruby", "sapphire", "emerald", 
	"alexandrite", "aquamarine", "opal", "turquoise", 
	"topaz", "zircon", "lapis_lazuli", "malachite",
	"moonstone", "schorl", "charoite", "rhodochrosite", 
	"chalcedony", "kunzite", "morganite", "citrine",
	"labradorite", "grossular", "kyanite", "agate", 
	"jade", "random", "stone"
];
StartupEvents.registry("block", e => {
	caving_dim.forEach(key => {
		e.create(`${key}_ore`)
			.material("heavy_metal")
			.hardness(1.0)
			.resistance(1.0)
			.requiresTool(true)
			.tagBlock("mineable/pickaxe")
	})
})
WorldgenEvents.add(e => {
	const {anchors} = e;
	caving_dim.forEach(key => {
		e.addOre(ore => {
			ore.biomes = "caving_dim:void";
			ore.addTarget("kubejs:stone_ore", `kubejs:${key}_ore`);
			ore.count([4, 8]).squared().triangleHeight(anchors.aboveBottom(16),anchors.absolute(256));
			ore.size(4);
			ore.worldgenLayer = "underground_ores";
		})
	})
})





const leaf_colors = [
	"pink", "blue", "purple", "white",
	"yellow", "orange", "red", "gray",
	"light_blue", "light_gray", "black",
	"cyan", "magenta", "lime", "brown",
	"green"
];
const leaf_types = [
	"oak", "birch", "dark_oak", "acacia",
	"jungle", "mangrove", "spruce"
];

const mp = "kubejs/assets/kubejs/models/block";
const generated = JsonIO.read(mp + "/leaf_pile.json") != null;
function checkThenWrite(path, content) {
	if (generated) return;
	JsonIO.write(path, content)
};
const model_leaf_pile_all = {
	"parent": "block/thin_block",
	"textures": {
		"particle": "#wool"
	},
	"elements": [
		{
			"from": [0, 0, 0],
			"to": [16, 1, 16],
			"faces": {
				"down": { "uv": [0, 0, 16, 16], "texture": "#wool", "tintindex": 0, "cullface": "down" },
				"up": { "uv": [0, 0, 16, 16], "texture": "#wool", "tintindex": 0 },
				"north": { "uv": [0, 15, 16, 16], "texture": "#wool", "tintindex": 0, "cullface": "north" },
				"south": { "uv": [0, 15, 16, 16], "texture": "#wool", "tintindex": 0, "cullface": "south" },
				"west": { "uv": [0, 15, 16, 16], "texture": "#wool", "tintindex": 0, "cullface": "west" },
				"east": { "uv": [0, 15, 16, 16], "texture": "#wool", "tintindex": 0, "cullface": "east" }
			}
		}
	]
};
const model_leaf_pile = (name) => JsonIO.of(
	{
		"parent": "kubejs:block/leaf_pile",
		"textures": {
			"wool": `minecraft:block/${name}_leaves`
		}
	}
);

StartupEvents.registry("block", e => {
	checkThenWrite(`${mp}/leaf_pile.json`, model_leaf_pile_all);

	leaf_types.forEach(leaf => {
		checkThenWrite(`${mp}/${leaf}_leaf_pile.json`, model_leaf_pile(leaf));

		e.create(`${leaf}_leaf_pile`, "carpet")
			.material("leaves")
			.grassSoundType()
			.noCollision()
			.defaultCutout()
			.opaque(false)
			.notSolid()
			.hardness(0)
			.resistance(0.1)
			.color(0, BlockTintFunction.FOLIAGE)
			.item(i => i.color(0, ItemTintFunction.BLOCK))

		
		leaf_colors.forEach(color => {
			const key = `${color}_${leaf}`;

			e.create(`${key}_leaves`, "basic")
				.material("leaves")
				.grassSoundType()
				.noCollision()
				.defaultCutout()
				.notSolid()
				.hardness(0.1)
				.resistance(0.1)
				.textureAll(`minecraft:block/${leaf}_leaves`)
				.color(0, Color[`${color.toUpperCase()}_DYE`])
				.item(i => i.color(0, ItemTintFunction.BLOCK))

			checkThenWrite(`${mp}/${key}_leaf_pile.json`, model_leaf_pile(leaf));
			/*block states for bushy look was done in client script*/

			e.create(`${key}_leaf_pile`, "carpet")
				.material("leaves")
				.grassSoundType()
				.noCollision()
				.defaultCutout()
				.opaque(false)
				.notSolid()
				.lightLevel(0.1) /* need this for correct shading */
				.hardness(0)
				.resistance(0.1)
				.color(0, Color[`${color.toUpperCase()}_DYE`])
				.item(i => i.color(0, ItemTintFunction.BLOCK))
		})
	})
})