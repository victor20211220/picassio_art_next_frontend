import http from "./http-common";
const SERVER_URL = process.env.NEXT_PUBLIC_APIURL;
const getJSONData = (url) => {
    return new Promise(resolve => {
        fetch(`${SERVER_URL}/api${url}`)
            .then((res) => res.json())
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                console.log('Error! ' + error.message)
                resolve([]);
            })
    })
}
const fetchBlockchains = () => {
    return new Promise(resolve => {
        getJSONData('/blockchains').then(result => {
            let blockchains = [];
            result.map(item => {
                // blockchains[item.id] = { name: item.name, image: item.image }
                blockchains.push({ value: item.id, label: item.name, image: item.image })
            })
            resolve(blockchains);
        })
    })
}

const getTwitterFollowersCount = (link) => {
    try {
        let url = new URL(link);
        return new Promise(resolve => {
            if(SERVER_URL === "http://localhost:8000"){
                resolve(1);
                return;
            }
            getJSONData(`/get-twitter-followers?link=${url.pathname.substring(1)}`).then(result => {
                let count = result.length > 0 ? result[0].followers_count : 0;
                resolve(count);
            })
        })
    } catch (_) {
        return new Promise((resolve) => resolve(0));
    }
}
const discordAPIUrl = "https://discord.com/api/invites";
const getDiscordMembersCount = (link) => {
    const url = new URL(link);
    return new Promise(resolve => {
        resolve(1);
        return;
        fetch(`${discordAPIUrl}${url.pathname}?with_counts=1`,
            {
                headers: {
                    'Authorization': 'OTU2MTc5MDE0MDM5NTI3NDg1.YjsdGQ.WopwOzXUgb0eX3P9GVnlJe3shBc'
                },
                mode: 'no-cors'
            }
        ).then((res) => res.json())
            .then(result => {
                let count = "approximate_member_count" in result ? result.approximate_member_count : 0;
                resolve(count);
            })
            .catch(error => {
                console.log('Error! ' + error.message)
                resolve(0);
            })
    })
}
const listProject = data => {
    return http.post("/calendar", data);
};

const promoProject = data => {
    return http.post("/promos", data);
};

export default {
    SERVER_URL,
    getJSONData,
    fetchBlockchains,
    getTwitterFollowersCount,
    getDiscordMembersCount,
    listProject,
    promoProject,
};