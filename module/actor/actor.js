export class CyberHackActor extends Actor {

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