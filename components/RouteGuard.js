import { favouritesAtom, searchHistoryAtom } from "@/store";
import { useAtom } from "jotai";
import { getFavourites, getHistory } from "@/lib/userData";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { isAuthenticated } from "@/lib/authenticate";

const PUBLIC_PATHS = ['/', '/login', '/register', '/_error', '/404', '/500'];

export default function RouteGuard(props) {
    const [authorized, setAuthorized] = useState(false);
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
    const [searchHistoryList, setSearchHistoryList] = useAtom(searchHistoryAtom);
    const router = useRouter();

    async function updateAtom() {
        setFavouritesList(await getFavourites());
        setSearchHistoryList(await getHistory());
    }

    useEffect(() => {
        updateAtom();
        authCheck(router.pathname);
        
        router.events.on('routeChangeStart', authCheck);

        return () => { 
            router.events.off('routeChangeStart', authCheck);
        };
    }, []);

    function authCheck(url) {
        const path = url.split("?")[0];
        if (!isAuthenticated() && !PUBLIC_PATHS.includes(path)) {
            setAuthorized(false);
            router.push('/login');
        }
        else {
            setAuthorized(true);
        }
    }

    return <>{authorized && props.children}</>;
}