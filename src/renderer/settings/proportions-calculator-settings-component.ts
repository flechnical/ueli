import Vue from "vue";
import { vueEventDispatcher } from "../vue-event-dispatcher";
import { VueEventChannels } from "../vue-event-channels";
import { PluginSettings } from "./plugin-settings";
import { UserConfigOptions } from "../../common/config/user-config-options";
import { defaultProportionsCalculatorOptions } from "../../common/config/proportions-calculator-options";
import { TranslationSet } from "../../common/translation/translation-set"; // TODO(flechnical): add localization in settings page; only hard-coded English for now
import { UserConfirmationDialogParams, UserConfirmationDialogType } from "./modals/user-confirmation-dialog-params";
import { deepCopy } from "../../common/helpers/object-helpers";

export const proportionsCalculatorSettingsComponent = Vue.extend({
    data() {
        return {
            settingName: PluginSettings.ProportionsCalculator,
            visible: false,
        };
    },
    methods: {
        resetAll() {
            const translations: TranslationSet = this.translations;
            const userConfirmationDialogParams: UserConfirmationDialogParams = {
                callback: () => {
                    const config: UserConfigOptions = this.config;
                    config.proportionsCalculatorOptions = deepCopy(defaultProportionsCalculatorOptions);
                    this.updateConfig();
                },
                message: translations.resetPluginSettingsToDefaultWarning,
                modalTitle: translations.resetToDefault,
                type: UserConfirmationDialogType.Default,
            };
            vueEventDispatcher.$emit(VueEventChannels.settingsConfirmation, userConfirmationDialogParams);
        },
        toggleEnabled() {
            const config: UserConfigOptions = this.config;
            config.proportionsCalculatorOptions.enabled = !config.proportionsCalculatorOptions.enabled;
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
    },
    props: ["config", "translations"],
    template: `
        <div v-if="visible">
            <div class="settings__setting-title title is-3">
                <span>
                    Proportions Calculator (Rule of Threes)
                </span>
                <div>
                    <plugin-toggle :is-enabled="config.proportionsCalculatorOptions.enabled" :toggled="toggleEnabled"/>
                    <button v-if="config.proportionsCalculatorOptions.enabled" class="button" @click="resetAll">
                        <span class="icon"><i class="fas fa-undo-alt"></i></span>
                    </button>
                </div>
            </div>
            <p class="settings__setting-description">This plugin helps you calculate proportions by using the Rule of Threes.</p>
            <p class="settings__setting-description">Enter the plugin prefix and then the following: +_known-unit-1_/_known-unit-2_/_known-value-of-unit-1_/_known-value-of-unit-2_/_base-value-of-unit-1_/</p>
            <p class="settings__setting-description">This will give you the second value in unit 2.<br>Replace the "+" with a "-" if the values are in an indirect proportion.<br>You can also type a space instead of a "+".</p>
            <p class="settings__setting-description">Example to get the customer satisfaction of this plugin: +plugin-awesomeness/satisfaction-percent/7/90/10/</p>
            <div class="settings__setting-content" >
                <div v-if="!config.proportionsCalculatorOptions.enabled" class="settings__setting-disabled-overlay"></div>
                <div class="box">
                    <div class="settings__option-container">

                    <div class="settings__option">
                        <div class="settings__option-name">Prefix</div>
                        <div class="settings__option-content">
                            <div class="field is-grouped is-grouped-right">
                                <div class="control">
                                    <input
                                        type="text"
                                        class="input font-mono"
                                        v-model="config.proportionsCalculatorOptions.prefix"
                                        @change="updateConfig"
                                    >
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="settings__option">
                        <div class="settings__option-name">Use Comma as Decimal Separator instead of Period</div>
                        <div class="settings__option-content">
                            <div class="field has-addons has-addons-right vertical-center">
                                <div class="control">
                                    <input id="decimalCommaCheckbox" type="checkbox" name="decimalCommaCheckbox" class="switch is-rounded is-success" checked="checked" v-model="config.proportionsCalculatorOptions.decimalComma" @change="updateConfig">
                                    <label for="decimalCommaCheckbox"></label>
                                </div>
                            </div>
                        </div>
                    </div>

                    </div>
                </div>
            </div>
        </div>
    `,
});
