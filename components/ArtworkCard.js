import Error from "next/error";
import Link from "next/link";
import { Button, Card } from "react-bootstrap";
import useSWR from "swr";

const fetcher = url => fetch(url).then(res => res.json());

export default function ArtworkCard({ objectID }) {
    const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`, fetcher);

    if (error) return <Error statusCode={404} />
    if (!data) return null

    return (
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={data.primaryImageSmall ? data.primaryImageSmall : "https://via.placeholder.com/375x375.png?text=[+Not+Available+]"} />
            <Card.Body>
                <Card.Title>{data.title ? data.title : "N/A"}</Card.Title>
                <Card.Text>
                    <p><b>Date:</b>           {data.objectDate ? data.objectDate : "N/A"}</p>
                    <p><b>Classification:</b> {data.classification ? data.classification : "N/A"}</p>
                    <p><b>Medium:</b>         {data.medium ? data.medium : "N/A"}</p>
                </Card.Text>
                <Link href={`/artwork/${objectID}`} passHref>
                    <Button variant="primary"><b>ID:</b> {objectID}</Button>
                </Link>
            </Card.Body>
        </Card>
    )
}