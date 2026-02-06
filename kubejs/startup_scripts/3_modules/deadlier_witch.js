const debuffs = [
    "kubejs:burning", "kubejs:soul_burning", "kubejs:vanishing_curse",
    "kubejs:binding_curse", "kubejs:pull", "kubejs:vulnerability", 
    "kubejs:purity", "kubejs:caustic_ooze", "kubejs:annoying_curse",
    "kubejs:metabolism_curse", "kubejs:stench_curse", "kubejs:anti_entropy_curse",
    "kubejs:beheading_curse", "kubejs:overflow_curse", "kubejs:outcast_curse",
    "kubejs:transfer_curse", "kubejs:midas_curse"
];
function deadlier_witch(entity) {
    if(Math.random() > 0.25 ||
        !entity.owner ||
        entity.owner.type != "minecraft:witch" ||
        entity.tags.contains("kjsed")
    ) return;
    const {nbt} = entity;
    if(nbt.Item.tag.Potion != "poison") return;

    nbt.Item.tag.Potion = global.randomSelect(debuffs);
    entity.nbt = nbt;
    entity.addTag("kjsed");
}