import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Server } from '@/api/server/getServer';
import { css } from 'styled-components/macro';
import styled from 'styled-components/macro';
import tw from 'twin.macro';
import GreyRowBox from '@/components/elements/GreyRowBox';
import Spinner from '@/components/elements/Spinner';
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

const StatusDot = styled.div<{ $status: 'online' | 'offline' | 'starting' | 'stopping' }>`
    width: 9px;
    height: 9px;
    border-radius: 50%;
    flex-shrink: 0;

    ${({ $status }) => $status === 'online' && css`
        background: #00e5a0;
        box-shadow: 0 0 8px rgba(0, 229, 160, 0.6);
    `}
    ${({ $status }) => $status === 'offline' && css`
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
    gap: 1.5rem;
    margin-left: auto;
    flex-shrink: 0;

    @media (max-width: 900px) {
        display: none;
    }
`;

const StatItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
    min-width: 80px;
`;

const StatValue = styled.span`
    font-family: 'Sora', sans-serif;
    font-size: 0.82rem;
    font-weight: 600;
    color: #e2eaf7;
`;

const StatLabel = styled.span`
    font-family: 'Sora', sans-serif;
    font-size: 0.65rem;
    font-weight: 500;
    color: #3d4f6e;
    text-transform: uppercase;
    letter-spacing: 0.06em;
`;

const ProgressWrap = styled.div`
    height: 3px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 2px;
    overflow: hidden;
    width: 80px;
    margin-top: 3px;
`;

const ProgressBar = styled.div<{ $pct: number; $warn?: boolean }>`
    height: 100%;
    border-radius: 2px;
    width: ${({ $pct }) => Math.min($pct, 100)}%;
    background: ${({ $warn, $pct }) =>
        $pct > 90 ? 'linear-gradient(90deg, #ff4757, #ff6b6b)' :
        $warn ? 'linear-gradient(90deg, #ffb300, #ffd000)' :
        'linear-gradient(90deg, #00b4ff, #0088cc)'};
    box-shadow: ${({ $pct }) => $pct > 90 ? '0 0 6px rgba(255,71,87,0.4)' : '0 0 6px rgba(0,180,255,0.3)'};
    transition: width 0.5s ease;
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

type Status = 'online' | 'offline' | 'starting' | 'stopping';

function getStatus(status: string | undefined): Status {
    switch (status) {
        case 'running': return 'online';
        case 'starting': return 'starting';
        case 'stopping': return 'stopping';
        default: return 'offline';
    }
}

function statusLabel(s: Status): string {
    switch (s) {
        case 'online': return 'Online';
        case 'starting': return 'Starting';
        case 'stopping': return 'Stopping';
        default: return 'Offline';
    }
}

// ─── Component ────────────────────────────────────────────────────────────────

type Props = {
    server: Server;
    className?: string;
};

const ServerRow = ({ server, className }: Props) => {
    const status = getStatus(server.status);

    const cpuPct = server.limits.cpu > 0
        ? Math.round((server.cpu / (server.limits.cpu * 10)) * 100)
        : Math.round(server.cpu / 10);

    const ramUsed = bytesToString(mbToBytes(server.memory));
    const ramLimit = server.limits.memory > 0 ? bytesToString(mbToBytes(server.limits.memory)) : '∞';
    const ramPct = server.limits.memory > 0
        ? Math.round((server.memory / server.limits.memory) * 100)
        : 0;

    const diskUsed = bytesToString(mbToBytes(server.disk));
    const diskLimit = server.limits.disk > 0 ? bytesToString(mbToBytes(server.limits.disk)) : '∞';
    const diskPct = server.limits.disk > 0
        ? Math.round((server.disk / server.limits.disk) * 100)
        : 0;

    return (
        <Row to={`/server/${server.id}`} className={className}>
            <StatusDot $status={status} />

            <ServerIcon>🖥️</ServerIcon>

            <div style={{ flex: 1, minWidth: 0 }}>
                <ServerName>{server.name}</ServerName>
                <ServerAddress>
                    {ip(server.allocations.filter(a => a.isDefault)[0]?.ip ?? '')}
                    :{server.allocations.filter(a => a.isDefault)[0]?.port ?? ''}
                    &nbsp;·&nbsp;
                    <span style={{ color: status === 'online' ? '#00e5a0' : status === 'offline' ? '#ff4757' : '#ffb300' }}>
                        {statusLabel(status)}
                    </span>
                </ServerAddress>
            </div>

            <StatsGrid>
                {/* CPU */}
                <StatItem>
                    <StatValue>{server.cpu > 0 ? `${(server.cpu / 100).toFixed(1)}%` : '—'}</StatValue>
                    <ProgressWrap>
                        <ProgressBar $pct={cpuPct} $warn={cpuPct > 75} />
                    </ProgressWrap>
                    <StatLabel>CPU</StatLabel>
                </StatItem>

                {/* RAM */}
                <StatItem>
                    <StatValue>{server.memory > 0 ? ramUsed : '—'}</StatValue>
                    <ProgressWrap>
                        <ProgressBar $pct={ramPct} $warn={ramPct > 75} />
                    </ProgressWrap>
                    <StatLabel>of {ramLimit}</StatLabel>
                </StatItem>

                {/* Disk */}
                <StatItem>
                    <StatValue>{server.disk > 0 ? diskUsed : '—'}</StatValue>
                    <ProgressWrap>
                        <ProgressBar $pct={diskPct} $warn={diskPct > 75} />
                    </ProgressWrap>
                    <StatLabel>of {diskLimit}</StatLabel>
                </StatItem>
            </StatsGrid>
        </Row>
    );
};

export default memo(ServerRow, isEqual);
