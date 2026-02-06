const zombie_throwables = [
    "minecraft:slime_ball", "minecraft:cobweb", "minecraft:bone_meal",
    "minecraft:flint"
]
const Dyes = DyeColor.values().map(i => `minecraft:${i}_dye`);
Dyes.forEach(key => zombie_throwables.push(key));

function zombie_thrower(entity) {
    if(Math.random() > 0.03 ||
        entity.tags.contains("kjsed") ||
        !entity.mainHandItem.isEmpty()
    ) return;
    entity.setMainHandItem(global.randomSelect(zombie_throwables));
    entity.addTag("kjsed")
}