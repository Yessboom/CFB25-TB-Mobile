import RosterDetailScreen from '@/components/rosters/RosterDetails';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';



const RosterDetailPage = () => {
    const {rosterId} = useLocalSearchParams<{rosterId: string}>();
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    if (!rosterId) {
        return null; // TODO: Add error handling
    }

    return (
        <RosterDetailScreen
            rosterId={rosterId}
            onBack={handleBack}
        />
    );
}
export default RosterDetailPage;