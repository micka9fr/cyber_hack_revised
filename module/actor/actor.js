/**
 * Cyber Hack (Revised) - Actor Class
 * Compatible avec Foundry VTT v13
 */
export class CyberHackActor extends Actor {

    /** @override */
    prepareData() {
        // Préparation des données brutes
        super.prepareData();
    }

    /** @override */
    prepareBaseData() {
        // Initialisation des données de base
        const system = this.system;

        // --- Assurer la structure de base ---
        if (!system.wounds) {
            system.wounds = { value: 10, min: 0, max: 10, label: "Wounds" };
        }
        if (!system.btm) {
            system.btm = { value: 0, label: "BTM" };
        }
        if (!system.armor) {
            system.armor = {
                head: { value: 0, label: "Head" },
                torso: { value: 0, label: "Torso" }
            };
        }
    }

    /** @override */
    prepareDerivedData() {
        const actorData = this;
        const system = actorData.system;
        const flags = actorData.flags;

        // Ne rien faire si pas de système
        if (!system) return;

        // Préparation selon le type
        if (actorData.type === 'character') {
            this._prepareCharacterData(actorData);
        } else if (actorData.type === 'NPC') {
            this._prepareNPCData(actorData);
        }
    }

    /**
     * Préparation des données pour les personnages
     */
    _prepareCharacterData(actor) {
        const system = actor.system;

        // --- Calcul du BTM et des PV max en fonction de BODY ---
        const body = system.attributs?.body?.value ?? 0;
        system.btm.value = this._calculateBTM(body);
        system.wounds.max = this._calculateMaxWounds(body);

        // Clamp des PV actuels
        system.wounds.value = Math.clamped(
            system.wounds.value ?? system.wounds.max,
            system.wounds.min,
            system.wounds.max
        );

        // --- Calcul des compétences ---
        this._calculateAllSkills(system);

        // --- Initiative ---
        const ref = system.attributs?.reflexes?.value ?? 0;
        system.initiative = system.initiative || {};
        system.initiative.value = ref;
    }

    /**
     * Préparation des données pour les PNJ
     */
    _prepareNPCData(actor) {
        const system = actor.system;

        // Même logique que personnage, mais plus légère
        const body = system.attributs?.body?.value ?? 0;
        system.btm.value = this._calculateBTM(body);
        system.wounds.max = this._calculateMaxWounds(body);
        system.wounds.value = Math.clamped(system.wounds.value ?? 10, 0, system.wounds.max);

        this._calculateAllSkills(system);
    }

    // ==================================================================
    // FONCTIONS DE CALCUL
    // ==================================================================

    /**
     * Calcule le BTM selon la table Cyberpunk
     */
    _calculateBTM(body) {
        if (body <= 1) return 0;
        if (body <= 2) return -1;
        if (body <= 4) return -2;
        if (body <= 7) return -3;
        if (body <= 9) return -4;
        if (body <= 11) return -5;
        return -6;
    }

    /**
     * Calcule les PV max : (BODY x 5)
     */
    _calculateMaxWounds(body) {
        return Math.max(1, body * 5);
    }

    /**
     * Parcourt tous les attributs et calcule les compétences
     */
    _calculateAllSkills(system) {
        const attributs = system.attributs || {};

        for (const [attrKey, attr] of Object.entries(attributs)) {
            if (!attr.skills) continue;

            for (const [skillKey, skill] of Object.entries(attr.skills)) {
                // Initialisation si manquant
                if (skill.base === undefined) skill.base = 0;
                if (skill.mod === undefined) skill.mod = 0;

                // Calcul de la valeur finale
                skill.value = skill.base + skill.mod;

                // Ajout du label si vide
                if (!skill.label || skill.label === "") {
                    skill.label = this._formatSkillLabel(skillKey);
                }
            }
        }
    }

    /**
     * Formate les noms de compétences
     */
    _formatSkillLabel(key) {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }

    // ==================================================================
    // ROLL DATA (pour les macros)
    // ==================================================================

    /** @override */
    getRollData() {
        const data = foundry.utils.deepClone(this.system);

        // Ajouter les attributs directement
        if (data.attributs) {
            for (const [key, attr] of Object.entries(data.attributs)) {
                data[key] = attr.value;
            }
        }

        // Ajouter les compétences (ex: @skills.endurance.value)
        data.skills = {};
        if (data.attributs) {
            for (const [attrKey, attr] of Object.entries(data.attributs)) {
                if (attr.skills) {
                    for (const [skillKey, skill] of Object.entries(attr.skills)) {
                        data.skills[skillKey] = skill.value;
                    }
                }
            }
        }

        // Valeurs utiles
        data.btm = data.btm?.value ?? 0;
        data.wounds = data.wounds?.value ?? 0;
        data.initiative = data.initiative?.value ?? 0;

        return data;
    }
}