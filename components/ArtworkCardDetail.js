import useSWR from "swr";
import Error from "next/error";
import { Button, Card } from "react-bootstrap";
import { useAtom, useAtomValue } from "jotai";
import { favouritesAtom } from "@/store";
import { useState, useEffect } from "react";
import { addToFavourites, removeFromFavourites } from "@/lib/userData";


const fetcher = url => fetch(url).then(res => res.json());

export default function ArtworkCardDetailed({ objectID }) {
    const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`, fetcher);
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
    const [showAdded, setShowAdded] = useState(false);

    useEffect(() => {
        setShowAdded(favouritesList?.includes(objectID));
    }, [favouritesList, objectID]);

    async function favouritesClicked() {
        if (showAdded) {
            setFavouritesList(await removeFromFavourites(objectID));
        }
        else {
            setFavouritesList(await addToFavourites(objectID));
        }
        setShowAdded(!showAdded);
    }

    if (error) return <Error statusCode={404} />
    if (!data) return null

    return (
        <Card>
            {data.primaryImage ? <Card.Img variant="top" src={data.primaryImage} /> : ""}
            <Card.Body>
                <Card.Title>{data.title ? data.title : "N/A"}</Card.Title>
                <Card.Text>
                    <p><b>Date:</b>           {data.objectDate ? data.objectDate : "N/A"}</p>
                    <p><b>Classification:</b> {data.classification ? data.classification : "N/A"}</p>
                    <p><b>Medium:</b>         {data.medium ? data.medium : "N/A"}</p>
                    <br />
                    <br />
                    <p><b>Artist:</b>      {data.artistDisplayName ? data.artistDisplayName + " " : "N/A"}{data.artistDisplayName && data.artistWikidata_URL ? (<a href={data.artistWikidata_URL} target="_blank" rel="noreferrer">Wiki</a>) : ""}</p>
                    <p><b>Credit Line:</b> {data.creditLine ? data.creditLine : "N/A"}</p>
                    <p><b>Dimensions:</b>  {data.dimensions ? data.dimensions : "N/A"}</p>
                    <Button variant={showAdded ? "primary" : "outline-primary"} onClick={() => favouritesClicked()}>+ Favourite {showAdded && "(added)"}</Button>
                </Card.Text>
            </Card.Body>
        </Card>
    )
}