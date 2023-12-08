import { searchHistoryAtom } from "@/store";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Card, ListGroup, Button } from "react-bootstrap";
import styles from '@/styles/History.module.css';
import { removeFromHistory } from "@/lib/userData";

export default function SearchHistory() {
    const [searchHistoryList, setSearchHistory] = useAtom(searchHistoryAtom);
    const [parsedHistory, setParsedHistory] = useState([]);
    let router = useRouter();

    useEffect(() => {
        let parsedHistory = []

        searchHistoryList.forEach(h => {
            let params = new URLSearchParams(h);
            let entries = params.entries();
            parsedHistory.push(Object.fromEntries(entries));
        });

        setParsedHistory(parsedHistory);
    }, [searchHistoryList])

    if(!searchHistoryList) return null;

    function historyClicked(e, index) {
        router.push(`/artwork?${searchHistoryList[index]}`);
    }

    async function removeHistoryClicked(e, index) {
        e.stopPropagation();
        setSearchHistory(await removeFromHistory(searchHistoryList[index]));
    }

    return (
        <div>
            {parsedHistory.length === 0 ? (
                <Card><h4>Nothing Here</h4>Try making new searches.</Card>
            ) : (
                <ListGroup>
                    {parsedHistory.map((historyItem, index) => (
                        <ListGroup.Item
                            key={index}
                            className={styles.historyListItem}
                            onClick={e => historyClicked(e, index)}
                        >
                            {Object.keys(historyItem).map(key => (
                                <>
                                    {key}: <strong>{historyItem[key]}</strong>&nbsp;
                                </>
                            ))}
                            <Button
                                className="float-end"
                                variant="danger"
                                size="sm"
                                onClick={e => removeHistoryClicked(e, index)}
                            >
                                &times;
                            </Button>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </div>
    );

}