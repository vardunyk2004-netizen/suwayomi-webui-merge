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
    MERGE_DEDUPE_STRATEGY_SELECT_VALUES,
    MERGE_DEFAULT_MODE_SELECT_VALUES,
    MERGE_OFFLINE_MODE_SELECT_VALUES,
    MERGE_OPDS_VISIBILITY_SELECT_VALUES,
    MERGE_UNNUMBERED_MATCHING_SELECT_VALUES,
    PROGRESS_BOOKMARK_POLICY_SELECT_VALUES,
    PROGRESS_CONFLICT_POLICY_SELECT_VALUES,
    PROGRESS_DIRECTION_SELECT_VALUES,
} from '@/features/settings/Settings.constants.ts';

type ForkToolSettings = Pick<
    ServerSettings,
    | 'forkStockMode'
    | 'mergeEnabled'
    | 'mergeDefaultMode'
    | 'mergeDedupeStrategy'
    | 'mergeUnnumberedChapterMatching'
    | 'mergeMinimumSources'
    | 'mergeChapterDisplay'
    | 'mergeFallbackSourcesEnabled'
    | 'mergeOfflineMode'
    | 'mergeDownloadOnceForMirrors'
    | 'mergeChapterLevelEnabled'
    | 'mergeSplitRevalidateOnUpdate'
    | 'progressSyncEnabled'
    | 'progressConflictPolicy'
    | 'progressReadIsMonotonic'
    | 'progressBookmarkPolicy'
    | 'progressDirection'
    | 'lifecycleTrashEnabled'
    | 'lifecycleTrashRetentionDays'
    | 'lifecycleRestoreSourcesOnRemoveMerged'
    | 'lifecycleConfirmPurgeText'
    | 'mergeUpdateReapplyPlan'
    | 'mergeUpdateIsolateSourceFailures'
    | 'mergeDetectRemovedChapters'
    | 'mergeExcludeFromSync'
    | 'mergeBackupEnabled'
    | 'mergeBackupFlattenExport'
    | 'mergeOpdsVisibility'
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
    const progressSettingsDisabled = mergeSettingsDisabled || !settings.progressSyncEnabled;
    const lifecycleSettingsDisabled = mergeSettingsDisabled || !settings.lifecycleTrashEnabled;
    const backupSettingsDisabled = mergeSettingsDisabled || !settings.mergeBackupEnabled;

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
                settingName={t`Duplicate chapter strategy`}
                dialogDescription={t`Choose which source chapter to use when mirror sources contain the same chapter.`}
                value={settings.mergeDedupeStrategy}
                values={MERGE_DEDUPE_STRATEGY_SELECT_VALUES}
                disabled={mergeSettingsDisabled}
                disabledDescription={t`Enable manga merging to change this setting.`}
                handleChange={(value) => updateSettings({ mergeDedupeStrategy: value })}
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
                <ListItemText
                    primary={t`Synchronize reading progress`}
                    secondary={
                        mergeSettingsDisabled
                            ? t`Enable manga merging to change this setting.`
                            : t`Keep read state and progress aligned between merged and source chapters.`
                    }
                />
                <Switch
                    edge="end"
                    checked={settings.progressSyncEnabled}
                    disabled={mergeSettingsDisabled}
                    onChange={(event) => updateSettings({ progressSyncEnabled: event.target.checked })}
                />
            </ListItem>
            <SelectSetting
                settingName={t`Progress conflict policy`}
                dialogDescription={t`Choose which chapter's progress wins when source and merged progress differ.`}
                value={settings.progressConflictPolicy}
                values={PROGRESS_CONFLICT_POLICY_SELECT_VALUES}
                disabled={progressSettingsDisabled}
                disabledDescription={t`Enable progress synchronization to change this setting.`}
                handleChange={(value) => updateSettings({ progressConflictPolicy: value })}
            />
            <ListItem>
                <ListItemText
                    primary={t`Keep read progress monotonic`}
                    secondary={
                        progressSettingsDisabled
                            ? t`Enable progress synchronization to change this setting.`
                            : t`Prevent synchronized progress from changing a read chapter back to unread.`
                    }
                />
                <Switch
                    edge="end"
                    checked={settings.progressReadIsMonotonic}
                    disabled={progressSettingsDisabled}
                    onChange={(event) => updateSettings({ progressReadIsMonotonic: event.target.checked })}
                />
            </ListItem>
            <SelectSetting
                settingName={t`Progress bookmark policy`}
                dialogDescription={t`Choose how bookmarks are combined between source and merged chapters.`}
                value={settings.progressBookmarkPolicy}
                values={PROGRESS_BOOKMARK_POLICY_SELECT_VALUES}
                disabled={progressSettingsDisabled}
                disabledDescription={t`Enable progress synchronization to change this setting.`}
                handleChange={(value) => updateSettings({ progressBookmarkPolicy: value })}
            />
            <SelectSetting
                settingName={t`Progress synchronization direction`}
                dialogDescription={t`Choose whether progress synchronizes both ways or only to source chapters.`}
                value={settings.progressDirection}
                values={PROGRESS_DIRECTION_SELECT_VALUES}
                disabled={progressSettingsDisabled}
                disabledDescription={t`Enable progress synchronization to change this setting.`}
                handleChange={(value) => updateSettings({ progressDirection: value })}
            />
            <ListItem>
                <ListItemText
                    primary={t`Enable trash for removed fork items`}
                    secondary={
                        mergeSettingsDisabled
                            ? t`Enable manga merging to change this setting.`
                            : t`Keep soft-removed fork items in trash so they can be restored.`
                    }
                />
                <Switch
                    edge="end"
                    checked={settings.lifecycleTrashEnabled}
                    disabled={mergeSettingsDisabled}
                    onChange={(event) => updateSettings({ lifecycleTrashEnabled: event.target.checked })}
                />
            </ListItem>
            <NumberSetting
                settingTitle={t`Trash retention days`}
                dialogDescription={t`Set how long trashed items are retained; zero keeps them indefinitely.`}
                settingValue={settings.lifecycleTrashRetentionDays.toString()}
                value={settings.lifecycleTrashRetentionDays}
                defaultValue={30}
                minValue={0}
                maxValue={3650}
                stepSize={1}
                valueUnit={t`days`}
                disabled={lifecycleSettingsDisabled}
                disabledDescription={t`Enable trash to change this setting.`}
                handleUpdate={(value) => updateSettings({ lifecycleTrashRetentionDays: value })}
            />
            <ListItem>
                <ListItemText
                    primary={t`Restore sources when a merged manga is removed`}
                    secondary={
                        mergeSettingsDisabled
                            ? t`Enable manga merging to change this setting.`
                            : t`Return source manga to the library when their merged manga is removed.`
                    }
                />
                <Switch
                    edge="end"
                    checked={settings.lifecycleRestoreSourcesOnRemoveMerged}
                    disabled={mergeSettingsDisabled}
                    onChange={(event) =>
                        updateSettings({ lifecycleRestoreSourcesOnRemoveMerged: event.target.checked })
                    }
                />
            </ListItem>
            <ListItem>
                <ListItemText
                    primary={t`Require typed confirmation before purge`}
                    secondary={
                        lifecycleSettingsDisabled
                            ? t`Enable trash to change this setting.`
                            : t`Require typing the confirmation phrase before permanently purging trash.`
                    }
                />
                <Switch
                    edge="end"
                    checked={settings.lifecycleConfirmPurgeText}
                    disabled={lifecycleSettingsDisabled}
                    onChange={(event) => updateSettings({ lifecycleConfirmPurgeText: event.target.checked })}
                />
            </ListItem>
            <ListItem>
                <ListItemText
                    primary={t`Reapply merge plan on source updates`}
                    secondary={
                        mergeSettingsDisabled
                            ? t`Enable manga merging to change this setting.`
                            : t`Reapply merge filters, exclusions and duplicate choices after source updates.`
                    }
                />
                <Switch
                    edge="end"
                    checked={settings.mergeUpdateReapplyPlan}
                    disabled={mergeSettingsDisabled}
                    onChange={(event) => updateSettings({ mergeUpdateReapplyPlan: event.target.checked })}
                />
            </ListItem>
            <ListItem>
                <ListItemText
                    primary={t`Continue after a source update failure`}
                    secondary={
                        mergeSettingsDisabled
                            ? t`Enable manga merging to change this setting.`
                            : t`Allow remaining merge sources to update when one source fails.`
                    }
                />
                <Switch
                    edge="end"
                    checked={settings.mergeUpdateIsolateSourceFailures}
                    disabled={mergeSettingsDisabled}
                    onChange={(event) => updateSettings({ mergeUpdateIsolateSourceFailures: event.target.checked })}
                />
            </ListItem>
            <ListItem>
                <ListItemText
                    primary={t`Detect removed source chapters`}
                    secondary={
                        mergeSettingsDisabled
                            ? t`Enable manga merging to change this setting.`
                            : t`Mark removed source chapters missing and attempt safe relinking after updates.`
                    }
                />
                <Switch
                    edge="end"
                    checked={settings.mergeDetectRemovedChapters}
                    disabled={mergeSettingsDisabled}
                    onChange={(event) => updateSettings({ mergeDetectRemovedChapters: event.target.checked })}
                />
            </ListItem>
            <ListItem>
                <ListItemText
                    primary={t`Exclude merge data from SyncYomi`}
                    secondary={
                        mergeSettingsDisabled
                            ? t`Enable manga merging to change this setting.`
                            : t`Keep fork-owned merge, lifecycle and journal data out of SyncYomi.`
                    }
                />
                <Switch
                    edge="end"
                    checked={settings.mergeExcludeFromSync}
                    disabled={mergeSettingsDisabled}
                    onChange={(event) => updateSettings({ mergeExcludeFromSync: event.target.checked })}
                />
            </ListItem>
            <ListItem>
                <ListItemText
                    primary={t`Include merge data`}
                    secondary={
                        mergeSettingsDisabled
                            ? t`Enable manga merging to change this setting.`
                            : t`Include merge configuration and source links in server backups.`
                    }
                />
                <Switch
                    edge="end"
                    checked={settings.mergeBackupEnabled}
                    disabled={mergeSettingsDisabled}
                    onChange={(event) => updateSettings({ mergeBackupEnabled: event.target.checked })}
                />
            </ListItem>
            <ListItem>
                <ListItemText
                    primary={t`Flatten merged export`}
                    secondary={
                        backupSettingsDisabled
                            ? t`Enable merge backups to change this setting.`
                            : t`Export merged manga as ordinary manga using the preferred source chapters.`
                    }
                />
                <Switch
                    edge="end"
                    checked={settings.mergeBackupFlattenExport}
                    disabled={backupSettingsDisabled}
                    onChange={(event) => updateSettings({ mergeBackupFlattenExport: event.target.checked })}
                />
            </ListItem>
            <SelectSetting
                settingName={t`OPDS merged manga visibility`}
                dialogDescription={t`Choose whether OPDS feeds show merged manga only or both merged and source manga.`}
                value={settings.mergeOpdsVisibility}
                values={MERGE_OPDS_VISIBILITY_SELECT_VALUES}
                disabled={mergeSettingsDisabled}
                disabledDescription={t`Enable manga merging to change this setting.`}
                handleChange={(value) => updateSettings({ mergeOpdsVisibility: value })}
            />
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
