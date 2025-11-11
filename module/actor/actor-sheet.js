// module/actor/actor-sheet.js
export class CyberHackCharacterSheet extends ActorSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["cyberhack", "sheet", "actor"],
            template: "systems/cyber_hack_revised/templates/actor/actor-sheet.hbs",
            width: 1100,
            height: 800,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-content", initial: "main" }]
        });
    }

    /** @override */
    getData() {
        const context = super.getData(); // <-- CRUCIAL
        const system = context.actor.system;
        console.log(system.attributs);

        // SÉCURITÉ : Vérifier que system existe
        if (!system) return context;

        // Filtrer les items
        context.cyberware = context.items.filter(i => i.type === "cyberware") || [];
        context.weapons = context.items.filter(i => i.type === "weapon") || [];
        console.log(context);
        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);

        // Jets
        html.find('.rollable').click(this._onRoll.bind(this));

        // Mise à jour auto des compétences
        html.find('input[name*="base"], input[name*="mod"]').change(() => {
            setTimeout(() => {
                this.actor.update({});
                this.render();
            }, 100);
        });

        const sidebarTabs = html.find('.sheet-tabs-sidebar');
        if (sidebarTabs.length) {
            sidebarTabs.on('click', 'a.item', (event) => {
                event.preventDefault();
                const tab = event.currentTarget;
                const group = tab.closest('[data-group]').dataset.group;
                const targetTab = tab.dataset.tab;

                console.log(html.find(`[data-group="${group}"] .tab`));
                // Retire .active de tous les onglets du groupe
                html.find(`[data-group="${group}"] .item`).removeClass('active');
                html.find(`.sheet-content-sidebar .tab`).removeClass('active');

                // Ajoute .active au bon onglet et contenu
                tab.classList.add('active');
                html.find(`[data-group="${group}"][data-tab="${targetTab}"]`).addClass('active');
            });
        }

        // === 4. (Optionnel) Onglet actif par défaut au rendu ===
        // Si aucun onglet n'est actif, active le premier
        const activeTab = html.find('.sheet-tabs-sidebar .item.active');
        if (!activeTab.length) {
            html.find('.sheet-tabs-sidebar .item').first().addClass('active');
            const firstTab = html.find('.sheet-tabs-sidebar .item').first().data('tab');
            html.find(`.sheet-content-sidebar .tab[data-tab="${firstTab}"]`).addClass('active');
        }
    }

    async _onRoll(event) {
        const el = event.currentTarget;
        const formula = el.dataset.roll;
        const label = el.dataset.label || "Skill Check";
        const roll = new Roll(formula, this.actor.getRollData());
        await roll.evaluate();
        roll.toMessage({
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            flavor: `<strong>${label}</strong>`
        });
    }
}