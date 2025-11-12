// module/actor/actor.js
export class CyberHackActor extends Actor {

    /** @override */
    static defineSchema() {
        const fields = foundry.data.fields;

        return {
            // === TOUT LE RESTE DANS system ===
            system: new fields.SchemaField({
                // === ATTRIBUTS ===
                attributs: new fields.ObjectField({
                    required: true,
                    initial: {
                        body: { value: 5, label: "Body", skills: {} },
                        dexterity: { value: 5, label: "Dexterity", skills: {} },
                        reflexes: { value: 5, label: "Reflexes", skills: {} },
                        knowledge: { value: 5, label: "Knowledge", skills: {} },
                        willpower: { value: 5, label: "Willpower", skills: {} },
                        empathy: { value: 5, label: "Empathy", skills: {} }
                    }
                }),

                // === STATS ===
                wounds: new fields.SchemaField({
                    value: new fields.NumberField({ required: true, initial: 0, min: 0 }),
                    max: new fields.NumberField({ required: true, initial: 10, min: 1 })
                }),
                btm: new fields.SchemaField({
                    value: new fields.NumberField({ required: true, initial: 0 })
                }),
                speed: new fields.SchemaField({
                    value: new fields.NumberField({ required: true, initial: 7 })
                }),
                carry: new fields.SchemaField({
                    value: new fields.NumberField({ required: true, initial: 50 })
                }),
                luck: new fields.SchemaField({
                    value: new fields.NumberField({ required: true, initial: 5 })
                }),
                otherInfo: new fields.SchemaField({
                    value: new fields.StringField({ initial: "" })
                }),
                biography: new fields.HTMLField({ initial: "" }),

                // === ARMOR ===
                armor: new fields.ObjectField({
                    required: true,
                    initial: {
                        head: { value: 0 }, torso: { value: 0 },
                        rightArm: { value: 0 }, leftArm: { value: 0 },
                        rightLeg: { value: 0 }, leftLeg: { value: 0 }
                    }
                }),

                // === RANGES ===
                ranges: new fields.ObjectField({
                    required: true,
                    initial: {
                        handguns: { close: 50, medium: 100, long: 200, extreme: 400 },
                        smgRifles: { close: 100, medium: 200, long: 400, extreme: 800 },
                        shotgun: { close: 50, medium: 100, long: 200, extreme: 0 }
                    }
                }),

                // === MENU SIDEBAR ===
                menu: new fields.ArrayField(
                    new fields.StringField(),
                    { initial: ["talents", "weapons", "gears", "net", "life", "cyberwares"] }
                )
            })
        };
    }

    prepareDerivedData() {
        const system = this.system;
        const body = system.attributs.body.value;
        const ref = system.attributs.reflexes.value;

        system.wounds.max = body * 5;
        system.wounds.value = Math.clamped(system.wounds.value ?? 0, 0, system.wounds.max);
        system.btm.value = this._calcBTM(body);
        system.speed.value = ref;
        system.carry.value = body * 10;

        this._calcSkills();
    }

    _calcBTM(body) {
        if (body <= 2) return 0;
        if (body <= 4) return -1;
        if (body <= 6) return -2;
        if (body <= 8) return -3;
        if (body <= 10) return -4;
        return -5;
    }

    _calcSkills() {
        const system = this.system;
        for (const attr of Object.values(system.attributs)) {
            for (const [key, skill] of Object.entries(attr.skills)) {
                skill.value = (skill.base || 0) + (skill.mod || 0);
                if (!skill.label) skill.label = this._formatLabel(key);
            }
        }
    }

    _formatLabel(key) {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, s => s.toUpperCase())
            .trim();
    }
}