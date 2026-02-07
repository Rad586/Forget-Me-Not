function ender_dragon_death(entity, actual) {
    if(!actual || actual.type != "minecraft:ender_dragon") return;
    if(["PEACEFUL", "EASY"].includes(entity.level.getDifficulty().toString())) return;

    const pData = actual.persistentData;
    if(pData.kills == null) pData.kills = 1;
    kills++;
    if(kills % 3 == 0) actual.heal(actual.maxHealth / 2);

    entity.persistentData.death_count += 5;
}