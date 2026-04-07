global.swords = {
    "smite": (level, player, id, delay, dmg) => {
        player.cooldowns.addCooldown(id, delay * 1.5);

        const first = player.rayTrace(4).entity;
        if(!first) return;
        if(first instanceof Projectile) {
            first.discard();
            player.server.scheduleInTicks(1, () => {
                const second = player.rayTrace(4).entity
                if (second) second.attack(player, dmg * 2)
            })
        }
        else {
            first.attack(player, dmg * 2)
        }
    },
    "whirlwind": (level, player, id, delay, dmg) => {
        player.cooldowns.addCooldown(id, delay * 1.5);

        level.getEntitiesWithin(player.boundingBox.inflate(1.2, 0, 1.2)).forEach(en => {
            if(!en.isLiving() || !en.isAlive()) return;
            if(en.distanceToEntity(player) > 1.5) return;
            en.attack(player, dmg * 0.8)
        })
    },
    "lunge": () => {

    },
    "arc": (level, player, id, delay, dmg) => {
        player.cooldowns.addCooldown(id, delay * 1);

        const arc = level.createEntity("kubejs:arc");

        arc.setDeltaMovement(player.lookAngle.scale(2));
        arc.copyPosition(player);
        arc.setY(player.eyeY);
        arc.setOwner(player);
        arc.persistentData.dmg = dmg;
        arc.spawn();
    },
    "vortex": (level, player, id, delay, dmg) => {

    },
    "inferno": (level, player, id, delay, dmg) => {
        player.cooldowns.addCooldown(id, delay * 1.5);

        level.getEntitiesWithin(player.boundingBox.inflate(6, 0, 6)).forEach(en => {
            if (!en.isAlive()) return;
            if (en.distanceToEntity(player) > 6.5) return;

            if(en.isOnFire()) {
                en.attack(player, dmg)
                if(en instanceof Projectile) en.discard()
            }
            else {
                en.setSecondsOnFire(delay + 1.2);
                if (en.block.hasTag("minecraft:soul_fire_base_blocks")) en.fireType = "minecraft:soul"
            }
        })
    },
    "blizzard": (level, player, id, delay, dmg) => {
        player.cooldowns.addCooldown(id, delay * 1.5);

        level.getEntitiesWithin(player.boundingBox.inflate(6, 0, 6)).forEach(en => {
            if (!en.isAlive() || en.distanceToEntity(player) > 6.5) return;

            if (!en.isLiving()) {
                if (en.ticksFrozen > 400) {
                    en.potionEffects.add("slowness", dmg * 10, 1, true, false);
                    en.ticksFrozen = 0
                }
                else {
                    en.ticksFrozen += 140;
                }
            }
            else if(en instanceof Projectile) {
                en.setDeltaMovement(en.deltaMovement.scale(0.5))
            }
        })
    }
}

// ItemEvents.modification(e => {

//     global.Swords
//         .map(i => i.asItem().id)
//         .forEach(id => {
//             e.modify(id, item => {
//                 item.itemBuilder.use((level, player, hand) => {
//                     if (level.isClientSide()) return false;

//                     player.cooldowns.addCooldown(id, 10);


//                     return false
//                 })

//                 const builder =
//                     new ItemBuilder(id)
//                         .useAnimation("spear")
//                         .useDuration(item => 1)
//                         .use((level, player, hand) => {
//                             if (level.isClientSide()) return false;
//                             const delay = (player.getCurrentItemAttackStrengthDelay()) * 2 - 1


//                             return false
//                         })

//                 item.setItemBuilder(builder);
//             })
//         })
// })