import { Ionicons } from '@expo/vector-icons';
import React from 'react';

interface LucideIconProps {
  name: string;
  size?: number;
  color?: string;
}

const iconMap: { [key: string]: string } = {
  // Navigation icons
  'house.fill': 'home',
  'briefcase.fill': 'briefcase',
  'person.fill': 'person',
  'chart.bar.fill': 'bar-chart',
  'questionmark.circle.fill': 'help-circle',

  // Action icons
  'bell-outline': 'notifications-outline',
  'mic.fill': 'mic',
  'magnifyingglass': 'search',
  'plus': 'add',
  'checkmark.circle.fill': 'checkmark-circle',
  'clock.fill': 'time',
  'exclamationmark.triangle.fill': 'warning',
  'shield.fill': 'shield',
  'indianrupeesign.circle.fill': 'logo-bitcoin',
  'star.fill': 'star',
  'location.fill': 'location',
  'wrench.fill': 'construct',
  'gearshape.fill': 'settings',
  'doc.fill': 'document',
  'chart.pie.fill': 'pie-chart',
  'chart.line.uptrend.xyaxis': 'trending-up',
  'calendar': 'calendar',
  'tag.fill': 'pricetag',
  'xmark.circle.fill': 'close-circle',
  'flame.fill': 'flame',
  'scissors': 'cut',
  'bolt.fill': 'flash',
  'drop.fill': 'water',
  'hammer.fill': 'hammer',
  'zap': 'flash',

  // Additional icons used in the app
  'building.2.fill': 'business',
  'chevron.right': 'chevron-forward',
  'plus.circle.fill': 'add-circle',
  'checkmark.shield': 'shield-checkmark',
  'checkmark.shield.fill': 'shield-checkmark',
  'info.circle.fill': 'information-circle',
  'briefcase': 'briefcase',
  
  // Status icons
  'arrow.triangle.2.circlepath': 'refresh-circle',

  // Fallback
  'default': 'help-circle',
};

export function LucideIcon({ name, size = 24, color = '#000' }: LucideIconProps) {
  const iconName = iconMap[name] || iconMap['default'];

  return <Ionicons name={iconName as any} size={size} color={color} />;
} 