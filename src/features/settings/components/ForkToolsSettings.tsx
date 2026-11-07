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
import { ListSubheader } from '@/base/components/lists/ListSubheader.tsx';
import type { PartialSettingsTypeInput, SettingsType } from '@/lib/graphql/generated/graphql-base.types.ts';

export type ForkToolSettings = Pick<
    SettingsType,
    'forkStockMode' | 'mergeEnabled' | 'duplicatesEnabled' | 'reindexEnabled' | 'doctorEnabled'
>;

type ForkToolsSettingsProps = {
    settings: ForkToolSettings;
    updateSettings: (settings: PartialSettingsTypeInput) => Promise<void>;
};

export const ForkToolsSettings = ({ settings, updateSettings }: ForkToolsSettingsProps) => {
    const { t } = useLingui();
    const dependentSwitchDisabled = settings.forkStockMode;

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
