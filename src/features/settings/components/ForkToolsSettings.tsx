/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import { useLingui } from '@lingui/react/macro';
import { NumberSetting } from '@/base/components/settings/NumberSetting.tsx';
import { SelectSetting } from '@/base/components/settings/SelectSetting.tsx';
import { ListSubheader } from '@/base/components/lists/ListSubheader.tsx';
import type { ServerSettings } from '@/features/settings/Settings.types.ts';
import type { PartialSettingsTypeInput } from '@/lib/graphql/generated/graphql-base.types.ts';
import {
    MERGE_CHAPTER_DISPLAY_SELECT_VALUES,
    MERGE_DEFAULT_MODE_SELECT_VALUES,
    MERGE_OFFLINE_MODE_SELECT_VALUES,
    MERGE_UNNUMBERED_MATCHING_SELECT_VALUES,
} from '@/features/settings/Settings.constants.ts';

type ForkToolSettings = Pick<
    ServerSettings,
    | 'forkStockMode'
    | 'mergeEnabled'
    | 'mergeDefaultMode'
    | 'mergeUnnumberedChapterMatching'
    | 'mergeMinimumSources'
    | 'mergeChapterDisplay'
    | 'mergeFallbackSourcesEnabled'
    | 'mergeOfflineMode'
    | 'mergeDownloadOnceForMirrors'
    | 'mergeChapterLevelEnabled'
    | 'mergeSplitRevalidateOnUpdate'
    | 'duplicatesEnabled'
    | 'reindexEnabled'
    | 'doctorEnabled'
>;

type ForkToolsSettingsProps = {
    settings: ForkToolSettings;
    updateSettings: (settings: PartialSettingsTypeInput) => Promise<void>;
};

