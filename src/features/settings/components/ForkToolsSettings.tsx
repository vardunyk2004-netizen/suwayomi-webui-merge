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
    DOCTOR_SCHEDULE_SELECT_VALUES,
    MERGE_CHAPTER_DISPLAY_SELECT_VALUES,
    MERGE_DEDUPE_STRATEGY_SELECT_VALUES,
    MERGE_DEFAULT_MODE_SELECT_VALUES,
    MERGE_OFFLINE_MODE_SELECT_VALUES,
    MERGE_OPDS_VISIBILITY_SELECT_VALUES,
    MERGE_UNNUMBERED_MATCHING_SELECT_VALUES,
    PROGRESS_BOOKMARK_POLICY_SELECT_VALUES,
    PROGRESS_CONFLICT_POLICY_SELECT_VALUES,
    PROGRESS_DIRECTION_SELECT_VALUES,
    REINDEX_ADOPT_MODE_SELECT_VALUES,
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
    | 'duplicatesStrongThreshold'
    | 'duplicatesMinThreshold'
    | 'duplicatesWeightTitle'
    | 'duplicatesWeightCoreTitle'
    | 'duplicatesWeightToken'
    | 'duplicatesWeightAlias'
    | 'duplicatesWeightUrl'
    | 'duplicatesWeightChapter'
    | 'duplicatesWeightThumbnail'
    | 'duplicatesWeightTracker'
    | 'reindexEnabled'
    | 'reindexDefaultDryRun'
    | 'reindexAllowFuzzy'
    | 'reindexAdoptMode'
    | 'doctorEnabled'
    | 'doctorSchedule'
>;

type ForkToolsSettingsProps = {
    settings: ForkToolSettings;
    updateSettings: (settings: PartialSettingsTypeInput) => Promise<void>;
};

