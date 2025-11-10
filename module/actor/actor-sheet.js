/**
 * Feuille de personnage pour Cyber Hack (revised)
 */
export class CyberHackCharacterSheet extends ActorSheet {

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["cyberhack", "sheet", "actor", "character"],
            template: "systems/cyber_hack_revised/templates/actor/actor-sheet.hbs",
            width: 800,
            height: 700,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-content", initial: "items" }],
            dragDrop: [{ dragSelector: ".item-list .item", dropSelector: null }]
        });
    }

    /** @override */
    getData() {
        const context = super.getData();
        const actorData = context.actor.system;

        // Préparer les données enrichies
        context.system = actorData;
        context.flags = context.actor.flags;

        // Localisation
        context.config = CONFIG.CYBERHACK;

        // Ajouter les labels des compétences
        if (actorData.attributs) {
            Object.values(actorData.attributs).forEach(attr => {
                if (attr.skills) {
                    Object.values(attr.skills).forEach(skill => {
                        if (!skill.label || skill.label === "") {
                            skill.label = this._formatSkillLabel(skill);
                        }
                    });
                }
            });
        }

        return context;
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // Jets de compétence
        html.find('.skill-roll').click(this._onSkillRoll.bind(this));
        html.find('.rollable').click(this._onRollableClick.bind(this));

        // Initiative
        html.find('.roll-initiative').click(this._onRollInitiative.bind(this));

        // Mise à jour auto des totaux de compétence
        html.find('.skill-base, .skill-mod').change(this._onSkillValueChange.bind(this));
    }

    // ==================================================================
    // GESTION DES JETS
    // ==================================================================

    async _onSkillRoll(event) {
        event.preventDefault();
        const skillElem = event.currentTarget.closest('.skill-item');
        const dataset = skillElem.querySelector('.rollable').dataset;
        const label = dataset.label;
        const formula = dataset.roll;

        this._rollFormula(formula, label);
    }

    async _onRollableClick(event) {
        event.preventDefault();
        const dataset = event.currentTarget.dataset;
        if (dataset.roll) {
            this._rollFormula(dataset.roll, dataset.label);
        }
    }

    async _onRollInitiative(event) {
        event.preventDefault();
        const ref = this.actor.system.attributs?.reflexes?.value || 0;
        const formula = `1d10 + ${ref}`;
        this._rollFormula(formula, "Initiative");
    }

    async _rollFormula(formula, label) {
        const roll = new Roll(formula, this.actor.getRollData());
        await roll.evaluate();

        const flavor = `<strong>${game.i18n.localize("CYBERHACK.Roll")} : ${label}</strong>`;
        roll.toMessage({
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            flavor: flavor
        });
    }

    // ==================================================================
    // MISE À JOUR DES COMPÉTENCES
    // ==================================================================

    _onSkillValueChange(event) {
        event.preventDefault();
        const input = event.currentTarget;
        const skillPath = input.name;
        const value = parseInt(input.value) || 0;

        // Mettre à jour l'acteur
        const updateData = {};
        updateData[skillPath] = value;

        // Recalculer la valeur totale
        setTimeout(() => {
            this.actor.update(updateData).then(() => {
                // Forcer le recalcul des derived data
                this.actor.prepareData();
                this.render();
            });
        }, 100);
    }

    // ==================================================================
    // UTILITAIRES
    // ==================================================================

    _formatSkillLabel(skillKey) {
        return skillKey
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }
}