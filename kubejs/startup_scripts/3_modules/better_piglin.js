const piglin_skills = {
    "minecraft:golden_axe": () => { },
    "minecraft:golden_shovel": (entity, source) => {
        entity.potionEffects.add("slowness", 40, 2, true, false);
    }
};
function piglin_spawn(entity) {
    if (Math.random() < 0.65 && !entity.tags.contains("kjsed")) {
        entity.setMainHandItem(global.randomSelect(piglin_skills));
        entity.addTag("kjsed");
    }
};
function piglin_brute_spawn(entity) {
    if (entity.tags.contains("kjsed")) return;
    entity.setMainHandItem("minecraft:golden_sword");
    entity.addTag("kjsed")
};

function piglin_skill(context) {
    const { entity, targetEntity } = context;
    const skill = piglin_skills[entity.mainHandItem.id];
    if (skill) skill(targetEntity, entity);
}