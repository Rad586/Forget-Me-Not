function copper_nuker(e) {
    global.copper_variants1.forEach(wax => {
		global.copper_variants2.forEach(expose => {
		  global.copper_variants3.forEach(type => {
			global.copper_variants4.forEach(key => {
			  const id = `${wax}${expose}${type}copper${key}`;
			  if(["copper", "waxed_copper"].includes(id) || (type == "" && key != "")) return;
			  const data = global.copper_expose_map[expose][0];
			  const replaceing = (key == "" && expose != "weathered_") ?
			  	`minecraft:${data}_planks` :
				`minecraft:${data}${key}`;
			  e.addBlockLootModifier(id).replaceLoot(id, replaceing);
			})
		  })
		})
	  })

	e.addBlockLootModifier("minecraft:copper_block").replaceLoot("minecraft:copper_block", "minecraft:stripped_acacia_wood");
	e.addBlockLootModifier("minecraft:waxed_copper_block").replaceLoot("minecraft:waxed_copper_block", "minecraft:stripped_acacia_wood");
	e.addBlockLootModifier("minecraft:copper_ore").replaceLoot("minecraft:raw_copper", "minecraft:coal");
	e.addBlockLootModifier("minecraft:deepslate_copper_ore").replaceLoot("minecraft:raw_copper", "minecraft:coal");
	e.addBlockLootModifier("minecraft:raw_copper_block").replaceLoot("minecraft:raw_copper_block", "minecraft:coal_block");
}