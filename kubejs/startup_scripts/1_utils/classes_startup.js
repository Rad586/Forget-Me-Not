/* priority: 20 */

global.class_map = {

    "Blocks": "net.minecraft.world.level.block.Blocks",

    "LeavesBlock": "net.minecraft.world.level.block.LeavesBlock",
    "SlabBlock": "net.minecraft.world.level.block.SlabBlock",
    "BushBlock": "net.minecraft.world.level.block.BushBlock",
    "CropBlock": "net.minecraft.world.level.block.CropBlock",
    "CakeBlock": "net.minecraft.world.level.block.CakeBlock",
    "CandleCakeBlock": "net.minecraft.world.level.block.CandleCakeBlock",
    "CampfireBlock": "net.minecraft.world.level.block.CampfireBlock",
    "DispenserBlock": "net.minecraft.world.level.block.DispenserBlock",
    "AbstractChestBlock": "net.minecraft.world.level.block.AbstractChestBlock",

    "Properties": "net.minecraft.world.level.block.state.BlockBehaviour$Properties",

    "PickaxeItem": "net.minecraft.world.item.PickaxeItem",
    "ShovelItem": "net.minecraft.world.item.ShovelItem",
    "SwordItem": "net.minecraft.world.item.SwordItem",
    "AxeItem": "net.minecraft.world.item.AxeItem",
    "ArmorItem": "net.minecraft.world.item.ArmorItem",
    "ShieldItem": "net.minecraft.world.item.ShieldItem",
    "ShearsItem": "net.minecraft.world.item.ShearsItem",
    "TridentItem": "net.minecraft.world.item.TridentItem",
    "HoeItem": "net.minecraft.world.item.HoeItem",
    "BoneMealItem": "net.minecraft.world.item.BoneMealItem",

    "DyeItem": "net.minecraft.world.item.DyeItem",
    "DyeColor": "net.minecraft.world.item.DyeColor",

    "UseOnContext": "net.minecraft.world.item.context.UseOnContext",

    "$ProjectileUtil": "net.minecraft.world.entity.projectile.ProjectileUtil",
    "Projectile": "net.minecraft.world.entity.projectile.Projectile",
    "Fireball": "net.minecraft.world.entity.projectile.Fireball",
    "AbstractArrow": "net.minecraft.world.entity.projectile.AbstractArrow",

    "OwnableEntity": "net.minecraft.world.entity.OwnableEntity",
    "NeutralMob": "net.minecraft.world.entity.NeutralMob",

    "CrossbowAttackMob": "net.minecraft.world.entity.monster.CrossbowAttackMob",
    "RangedAttackMob": "net.minecraft.world.entity.monster.RangedAttackMob",
    "Ghast": "net.minecraft.world.entity.monster.Ghast",
    "Witch": "net.minecraft.world.entity.monster.Witch",
    "Drowned": "net.minecraft.world.entity.monster.Drowned",
    "Blaze": "net.minecraft.world.entity.monster.Blaze",
    "Slime": "net.minecraft.world.entity.monster.Slime",
    "Skeleton": "net.minecraft.world.entity.monster.Skeleton",
    "Creeper": "net.minecraft.world.entity.monster.Creeper",
    "Spider": "net.minecraft.world.entity.monster.Spider",
    "Zombie": "net.minecraft.world.entity.monster.Zombie",

    "Boat": "net.minecraft.world.entity.vehicle.Boat",

    "PrimedTnt": "net.minecraft.world.entity.item.PrimedTnt",

    "Player": "net.minecraft.world.entity.player.Player",

    "Raider": "net.minecraft.world.entity.raid.Raider",

    "WitherBoss": "net.minecraft.world.entity.boss.wither.WitherBoss",
    "EnderDragon": "net.minecraft.world.entity.boss.enderdragon.EnderDragon",

    "SnowGolem": "net.minecraft.world.entity.animal.SnowGolem",

    "MeleeAttackGoal": "net.minecraft.world.entity.ai.goal.MeleeAttackGoal",
    "AvoidEntityGoal": "net.minecraft.world.entity.ai.goal.AvoidEntityGoal",

    "AttributeModifier": "net.minecraft.world.entity.ai.attributes.AttributeModifier",

    "ItemParticleOption": "net.minecraft.core.particles.ItemParticleOption",
    "BlockParticleOption": "net.minecraft.core.particles.BlockParticleOption",
    "DustParticleOptions": "net.minecraft.core.particles.DustParticleOptions",
    "ParticleTypes": "net.minecraft.core.particles.ParticleTypes",

    "BlockHitResult": "net.minecraft.world.phys.BlockHitResult",
    "ClipContext": "net.minecraft.world.level.ClipContext",
    "BlockPlaceContext": "net.minecraft.world.item.context.BlockPlaceContext",

    "$PotionBuilder": "dev.latvian.mods.kubejs.misc.PotionBuilder",
    "BlockTintFunction": "dev.latvian.mods.kubejs.block.BlockTintFunction",
    "ItemTintFunction": "dev.latvian.mods.kubejs.item.ItemTintFunction",
    "ItemBuilder": "dev.latvian.mods.kubejs.item.custom.BasicItemJS$Builder",
    "EntityOpt": "org.craftamethyst.tritium.config.TritiumConfigBase$Entities$EntityOpt",

    "UUID": "java.util.UUID",
    "{ MAX_VALUE }": "java.lang.Integer"
}

global.load_classes = (scope) => {
    Object.entries(global.class_map).forEach(
        ([key, value]) =>
            scope[key] = Java.loadClass(value)
    )
}

global.load_classes(this)