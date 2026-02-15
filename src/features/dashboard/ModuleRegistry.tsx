import { lazy, LazyExoticComponent } from 'react';
import type { ModuleId } from '../../types';

export interface DashboardModule {
  id: ModuleId;
  label: string;
  icon: string;
  component: LazyExoticComponent<() => JSX.Element>;
}

const OverviewModule = lazy(() => import('../overview/OverviewModule'));
const NewEntryModule = lazy(() => import('../newEntry/NewEntryModule'));
const HistoryModule = lazy(() => import('../history/HistoryModule'));

export const moduleRegistry: DashboardModule[] = [
  { id: 'overview', label: 'Overview', icon: '🏠', component: OverviewModule },
  { id: 'newEntry', label: 'New Entry', icon: '📝', component: NewEntryModule },
  { id: 'history', label: 'History', icon: '🕘', component: HistoryModule }
];
