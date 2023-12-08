import { useAtom } from "jotai";
import { Row, Col, Card } from "react-bootstrap";
import { favouritesAtom } from "@/store";
import ArtworkCard from "@/components/ArtworkCard";

export default function Favourites() {
    const [favouritesList] = useAtom(favouritesAtom);

    if(!favouritesList) return null;

    return (
        <div>
            {favouritesList.length === 0 ? (
                <Card><h4>Nothing Here</h4>Try add new favourite artwork.</Card>
            ) : (
                <Row className="gy-4">
                    {favouritesList.map(currentObjectID => (
                        <Col lg={3} key={currentObjectID}>
                            <ArtworkCard objectID={currentObjectID} />
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );

}