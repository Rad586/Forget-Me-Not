ServerEvents.tags("block", e => {
  const colors = [
    "red", "orange", "yellow", "green", 
    "lime", "cyan", "light_blue", "blue",
    "purple", "pink", "magenta", "brown",
    "white", "light_gray", "gray", "black"
  ];
  const log_types = [
    "oak", "dark_oak", "spruce", "birch",
    "jungle", "mangrove", "acacia"
  ];
  colors.forEach(color => {
    log_types.forEach(type => {
      const key = `${color}_${type}`;
      e.add("minecraft:leaves", `kubejs:${key}_leaves`);
      // e.add("minecraft:leaves", `minecraft:${type}_leaves`);
      e.add("minecraft:leaves", `kubejs:${type}_leaves_pile`);
      e.add("minecraft:leaves", `kubejs:${key}_leaf_pile`);
    })
  })
})

ServerEvents.tags("block", e => {
  global.copper_variants1.forEach(wax => {
    global.copper_variants2.forEach(expose => {
      global.copper_variants3.forEach(type => {
        global.copper_variants4.forEach(key => {
          const id = `${wax}${expose}${type}copper${key}`;
          if(
            id.includes("weathered") ||
            ["copper", "waxed_copper"].includes(id) ||
            (type == "" && key != "")
          ) return;
          e.remove(`minecraft:mineable/pickaxe`, id);
          e.add(`minecraft:mineable/axe`, id);
        })
      })
    })
  });

  e.remove(`minecraft:mineable/pickaxe`, "minecraft:copper_block");
  e.add(`minecraft:mineable/axe`, "minecraft:copper_block");

  e.remove(`minecraft:mineable/pickaxe`, "minecraft:waxed_copper_block");
  e.add(`minecraft:mineable/axe`, "minecraft:waxed_copper_block");
})

ServerEvents.tags("item", e => {
    const caving_dim = [
      "diamond", "ruby", "sapphire", "emerald", 
      "alexandrite", "aquamarine", "opal", "turquoise", 
      "topaz", "zircon", "lapis_lazuli", "malachite",
      "moonstone", "schorl", "charoite", "rhodochrosite", 
      "chalcedony", "kunzite", "morganite", "citrine",
      "labradorite", "grossular", "kyanite", "agate", 
      "jade", "random", "stone"
    ];
    caving_dim.forEach(key => {
        e.add("kubejs:caving_dim", `kubejs:${key}`)
    })

  // global.Upgradeables = [];
  // global.Items.forEach(i => {
  //   if (i.maxDamage) global.Upgradeables.push(i)
  // });
  // global.Upgradeables.forEach(key => e.add("kubejs:upgradeables", key))
})