export const ForkToolsSettings = ({ settings, updateSettings }: ForkToolsSettingsProps) => {
    const { t } = useLingui();
    const dependentSwitchDisabled = settings.forkStockMode;
    const mergeSettingsDisabled = dependentSwitchDisabled || !settings.mergeEnabled;

    return (
        <List
            subheader={
                <ListSubheader component="div" id="server-settings-fork-tools">
                    {t`Merge & library tools`}
                </ListSubheader>
            }
        >
            <ListItem>
                <ListItemText
                    primary={t`Fork stock mode`}
                    secondary={t`Disable all fork tools and use stock server behavior.`}
                />
                <Switch
                    edge="end"
                    checked={settings.forkStockMode}
                    onChange={(event) => updateSettings({ forkStockMode: event.target.checked })}
                />
            </ListItem>
            <ListItem>
                <ListItemText
                    primary={t`Manga merging`}
                    secondary={t`Enable the manga merge and chapter split tools.`}
                />
                <Switch
                    edge="end"
                    checked={settings.mergeEnabled}
                    disabled={dependentSwitchDisabled}
                    onChange={(event) => updateSettings({ mergeEnabled: event.target.checked })}
                />
            </ListItem>
            <SelectSetting
                settingName={t`Default merge mode`}
                dialogDescription={t`Choose which merge mode is pre-selected in the merge wizard.`}
                value={settings.mergeDefaultMode}
                values={MERGE_DEFAULT_MODE_SELECT_VALUES}
                disabled={mergeSettingsDisabled}
                disabledDescription={t`Enable manga merging to change this setting.`}
                handleChange={(value) => updateSettings({ mergeDefaultMode: value })}
            />
            <SelectSetting
                settingName={t`Unnumbered chapter matching`}
                dialogDescription={t`Choose how the merge planner matches chapters without numbers.`}
                value={settings.mergeUnnumberedChapterMatching}
                values={MERGE_UNNUMBERED_MATCHING_SELECT_VALUES}
                disabled={mergeSettingsDisabled}
                disabledDescription={t`Enable manga merging to change this setting.`}
                handleChange={(value) => updateSettings({ mergeUnnumberedChapterMatching: value })}
            />
            <NumberSetting
                settingTitle={t`Minimum merge sources`}
                dialogDescription={t`Set the minimum number of source manga that a merge must retain.`}
                settingValue={settings.mergeMinimumSources.toString()}
                value={settings.mergeMinimumSources}
                defaultValue={2}
                minValue={2}
                maxValue={5}
                stepSize={1}
                valueUnit=""
                disabled={mergeSettingsDisabled}
                disabledDescription={t`Enable manga merging to change this setting.`}
                handleUpdate={(value) => updateSettings({ mergeMinimumSources: value })}
            />
            <SelectSetting
                settingName={t`Merged chapter display`}
                dialogDescription={t`Choose whether merged chapters show original or normalized names.`}
                value={settings.mergeChapterDisplay}
                values={MERGE_CHAPTER_DISPLAY_SELECT_VALUES}
                disabled={mergeSettingsDisabled}
                disabledDescription={t`Enable manga merging to change this setting.`}
                handleChange={(value) => updateSettings({ mergeChapterDisplay: value })}
            />
            <ListItem>
                <ListItemText
                    primary={t`Fallback sources`}
                    secondary={
                        mergeSettingsDisabled
                            ? t`Enable manga merging to change this setting.`
                            : t`Try another source when a page list or image fails.`
                    }
                />
                <Switch
                    edge="end"
                    checked={settings.mergeFallbackSourcesEnabled}
                    disabled={mergeSettingsDisabled}
                    onChange={(event) => updateSettings({ mergeFallbackSourcesEnabled: event.target.checked })}
                />
            </ListItem>
            <SelectSetting
                settingName={t`Offline merge behavior`}
                dialogDescription={t`Choose how merged chapters behave while offline.`}
                value={settings.mergeOfflineMode}
                values={MERGE_OFFLINE_MODE_SELECT_VALUES}
                disabled={mergeSettingsDisabled}
                disabledDescription={t`Enable manga merging to change this setting.`}
                handleChange={(value) => updateSettings({ mergeOfflineMode: value })}
            />
            <ListItem>
                <ListItemText
                    primary={t`Download mirror chapters once`}
                    secondary={
                        mergeSettingsDisabled
                            ? t`Enable manga merging to change this setting.`
                            : t`Avoid downloading the same chapter from multiple mirror sources.`
                    }
                />
                <Switch
                    edge="end"
                    checked={settings.mergeDownloadOnceForMirrors}
                    disabled={mergeSettingsDisabled}
                    onChange={(event) => updateSettings({ mergeDownloadOnceForMirrors: event.target.checked })}
                />
            </ListItem>
            <ListItem>
                <ListItemText
                    primary={t`Chapter-level merge and split`}
                    secondary={
                        mergeSettingsDisabled
                            ? t`Enable manga merging to change this setting.`
                            : t`Enable merging and splitting individual chapters.`
                    }
                />
                <Switch
                    edge="end"
                    checked={settings.mergeChapterLevelEnabled}
                    disabled={mergeSettingsDisabled}
                    onChange={(event) => updateSettings({ mergeChapterLevelEnabled: event.target.checked })}
                />
            </ListItem>
            <ListItem>
                <ListItemText
                    primary={t`Revalidate splits on update`}
                    secondary={
                        mergeSettingsDisabled
                            ? t`Enable manga merging to change this setting.`
                            : t`Re-check split chapter page counts during updates and flag changed splits for review.`
                    }
                />
                <Switch
                    edge="end"
                    checked={settings.mergeSplitRevalidateOnUpdate}
                    disabled={mergeSettingsDisabled}
                    onChange={(event) => updateSettings({ mergeSplitRevalidateOnUpdate: event.target.checked })}
                />
            </ListItem>
            <ListItem>
                <ListItemText primary={t`Duplicate detection`} secondary={t`Enable duplicate manga detection.`} />
                <Switch
                    edge="end"
                    checked={settings.duplicatesEnabled}
                    disabled={dependentSwitchDisabled}
                    onChange={(event) => updateSettings({ duplicatesEnabled: event.target.checked })}
                />
            </ListItem>
            <ListItem>
                <ListItemText primary={t`Download reindex`} secondary={t`Enable download reindex tools.`} />
                <Switch
                    edge="end"
                    checked={settings.reindexEnabled}
                    disabled={dependentSwitchDisabled}
                    onChange={(event) => updateSettings({ reindexEnabled: event.target.checked })}
                />
            </ListItem>
            <ListItem>
                <ListItemText
                    primary={t`Consistency checks`}
                    secondary={t`Enable library and download consistency checks.`}
                />
                <Switch
                    edge="end"
                    checked={settings.doctorEnabled}
                    disabled={dependentSwitchDisabled}
                    onChange={(event) => updateSettings({ doctorEnabled: event.target.checked })}
                />
            </ListItem>
        </List>
    );
};
