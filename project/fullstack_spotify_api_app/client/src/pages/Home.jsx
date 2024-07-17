import React, { useEffect, useState } from "react";
import { Container, Card, Row, Spinner } from "react-bootstrap";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase_config";

function Home() {
    const [albumsList, setAlbumsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const albumsCollectionRef = collection(db, "albums");
    useEffect(() => {
        const getDbAlbums = async () => {
            const data = await getDocs(albumsCollectionRef);
            setIsLoading(false);
            setAlbumsList(data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id
            })));
        };
        getDbAlbums();
        console.log("UseEffect ran");
    }, []);
    return (
        <Container>
            <Row className="mx-2 row row-cols-5">
                {isLoading == true ? (<div className="loading"><div><Spinner animation="grow" /></div></div>) :
                    (
                        albumsList.map((album) => {
                            return (
                                <Card>
                                    <div className="img-size">
                                        <Card.Img fluid src={album.image} />
                                    </div>
                                    <Card.Body>
                                        <Card.Title>{album.name}</Card.Title>
                                        <Card.Text>
                                            <p><strong>Artist</strong>: {album.artists}</p>
                                            <p><strong>Release Date</strong>: {album.release_date}</p>
                                            <p><strong>Total Tracks</strong>: {album.total_tracks}</p>
                                            <hr />
                                            <p>Posted by <strong>{album.author.name}</strong></p>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            )
                        })
                    )}
            </Row>
        </Container>
    )
}

export default Home;