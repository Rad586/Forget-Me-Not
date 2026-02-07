global.rewards = {
    "minecraft:piglin_brute": {
        rewards: [
            {flag:"bloodsword", item:"kubejs:greatsword_of_blood"},
            {flag:"crown", item:"kubejs:crown_of_scarlet"}
        ],
        chance: 0.1
    },

    "minecraft:stray": {
        rewards: [
            {flag:"snowwhisper", item:"kubejs:snowwhisper"}
        ],
        chance: 0.03
    },
    "rottencreatures:frostbitten": {
        rewards: [
            {flag:"snowwhisper", item:"kubejs:snowwhisper"}
        ],
        chance: 0.00625
    },

    "minecraft:husk": {
        rewards: [
            {flag:"inferno", item:"kubejs:inferno"}
        ],
        chance: 0.0125
    },
    "rottencreatures:burned": {
        rewards: [
            {flag:"inferno", item:"kubejs:inferno"},
            {flag:"fire_extinguisher", item:"kubejs:fire_extinguisher"}
        ],
        chance: 0.0125
    },

    "minecraft:wither_skeleton": {
        rewards: [
            {flag:"demon", item:"kubejs:heart_of_demon"}
        ],
        chance: 0.2
    },
    "minecraft:wither": {
        rewards: [
            {flag:"demon", item:"kubejs:heart_of_demon"}
        ],
        chance: 1.0
    }
};
function unique_item(entity, source, key) {
    const player = source.getPlayer();
    if(!player) return;
    const entityRewards = rewards[key];
    if(entity.level.isClientSide() || Math.random() > entityRewards.chance) return;

    const {x, y, z, eyeHeight, block} = entity

    entityRewards.rewards.some(reward => {
        const {flag, item} = reward;
        if(stages.has(flag)) return;

        stages.add(flag);
        block.popItem(item);

        player.statusMessage = Text.translate(`dialogue.fmn.unique_item`);
        声声entity.playSound("simplyswords:dark_sword_breaks",  0.4, Math.random()*0.1 + 1.9);
        entity.level.spawnParticles("bosses_of_mass_destruction:obsidilith_burst", true, x, y+eyeHeight/3*2, z);
    })
}