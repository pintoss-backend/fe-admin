import React from 'react';
import { getStatusTag } from '../lib/format';
import type { Member } from '../model';

export const StatusTag: React.FC<{ member: Member }> = ({ member }) => getStatusTag(member);
