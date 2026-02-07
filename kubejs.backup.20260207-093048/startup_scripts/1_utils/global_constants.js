/* priority: 15 */

const { random, server } = Utils

global.randomUuid = UUID.randomUUID() /* Credit: Liopyu */

global.Block = Utils.getRegistry("minecraft:block")
global.Item = Utils.getRegistry("minecraft:item")
global.Enchantments = Utils.getRegistry("minecraft:enchantment")
const { Block, Enchantments } = global

function globalPack(from, pre, map) {
    Object.keys(map).forEach(key => global[key] = []);
    const map_entries = Object.entries(map);

    from.forEach(i => {
        const temp = pre(i);
        map_entries.forEach(
            ([key, func]) => {
                if (func(temp)) global[key].push(i)
            }
        )
    })
}

if(!global.Slabs) {
    globalPack(
        Block,
        i => i,
        {
            "Slabs": (i) => i instanceof SlabBlock,
            "Bushes": (i) => i instanceof BushBlock,
            "Crops": (i) => i instanceof CropBlock,
            "Cakes": (i) =>
                (i instanceof CakeBlock) ||
                (i instanceof CandleCakeBlock),
            "Emitters": (i) => i.defaultBlockState().getLightEmission() >= 10,
            "EdibleCrops": (i) => {
                const item = i.asItem();
                return (item && item.isEdible() && (i instanceof CropBlock))
            },
            "Chests": (i) => i instanceof AbstractChestBlock,
            "Leaves": (i) => i instanceof LeavesBlock
        }
    )

    globalPack(
        global.Item,
        i => i.item,
        {
            "Shovels": (i) => i instanceof ShovelItem,
            "Weapons": (i) =>
                (i instanceof SwordItem) ||
                (i instanceof AxeItem),
            "Armors": (i) => i instanceof ArmorItem
        }
    )
    global.Upgradeables = global.Weapons.concat(global.Armors)


    global.colored_blocks = {};
    let { colored_blocks } = global;
    let isExist = (str1, str2) => !Item.of(`${str1}:pink_${str2}`).isEmpty();
    let handler = (str, i) => str.slice(i).join("_");
    Block.getIds().forEach(key => {
        const { namespace, path } = key;
        if (path.includes("_bed")) return;
        const temp = path.split("_");

        const suffix = isExist(namespace, handler(temp, 1))
            ? handler(temp, 1) : handler(temp, 2);
        if (!isExist(namespace, suffix)) return;

        colored_blocks[key] = [namespace, suffix]
    })
}

if (server && !global.attackable_pets) {
    let overworld = server.overworld();

    globalPack(
        Utils.getRegistry("minecraft:entity_type"),
        i => i.create(overworld),
        {
            "attackable_pets": (i) => 
                (i instanceof OwnableEntity) &&
                i.isLiving() &&
                i.getAttribute("minecraft:generic.attack_damage") != null,
            "projectiles": (i) => i instanceof Projectile,
            "creepers": (i) => i instanceof Creeper,
            "spiders": (i) => i instanceof Spider,
            "fireballs": (i) => i instanceof Fireball,
            "zombies": (i) => i instanceof Zombie,
            "arrows": (i) => i instanceof AbstractArrow,
            "skeletons": (i) => i instanceof Skeleton
        }
    )
}