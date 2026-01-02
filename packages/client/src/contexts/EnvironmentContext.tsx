import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';

export interface EnvironmentConfig {
    WEB_PUSH_PUBKEY: string;
    NOAUTHD_URL: string;
    DOMAIN: string;
    ADMIN_DOMAIN: string;
    RELAY: string;
    NSEC_APP_NPUB: string;
    ENCLAVE_LAUNCHER_PUBKEYS: string;
    ENCLAVE_DEBUG: string;
    HOSTED: boolean;
}

const EnvironmentContext = createContext<EnvironmentConfig | null>(null);

export const EnvironmentProvider = ({ children }: { children: ReactNode }) => {
    const config = useMemo<EnvironmentConfig>(() => {
        // Get configuration from window.ENV (generated at container startup)
        const env = (window as any).ENV || {};

        return Object.freeze({
            WEB_PUSH_PUBKEY: env.WEB_PUSH_PUBKEY || '',
            NOAUTHD_URL: env.NOAUTHD_URL || '',
            DOMAIN: env.DOMAIN || '',
            ADMIN_DOMAIN: env.ADMIN_DOMAIN || '',
            RELAY: env.RELAY || 'wss://relay.nsec.app',
            NSEC_APP_NPUB: env.NSEC_APP_NPUB || '',
            ENCLAVE_LAUNCHER_PUBKEYS: env.ENCLAVE_LAUNCHER_PUBKEYS || '3356de61b39647931ce8b2140b2bab837e0810c0ef515bbe92de0248040b8bdd',
            ENCLAVE_DEBUG: env.ENCLAVE_DEBUG || '',
            HOSTED: env.HOSTED === 'true',
        });
    }, []); // Evaluated once on mount

    return <EnvironmentContext.Provider value={config}>{children}</EnvironmentContext.Provider>;
};

export const useEnvironment = () => {
    const context = useContext(EnvironmentContext);
    if (!context) {
        throw new Error('useEnvironment must be used within EnvironmentProvider');
    }
    return context;
};
