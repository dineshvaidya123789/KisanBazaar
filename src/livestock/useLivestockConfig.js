import { useEffect, useState } from 'react';
import { subscribeConfig } from './livestockService';
import { mergeConfig } from './config';

// Live settings (admin switch, categories, breeds...). `loaded` is false until the first answer.
export const useLivestockConfig = () => {
    const [config, setConfig] = useState(mergeConfig({}));
    const [loaded, setLoaded] = useState(false);
    useEffect(() => subscribeConfig((c) => { setConfig(c); setLoaded(true); }), []);
    return { config, loaded };
};