export const ForkToolsSettings = ({ settings, updateSettings }: ForkToolsSettingsProps) => {
    const { t } = useLingui();
    const dependentSwitchDisabled = settings.forkStockMode;
    const mergeSettingsDisabled = dependentSwitchDisabled || !settings.mergeEnabled;
    const duplicateSettingsDisabled = dependentSwitchDisabled || !settings.duplicatesEnabled;
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
                    slotProps={{ input: { 'aria-label': t`Fork stock mode` } }}
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
                    slotProps={{ input: { 'aria-label': t`Manga merging` } }}
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
                    slotProps={{ input: { 'aria-label': t`Fallback sources` } }}
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
                    slotProps={{ input: { 'aria-label': t`Download mirror chapters once` } }}
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
                    slotProps={{ input: { 'aria-label': t`Chapter-level merge and split` } }}
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
                    slotProps={{ input: { 'aria-label': t`Revalidate splits on update` } }}
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
                    slotProps={{ input: { 'aria-label': t`Synchronize reading progress` } }}
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
                    slotProps={{ input: { 'aria-label': t`Keep read progress monotonic` } }}
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
                    slotProps={{ input: { 'aria-label': t`Enable trash for removed fork items` } }}
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
                    slotProps={{ input: { 'aria-label': t`Restore sources when a merged manga is removed` } }}
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
                    slotProps={{ input: { 'aria-label': t`Require typed confirmation before purge` } }}
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
                    slotProps={{ input: { 'aria-label': t`Reapply merge plan on source updates` } }}
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
                    slotProps={{ input: { 'aria-label': t`Continue after a source update failure` } }}
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
                    slotProps={{ input: { 'aria-label': t`Detect removed source chapters` } }}
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
                    slotProps={{ input: { 'aria-label': t`Exclude merge data from SyncYomi` } }}
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
                    slotProps={{ input: { 'aria-label': t`Include merge data` } }}
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
                    slotProps={{ input: { 'aria-label': t`Flatten merged export` } }}
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
                    slotProps={{ input: { 'aria-label': t`Duplicate detection` } }}
                    disabled={dependentSwitchDisabled}
                    onChange={(event) => updateSettings({ duplicatesEnabled: event.target.checked })}
                />
            </ListItem>
            <NumberSetting
                settingTitle={t`Strong duplicate match threshold`}
                dialogDescription={t`Set the minimum 0–100 score for a strong duplicate match.`}
                settingValue={settings.duplicatesStrongThreshold.toString()}
                value={settings.duplicatesStrongThreshold}
                defaultValue={88}
                minValue={50}
                maxValue={100}
                stepSize={1}
                valueUnit={t`points`}
                disabled={duplicateSettingsDisabled}
                disabledDescription={t`Enable duplicate detection to change this setting.`}
                handleUpdate={(value) => updateSettings({ duplicatesStrongThreshold: value })}
            />
            <NumberSetting
                settingTitle={t`Minimum duplicate candidate threshold`}
                dialogDescription={t`Set the minimum 0–100 score for a duplicate candidate to be shown.`}
                settingValue={settings.duplicatesMinThreshold.toString()}
                value={settings.duplicatesMinThreshold}
                defaultValue={74}
                minValue={30}
                maxValue={95}
                stepSize={1}
                valueUnit={t`points`}
                disabled={duplicateSettingsDisabled}
                disabledDescription={t`Enable duplicate detection to change this setting.`}
                handleUpdate={(value) => updateSettings({ duplicatesMinThreshold: value })}
            />
            <NumberSetting
                settingTitle={t`Full title score weight`}
                dialogDescription={t`Set the score weight for an exact full-title match.`}
                settingValue={settings.duplicatesWeightTitle.toFixed(2)}
                value={settings.duplicatesWeightTitle}
                defaultValue={0.25}
                minValue={0}
                maxValue={1}
                stepSize={0.01}
                valueUnit=""
                disabled={duplicateSettingsDisabled}
                disabledDescription={t`Enable duplicate detection to change this setting.`}
                handleUpdate={(value) => updateSettings({ duplicatesWeightTitle: value })}
            />
            <NumberSetting
                settingTitle={t`Core title score weight`}
                dialogDescription={t`Set the score weight for the normalized core title.`}
                settingValue={settings.duplicatesWeightCoreTitle.toFixed(2)}
                value={settings.duplicatesWeightCoreTitle}
                defaultValue={0.2}
                minValue={0}
                maxValue={1}
                stepSize={0.01}
                valueUnit=""
                disabled={duplicateSettingsDisabled}
                disabledDescription={t`Enable duplicate detection to change this setting.`}
                handleUpdate={(value) => updateSettings({ duplicatesWeightCoreTitle: value })}
            />
            <NumberSetting
                settingTitle={t`Shared title token score weight`}
                dialogDescription={t`Set the score weight for shared title tokens.`}
                settingValue={settings.duplicatesWeightToken.toFixed(2)}
                value={settings.duplicatesWeightToken}
                defaultValue={0.15}
                minValue={0}
                maxValue={1}
                stepSize={0.01}
                valueUnit=""
                disabled={duplicateSettingsDisabled}
                disabledDescription={t`Enable duplicate detection to change this setting.`}
                handleUpdate={(value) => updateSettings({ duplicatesWeightToken: value })}
            />
            <NumberSetting
                settingTitle={t`Alias score weight`}
                dialogDescription={t`Set the score weight for known title aliases.`}
                settingValue={settings.duplicatesWeightAlias.toFixed(2)}
                value={settings.duplicatesWeightAlias}
                defaultValue={0.1}
                minValue={0}
                maxValue={1}
                stepSize={0.01}
                valueUnit=""
                disabled={duplicateSettingsDisabled}
                disabledDescription={t`Enable duplicate detection to change this setting.`}
                handleUpdate={(value) => updateSettings({ duplicatesWeightAlias: value })}
            />
            <NumberSetting
                settingTitle={t`URL score weight`}
                dialogDescription={t`Set the score weight for matching source URLs.`}
                settingValue={settings.duplicatesWeightUrl.toFixed(2)}
                value={settings.duplicatesWeightUrl}
                defaultValue={0.1}
                minValue={0}
                maxValue={1}
                stepSize={0.01}
                valueUnit=""
                disabled={duplicateSettingsDisabled}
                disabledDescription={t`Enable duplicate detection to change this setting.`}
                handleUpdate={(value) => updateSettings({ duplicatesWeightUrl: value })}
            />
            <NumberSetting
                settingTitle={t`Chapter-list score weight`}
                dialogDescription={t`Set the score weight for chapter-list similarity.`}
                settingValue={settings.duplicatesWeightChapter.toFixed(2)}
                value={settings.duplicatesWeightChapter}
                defaultValue={0.1}
                minValue={0}
                maxValue={1}
                stepSize={0.01}
                valueUnit=""
                disabled={duplicateSettingsDisabled}
                disabledDescription={t`Enable duplicate detection to change this setting.`}
                handleUpdate={(value) => updateSettings({ duplicatesWeightChapter: value })}
            />
            <NumberSetting
                settingTitle={t`Thumbnail similarity score weight`}
                dialogDescription={t`Set the score weight for thumbnail similarity.`}
                settingValue={settings.duplicatesWeightThumbnail.toFixed(2)}
                value={settings.duplicatesWeightThumbnail}
                defaultValue={0.05}
                minValue={0}
                maxValue={1}
                stepSize={0.01}
                valueUnit=""
                disabled={duplicateSettingsDisabled}
                disabledDescription={t`Enable duplicate detection to change this setting.`}
                handleUpdate={(value) => updateSettings({ duplicatesWeightThumbnail: value })}
            />
            <NumberSetting
                settingTitle={t`Tracker match score weight`}
                dialogDescription={t`Set the score weight for matching tracker records.`}
                settingValue={settings.duplicatesWeightTracker.toFixed(2)}
                value={settings.duplicatesWeightTracker}
                defaultValue={0.05}
                minValue={0}
                maxValue={1}
                stepSize={0.01}
                valueUnit=""
                disabled={duplicateSettingsDisabled}
                disabledDescription={t`Enable duplicate detection to change this setting.`}
                handleUpdate={(value) => updateSettings({ duplicatesWeightTracker: value })}
            />
            <ListItem>
                <ListItemText primary={t`Download reindex`} secondary={t`Enable download reindex tools.`} />
                <Switch
                    edge="end"
                    checked={settings.reindexEnabled}
                    slotProps={{ input: { 'aria-label': t`Download reindex` } }}
                    disabled={dependentSwitchDisabled}
                    onChange={(event) => updateSettings({ reindexEnabled: event.target.checked })}
                />
            </ListItem>
            <ListItem>
                <ListItemText
                    primary={t`Default dry run`}
                    secondary={
                        dependentSwitchDisabled || !settings.reindexEnabled
                            ? t`Enable download reindex to change this setting.`
                            : t`Preview proposed changes before applying any reindex repairs.`
                    }
                />
                <Switch
                    edge="end"
                    checked={settings.reindexDefaultDryRun}
                    slotProps={{ input: { 'aria-label': t`Default dry run` } }}
                    disabled={dependentSwitchDisabled || !settings.reindexEnabled}
                    onChange={(event) => updateSettings({ reindexDefaultDryRun: event.target.checked })}
                />
            </ListItem>
            <ListItem>
                <ListItemText
                    primary={t`Allow fuzzy reindex matches`}
                    secondary={
                        dependentSwitchDisabled || !settings.reindexEnabled
                            ? t`Enable download reindex to change this setting.`
                            : t`Allow fuzzy candidates; each fuzzy match still requires per-item confirmation.`
                    }
                />
                <Switch
                    edge="end"
                    checked={settings.reindexAllowFuzzy}
                    slotProps={{ input: { 'aria-label': t`Allow fuzzy reindex matches` } }}
                    disabled={dependentSwitchDisabled || !settings.reindexEnabled}
                    onChange={(event) => updateSettings({ reindexAllowFuzzy: event.target.checked })}
                />
            </ListItem>
            <SelectSetting
                settingName={t`Adopt download mode`}
                dialogDescription={t`Choose how confirmed downloads are adopted. Copy keeps the original; Move is destructive to the original location and is only used after explicit adoption.`}
                value={settings.reindexAdoptMode}
                values={REINDEX_ADOPT_MODE_SELECT_VALUES}
                disabled={dependentSwitchDisabled || !settings.reindexEnabled}
                disabledDescription={t`Enable download reindex to change this setting.`}
                handleChange={(value) => updateSettings({ reindexAdoptMode: value })}
            />
            <ListItem>
                <ListItemText
                    primary={t`Consistency checks`}
                    secondary={t`Enable library and download consistency checks.`}
                />
                <Switch
                    edge="end"
                    checked={settings.doctorEnabled}
                    slotProps={{ input: { 'aria-label': t`Consistency checks` } }}
                    disabled={dependentSwitchDisabled}
                    onChange={(event) => updateSettings({ doctorEnabled: event.target.checked })}
                />
            </ListItem>
            <SelectSetting
                settingName={t`Consistency check schedule`}
                dialogDescription={t`Choose how often consistency checks should run automatically. Off keeps checks on request; scheduled runs require consistency checks to be enabled and available.`}
                value={settings.doctorSchedule}
                values={DOCTOR_SCHEDULE_SELECT_VALUES}
                disabled={dependentSwitchDisabled || !settings.doctorEnabled}
                disabledDescription={t`Enable consistency checks to change this setting.`}
                handleChange={(value) => updateSettings({ doctorSchedule: value })}
            />
        </List>
    );
};
