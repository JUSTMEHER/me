import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Server } from '@/api/server/getServer';
import { ServerStatus } from '@/api/server/types';
import styled, { css } from 'styled-components/macro';
import { bytesToString, ip, mbToBytes } from '@/lib/formatters';
import isEqual from 'react-fast-compare';

// ─── Styled Components ────────────────────────────────────────────────────────

const Row = styled(Link)`
    display: flex;
    align-items: center;
    gap: 1rem;
    background: #0d1321;
    border: 1px solid rgba(0, 180, 255, 0.07);
    border-radius: 14px;
    padding: 1rem 1.25rem;
    text-decoration: none;
    color: inherit;
    margin-bottom: 0.5rem;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;

    &:hover {
        border-color: rgba(0, 180, 255, 0.22);
        background: #111827;
        box-shadow: 0 4px 24px rgba(0, 180, 255, 0.07);
        transform: translateX(2px);
    }

    &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background: transparent;
        transition: background 0.2s ease;
        border-radius: 0 2px 2px 0;
    }

    &:hover::before {
        background: rgba(0, 180, 255, 0.5);
    }
`;

const StatusDot = styled.div<{ $status: string }>`
    width: 9px;
    height: 9px;
    border-radius: 50%;
    flex-shrink: 0;

    ${({ $status }) => $status === 'running' && css`
        background: #00e5a0;
        box-shadow: 0 0 8px rgba(0, 229, 160, 0.6);
    `}
    ${({ $status }) => ($status === 'offline' || $status === 'null') && css`
        background: #ff4757;
        box-shadow: 0 0 8px rgba(255, 71, 87, 0.5);
    `}
    ${({ $status }) => ($status === 'starting' || $status === 'stopping') && css`
        background: #ffb300;
        box-shadow: 0 0 8px rgba(255, 179, 0, 0.5);
        animation: pulse 1.5s infinite;

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.35; }
        }
    `}
`;

const ServerIcon = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: rgba(0, 180, 255, 0.08);
    border: 1px solid rgba(0, 180, 255, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 1rem;
    color: #00b4ff;
    font-weight: 700;
    font-family: 'Sora', sans-serif;
`;

const ServerName = styled.p`
    font-family: 'Sora', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    color: #e2eaf7;
    margin: 0;
    letter-spacing: -0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ServerAddress = styled.p`
    font-family: 'Sora', sans-serif;
    font-size: 0.72rem;
    color: #6b7fa3;
    margin: 0.15rem 0 0;
    font-weight: 400;
`;

const StatsGrid = styled.div`
    display: flex;
    align-items: center;
    gap: 1.25rem;
    margin-left: auto;
    flex-shrink: 0;

    @media (max-width: 900px) {
        display: none;
    }
`;

const StatChip = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 1px;
    min-width: 72px;
`;

const StatValue = styled.span`
    font-family: 'Sora', sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    color: #e2eaf7;
`;

const StatLabel = styled.span`
    font-family: 'Sora', sans-serif;
    font-size: 0.62rem;
    font-weight: 500;
    color: #3d4f6e;
    text-transform: uppercase;
    letter-spacing: 0.06em;
`;

const StatusBadge = styled.span<{ $status: string }>`
    font-family: 'Sora', sans-serif;
    font-size: 0.68rem;
    font-weight: 600;
    padding: 0.2rem 0.55rem;
    border-radius: 6px;
    letter-spacing: 0.04em;
    flex-shrink: 0;

    ${({ $status }) => $status === 'running' && css`
        background: rgba(0, 229, 160, 0.1);
        color: #00e5a0;
        border: 1px solid rgba(0, 229, 160, 0.2);
    `}
    ${({ $status }) => ($status === 'offline' || $status === 'null') && css`
        background: rgba(255, 71, 87, 0.1);
        color: #ff4757;
        border: 1px solid rgba(255, 71, 87, 0.2);
    `}
    ${({ $status }) => ($status === 'starting' || $status === 'stopping') && css`
        background: rgba(255, 179, 0, 0.1);
        color: #ffb300;
        border: 1px solid rgba(255, 179, 0, 0.2);
    `}
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function humanStatus(status: ServerStatus | null): string {
    switch (status) {
        case 'running':  return 'Online';
        case 'starting': return 'Starting';
        case 'stopping': return 'Stopping';
        default:         return 'Offline';
    }
}

function formatLimit(value: number, unit: string): string {
    if (value === 0) return '\u221e';
    if (unit === 'mb') return bytesToString(mbToBytes(value));
    return `${value}${unit}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

type Props = {
    server: Server;
    className?: string;
};

const ServerRow = ({ server, className }: Props) => {
    const defaultAlloc = server.allocations.find(a => a.isDefault);
    const statusStr = server.status ?? 'offline';

    const ramLimit  = formatLimit(server.limits.memory, 'mb');
    const diskLimit = formatLimit(server.limits.disk, 'mb');
    const cpuLimit  = server.limits.cpu === 0 ? '\u221e' : `${server.limits.cpu}%`;

    const initial = server.name.charAt(0).toUpperCase();

    return (
        <Row to={`/server/${server.id}`} className={className}>
            <StatusDot $status={statusStr} />

            <ServerIcon>{initial}</ServerIcon>

            <div style={{ flex: 1, minWidth: 0 }}>
                <ServerName>{server.name}</ServerName>
                <ServerAddress>
                    {defaultAlloc ? `${ip(defaultAlloc.ip)}:${defaultAlloc.port}` : 'No allocation'}
                    {server.node && <>&nbsp;&middot;&nbsp;{server.node}</>}
                </ServerAddress>
            </div>

            <StatsGrid>
                <StatChip>
                    <StatValue>{cpuLimit}</StatValue>
                    <StatLabel>CPU</StatLabel>
                </StatChip>

                <StatChip>
                    <StatValue>{ramLimit}</StatValue>
                    <StatLabel>RAM</StatLabel>
                </StatChip>

                <StatChip>
                    <StatValue>{diskLimit}</StatValue>
                    <StatLabel>Disk</StatLabel>
                </StatChip>
            </StatsGrid>

            <StatusBadge $status={statusStr}>
                {humanStatus(server.status)}
            </StatusBadge>
        </Row>
    );
};

export default memo(ServerRow, isEqual);
