import Vue from "vue";
import { Settings } from "./settings";
import { defaultShortcutsOptions, defaultShortcutIcon } from "../common/config/default-shortcuts-options";
import { vueEventDispatcher } from "./vue-event-dispatcher";
import { VueEventChannels } from "./vue-event-channels";
import { UserConfigOptions } from "../common/config/user-config-options";
import { cloneDeep } from "lodash";
import { defaultNewShortcut } from "../main/plugins/shorcuts-plugin/shortcut-helpers";
import { IconType } from "../common/icon/icon-type";
import { EditingMode } from "./shortcut-editing-modal-component";
import { Shortcut } from "../main/plugins/shorcuts-plugin/shortcut";

export const shortcutSettingsComponent = Vue.extend({
    data() {
        return {
            defaultShortcutIcon,
            iconTypeSvg: IconType.SVG,
            iconTypeUrl: IconType.URL,
            settingName: Settings.Shortcuts,
            visible: false,
        };
    },
    methods: {
        addButtonClick() {
            vueEventDispatcher.$emit(VueEventChannels.openShortcutEditingModal, cloneDeep(defaultNewShortcut), EditingMode.Add);
        },
        addShortcut(shortcut: Shortcut) {
            const config: UserConfigOptions = this.config;
            config.shortcutsOptions.shortcuts.push(cloneDeep(shortcut));
            this.updateConfig();
        },
        deleteShortcut(id: number) {
            const config: UserConfigOptions = this.config;
            config.shortcutsOptions.shortcuts.splice(id, 1);
            this.updateConfig();
        },
        updateShortcut(shortcut: Shortcut, index: number) {
            const config: UserConfigOptions = cloneDeep(this.config);
            config.shortcutsOptions.shortcuts[index] = cloneDeep(shortcut);
            this.config = cloneDeep(config);
            this.updateConfig();
        },
        editShortcut(index: number): void {
            const config: UserConfigOptions = this.config;
            const shortcut: Shortcut = cloneDeep(config.shortcutsOptions.shortcuts[index]);
            vueEventDispatcher.$emit(VueEventChannels.openShortcutEditingModal, shortcut, EditingMode.Edit, index);
        },
        onKeyUp(event: KeyboardEvent) {
            if (event.key === "Escape") {
                this.closeAddNewShortcutModalButtonClick();
            }
        },
        resetAll() {
            const config: UserConfigOptions = this.config;
            config.shortcutsOptions = cloneDeep(defaultShortcutsOptions);
            this.updateConfig();
        },
        resetShortcutsToDefault() {
            const config: UserConfigOptions = this.config;
            config.shortcutsOptions.shortcuts = cloneDeep(defaultShortcutsOptions.shortcuts);
            this.updateConfig();
        },
        toggleEnabled() {
            const config: UserConfigOptions = this.config;
            config.shortcutsOptions.isEnabled = !config.shortcutsOptions.isEnabled;
            this.updateConfig();
        },
        updateConfig() {
            vueEventDispatcher.$emit(VueEventChannels.configUpdated, this.config);
        },
    },
    mounted() {
        vueEventDispatcher.$on(VueEventChannels.showSetting, (settingName: string) => {
            if (settingName === this.settingName) {
                this.visible = true;
            } else {
                this.visible = false;
            }
        });

        vueEventDispatcher.$on(VueEventChannels.shortcutEdited, (shortcut: Shortcut, editMode: EditingMode, saveIndex?: number) => {
            if (editMode === EditingMode.Add) {
                this.addShortcut(shortcut);
            } else if (editMode === EditingMode.Edit && saveIndex !== undefined) {
                this.updateShortcut(shortcut, saveIndex);
            }
        });
    },
    props: ["config"],
    template: `
        <div v-if="visible" @keyup="onKeyUp">
            <div class="settings__setting-title title is-3">
                <span>
                    Shortcut Options
                </span>
                <div>
                    <button class="button" :class="{ 'is-success' : config.shortcutsOptions.isEnabled }" @click="toggleEnabled">
                        <span class="icon"><i class="fas fa-power-off"></i></span>
                    </button>
                    <button class="button" @click="resetAll">
                        <span class="icon"><i class="fas fa-undo-alt"></i></span>
                    </button>
                </div>
            </div>
            <div v-if="config.shortcutsOptions.isEnabled" class="settings__setting-content box">
                <div class="settings__setting-content-item-title">
                    <div class="title is-5">Shortcuts</div>
                    <button class="button" @click="resetShortcutsToDefault"><span class="icon"><i class="fas fa-undo-alt"></i></span></button>
                </div>
                <div v-if="config.shortcutsOptions.shortcuts.length > 0" class="settings__setting-content-item">
                    <table class="table is-striped is-fullwidth">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th class="is-expanded">Execution Argument</th>
                                <th>Type</th>
                                <th>Icon</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(shortcut, index) in config.shortcutsOptions.shortcuts">
                                <td>{{ shortcut.name }}</td>
                                <td>{{ shortcut.description }}</td>
                                <td>{{ shortcut.executionArgument }}</td>
                                <td>{{ shortcut.type }}</td>
                                <td>
                                    <img v-if="shortcut.icon.type === iconTypeUrl" :src="shortcut.icon.parameter" class="settings-table__icon-url">
                                    <div v-else="shortcut.icon.type === iconTypeSvg" v-html="shortcut.icon.parameter" class="settings-table__icon-svg"></div>
                                </td>
                                <td><button class="button" @click="editShortcut(index)"><span class="icon"><i class="fas fa-edit"></i></span></button></td>
                                <td><button class="button is-danger" @click="deleteShortcut(index)"><span class="icon"><i class="fas fa-trash"></i></span></button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <button class="button is-success" @click="addButtonClick"><span class="icon"><i class="fas fa-plus"></i></span></button>
                </div>
            </div>
            <shortcut-editing-modal></shortcut-editing-modal>
        </div>
    `,
});
