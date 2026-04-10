global.custom_sounds = [
    "skill/whirlwind", "skill/smite", "skill/arc",
    "skill/blizzard", "skill/inferno", "skill/vortex",
    "skill/lunge", "destroy_projectile"
]
StartupEvents.registry("sound_event", e => global.custom_sounds.forEach(s => e.create("fmn:" + s)))