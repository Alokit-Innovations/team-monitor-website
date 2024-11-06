import React from 'react';
import { RepoProvider } from '../../utils/providerAPI';
import Button from '../Button';

interface TriggerContentProps {
    selectedProvider?: RepoProvider;
    selectedInstallationType: string;
    selectedHosting: string;
    bitbucket_auth_url: string;
}

const TriggerContent: React.FC<TriggerContentProps> = ({ selectedProvider, selectedHosting, selectedInstallationType, bitbucket_auth_url }) => {
    const triggerContent = () => {
        if (selectedProvider === 'github') {
            if (selectedInstallationType === 'individual') {
                return (
                    <div>You are all set!</div>
                )
            }
            return (
                <>
                    <Button
                        id='github-app-install'
                        variant="contained"
                        href="https://github.com/apps/vibinex-dpu"
                        target='_blank'
                    >
                        Install Github App
                    </Button>
                    <small className='block ml-4'>Note: You will need the permissions required to install a Github App</small>
                </>
            );
        } else if (selectedProvider === 'bitbucket') {
            if (selectedHosting == 'selfhosting' && selectedInstallationType == 'individual') {
                return (
                    <div>Coming Soon!</div>
                )
            }
            console.debug(`[TriggerContent] url: `, bitbucket_auth_url)
            return (
                <>
                    <Button
                        id='authorise-bitbucket-oauth-consumer'
                        variant="contained"
                        href={bitbucket_auth_url}
                        target='_blank'
                        disabled={!bitbucket_auth_url}
                    >
                        Authorise Bitbucket OAuth Consumer
                    </Button>
                    <small className='block ml-4'>Note: You will need the permissions required to install an OAuth consumer</small>
                </>
            );
        } else {
            return <></>;
        }
    };

    return (
        <div>
            {triggerContent()}
        </div>
    );
};

export default TriggerContent;
