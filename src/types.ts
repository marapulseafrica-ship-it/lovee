/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LoveSection {
  id: string;
  title: string;
  subtitle?: string;
  paragraphs: string[];
  osMetrics?: {
    label: string;
    value: string;
    icon?: string;
  }[];
}

export interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  rotation: number;
  pulseSpeed: number;
  color: string;
  type: 'heart' | 'star' | 'rose' | 'sparkle';
}
