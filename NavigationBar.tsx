import * as React from 'react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCogs, faLayerGroup, faSignOutAlt, faBell } from '@fortawesome/free-solid-svg-icons';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import http from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import Avatar from '@/components/Avatar';
import styled from 'styled-components/macro';

const NavBar = styled.nav`
    background: rgba(8, 12, 20, 0.85);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(0, 180, 255, 0.08);
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 1.5rem;
    position: sticky;
    top: 0;
    z-index: 50;
    gap: 1rem;
`;

const NavBrand = styled(Link)`
    display: flex;
    align-items: center;
    gap: 0.6rem;
    text-decoration: none;
    margin-right: auto;

    .brand-icon {
        width: 30px;
        height: 30px;
        background: linear-gradient(135deg, #00b4ff, #0066aa);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 1rem;
        color: #fff;
        font-family: 'Sora', sans-serif;
        box-shadow: 0 0 12px rgba(0, 180, 255, 0.3);
    }

    .brand-name {
        font-family: 'Sora', sans-serif;
        font-weight: 700;
        font-size: 1rem;
        color: #e2eaf7;
        letter-spacing: -0.02em;
    }

    .brand-name span {
        color: #00b4ff;
    }

    @media (max-width: 768px) {
        .brand-name { display: none; }
    }
`;

const NavActions = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const NavButton = styled.button`
    background: rgba(0, 180, 255, 0.06);
    border: 1px solid rgba(0, 180, 255, 0.1);
    border-radius: 8px;
    color: #6b7fa3;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s ease;
    font-size: 0.85rem;

    &:hover {
        background: rgba(0, 180, 255, 0.12);
        color: #00b4ff;
        border-color: rgba(0, 180, 255, 0.25);
    }
`;

const NavLink2 = styled(NavButton).attrs({ as: Link })`
    text-decoration: none;
`;

const HamburgerBtn = styled(NavButton)`
    display: none;

    @media (max-width: 768px) {
        display: flex;
    }
`;

const UserChip = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.75rem 0.25rem 0.25rem;
    background: rgba(0, 180, 255, 0.06);
    border: 1px solid rgba(0, 180, 255, 0.1);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
        background: rgba(0, 180, 255, 0.1);
        border-color: rgba(0, 180, 255, 0.2);
    }

    img {
        width: 28px;
        height: 28px;
        border-radius: 6px;
    }

    .user-name {
        font-family: 'Sora', sans-serif;
        font-size: 0.8rem;
        font-weight: 600;
        color: #e2eaf7;
    }
`;

const onTriggerNavButton = () => {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active-nav');
    }
};

export default () => {
    const name = useStoreState((state: ApplicationStore) => state.settings.data!.name);
    const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data!.rootAdmin);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const onTriggerLogout = () => {
        setIsLoggingOut(true);
        http.post('/auth/logout').finally(() => {
            // @ts-expect-error this is not a react-router'd page
            window.location = '/';
        });
    };

    return (
        <NavBar>
            <SpinnerOverlay visible={isLoggingOut} />

            <HamburgerBtn onClick={onTriggerNavButton}>
                <FontAwesomeIcon icon={faBars} />
            </HamburgerBtn>

            <NavBrand to={'/'}>
                <div className='brand-icon'>M</div>
                <span className='brand-name'>
                    Mekudo <span>Nodes</span>
                </span>
            </NavBrand>

            <SearchContainer />

            <NavActions>
                {rootAdmin && (
                    <NavLink2 to={'/admin'}>
                        <FontAwesomeIcon icon={faCogs} />
                    </NavLink2>
                )}
                <NavLink2 to={'/'}>
                    <FontAwesomeIcon icon={faLayerGroup} />
                </NavLink2>
                <NavButton onClick={onTriggerLogout} title='Sign out'>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                </NavButton>
            </NavActions>
        </NavBar>
    );
};
