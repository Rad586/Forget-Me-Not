global.spiders = [
    "minecraft:spider", "minecraft:cave_spider"
];
function spider_spit(context) {
    if(Math.random() > 0.06 || context.entity.level.isClientSide() ) return;
    const {block} = context.targetEntity;
    if(block.blockState.isAir()) block.set("sihywtcamd:messy_cobweb");
}