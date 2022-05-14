import { useState, useEffect } from 'react';
import API from './api';

const getSetting = () => {
    const [setting, setState] = useState({
        twitter_url: "",
        discord_url: "",
        wallet_address: "",
    });
    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const response = await API.getJSONData('/setting');
        setState(response.setting);
    }
    return setting;
}

export default {
    getSetting
} 